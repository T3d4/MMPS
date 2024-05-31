<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white w-1/3 rounded-lg p-8 shadow-md">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">Facial Recognition</h2>

      <video
        ref="video"
        class="w-2/3 mx-auto rounded-lg border-[3px] border-indigo-500 shadow-md"
        autoplay
        playsinline
        muted
      ></video>

      <p v-if="!faceDetected && !faceAuthLoading" class="text-red-500 mt-2 pl-6">
        {{ errorMessage }}
      </p>

      <div class="flex justify-center gap-4 mt-4">
        <button
          @click="closeModal"
          class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700"
        >
          Cancel
        </button>
        <button
          @click="capture"
          :disabled="!faceDetected || faceVerified || faceAuthLoading"
          :class="{
            'animate-pulse opacity-100 cursor-not-allowed': faceAuthLoading,
            'opacity-40 cursor-not-allowed': !faceDetected || faceVerified,
            'bg-indigo-600 hover:bg-indigo-700 text-white': !faceAuthLoading
          }"
          class="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          {{ faceAuthLoading ? 'Verifying...' : 'Verify' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { capturing, showCamera } from '@/global_state/state'
import * as faceapi from 'face-api.js'
import axios from 'axios'

const props = defineProps({
  show: Boolean,
  quizId: String
})

const emit = defineEmits(['close', 'verified', 'notCaptured'])

const faceDetected = ref(false)
const faceVerified = ref(false)
const video = ref(null)
const faceAuthLoading = ref(false)
const errorMessage = ref(null)
const faceCaptured = ref(false)
let faceCaptureInterval = null
let faceCaptureTimeout = null

const loadModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromUri('http://localhost:8900/models')
  await faceapi.nets.faceLandmark68Net.loadFromUri('http://localhost:8900/models')
  await faceapi.nets.faceRecognitionNet.loadFromUri('http://localhost:8900/models')
}

const startVideo = async () => {
  const constraints = { audio: false, video: true }
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    video.value.srcObject = stream
  } catch (error) {
    console.error('Error accessing camera:', error)
  }
}

const stopVideo = () => {
  if (video.value && video.value.srcObject) {
    const stream = video.value.srcObject
    const tracks = stream.getTracks()
    tracks.forEach((track) => track.stop())
    video.value.srcObject = null
  }
}

const captureAndVerifyFace = async () => {
  faceCaptureInterval = setInterval(async () => {
    try {
      faceAuthLoading.value = true
      const detection = await faceapi
        .detectSingleFace(video.value)
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (detection) {
        const faceDescriptor = Array.from(detection.descriptor)
        const response = await axios.post('/api/v1/auth/validate-face', {
          faceDescriptor,
          email: localStorage.getItem('user_email')
        })

        if (response.data.success) {
          faceVerified.value = true
          faceCaptured.value = true
          showCamera.state = false
          emit('verified')
        } else {
          errorMessage.value = 'Face not recognized. Please try again.'
        }
      } else {
        errorMessage.value = 'Face not detected. Please try again.'
      }
    } catch (error) {
      console.error(error)
      errorMessage.value = 'An error occurred during face verification.'
    } finally {
      faceAuthLoading.value = false
    }
  }, 1000)
}

watch(showCamera, async (newShowCamera) => {
  if (newShowCamera) {
    await loadModels()
    await startVideo()
    captureAndVerifyFace()

    faceCaptureTimeout = setTimeout(() => {
      if (!faceCaptured.value) {
        clearInterval(faceCaptureInterval)
        showCamera.state = false
        errorMessage.value = 'Face capture timed out. Please try again.'
        stopVideo()
        emit('notCaptured')
      }
    }, 15000)
  } else {
    clearInterval(faceCaptureInterval)
    clearTimeout(faceCaptureTimeout)
    stopVideo()
  }
})

onMounted(() => {
  if (props.show) {
    showCamera.state = true
  }
})

onBeforeUnmount(() => {
  stopVideo()
})

const closeModal = () => {
  showCamera.state = false
  capturing.state = false
  clearInterval(faceCaptureInterval)
  clearTimeout(faceCaptureTimeout)
  stopVideo()
  emit('close')
}

// const capture = () => (showCamera.state = true)

watch(
  () => faceapi.detectSingleFace(video.value).withFaceLandmarks().withFaceDescriptor(),
  (detections) => {
    faceDetected.value = !!detections
  },
  { immediate: true }
)
</script>
