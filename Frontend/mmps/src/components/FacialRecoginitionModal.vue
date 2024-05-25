<template>
  <!-- facial recognition modal -->
  <div
    v-if="props.show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white w-1/3 rounded-lg p-8 shadow-md">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">Facial Recognition</h2>

      <video
        id="video"
        ref="video"
        class="w-2/3 mx-auto rounded-lg border-[3px] border-indigo-500 shadow-md"
        autoplay
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
          @click="captureAndVerifyFace"
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
import { ref, watch, onBeforeUnmount } from 'vue'
import * as faceapi from 'face-api.js'
import router from '@/router'
import * as axios from 'axios'
import { capturing } from '@/global_state/state';

const props = defineProps({
  show: Boolean, // Controls whether the modal is visible
  quizId: String, // The ID of the quiz to take after verification
})

const emit = defineEmits(['close', 'verified', "notCaptured"])

const faceDetected = ref(false)
const faceVerified = ref(false)
const video = ref()
const faceAuthLoading = ref(false)
const errorMessage = ref(null)
const showCamera = ref(false)
const faceCaptured = ref(false)
let faceCaptureInterval = null
let faceCaptureTimeout = null


const loadModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromUri('http://localhost:8900/models')
  await faceapi.nets.faceLandmark68Net.loadFromUri('http://localhost:8900/models')
  await faceapi.nets.faceRecognitionNet.loadFromUri('http://localhost:8900/models')
}

const startVideo = () => {
  const constraints = (window.constraints = { audio: false, video: true })
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      if (video.value) {
        video.value.srcObject = stream
      }
    })
    .catch((error) => {
      console.error('Error accessing camera:', error)
    })
}

// Close the camera when navigating away from the page
onBeforeUnmount(() => {
  if (video.value && video.value.srcObject) {
    const stream = video.value.srcObject
    const tracks = stream.getTracks()
    tracks.forEach((track) => track.stop())
  }
})

const captureAndVerifyFace = async() => {
  faceCaptureInterval = setInterval(async () => {
    try {
      faceAuthLoading.value = true
      const detection = await faceapi
        .detectSingleFace(video.value)
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (detection) {
        const faceDescriptor = Array.from(detection.descriptor)
        const response = await axios.post(
          '/api/v1/auth/validate-face', // Backend endpoint for face verification
          { faceDescriptor, email: localStorage.getItem('user_email') } //send descriptor and email to be verified
        )

        if (response.data.success) {
          // Face verification successful, start the quiz
          faceVerified.value = true
          showCamera.value = false
          // Use router to navigate to the quiz page, passing the quizId
          router.push({ name: 'Quiz', params: { id: props.quizId } })
        } else {
          errorMessage.value = 'Face not recognized. Please try again.'
          // Handle verification failure (e.g., display an error message)
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
  })
}

// Close the camera when navigating away from the page
onBeforeUnmount(() => {
  if (video.value && video.value.srcObject) {
    const stream = video.value.srcObject
    const tracks = stream.getTracks()
    tracks.forEach((track) => track.stop())
  }
})

const stopVideo = () => {
  if (video.value && video.value.srcObject) {
    const stream = video.value.srcObject
    const tracks = stream.getTracks()
    tracks.forEach((track) => track.stop())
    video.value.srcObject = null
  }
}


watch(showCamera, async (newShowCamera) => {
  loadModels()
  startVideo()

  const checkFaceTimeout = () => {
    if (faceCaptured.value) {
      clearTimeout(faceCaptureTimeout)
      showCamera.value = false
      capturing.state = false
      return true
    }
    return false
  }

  if (newShowCamera) {
    if (!loadModels()) {
      await loadModels()
    }

    startVideo()
    captureAndVerifyFace()

    faceCaptureTimeout = setTimeout(() => {
      if (!checkFaceTimeout()) {
        clearInterval(faceCaptureInterval)
        showCamera.value = false
        capturing.state = false
        errorMessage.value = 'Failed to capture face... try again'
        stopVideo()
      }
    }, 15000)
  } else if (checkFaceTimeout()) {
    clearInterval(faceCaptureInterval)
  }
})

function closeModal() {
  emit('close')
  capturing.state = false
}

// Face detection watch (similar to previous code)
watch(
  () => faceapi.detectSingleFace(video.value).withFaceLandmarks().withFaceDescriptor(),
  (detections) => {
    faceDetected.value = !!detections
  },
  { immediate: true } // Run the watcher immediately on mount
)
</script>
