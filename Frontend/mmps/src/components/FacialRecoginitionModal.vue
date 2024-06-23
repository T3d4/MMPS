<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white w-[400px] rounded-lg p-8 shadow-md relative">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">Facial Recognition</h2>

      <div class="relative w-[300px] mx-auto rounded-md border-[3px] border-indigo-500 shadow-md h-[227px] flex items-center justify-center">
        <video ref="video" v-show="!isVideoLoading" class="w-full h-full" autoplay playsinline muted></video>
        <div v-if="isVideoLoading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <div class="spinner"></div>
        </div>
      </div>

      <div v-if="faceAuthLoading" class="flex justify-center mt-4">
        <div class="spinner"></div>
        <p v-if="mode === 'quiz'" class="text-gray-900 ml-2">Verifying...</p>
        <p v-else class="text-gray-900 ml-2">Capturing...</p>
      </div>

      <p v-if="!faceDetected && !faceAuthLoading" class="text-red-500 mt-2 pl-6">
        {{ errorMessage }}
      </p>

      <div class="flex justify-center gap-4 mt-4">
        <button @click="closeModal" class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700 disabled:cursor-not-allowed disabled:opacity-60">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, computed } from 'vue'
import { showCamera, cancelLoading } from '@/global_state/state'
import * as faceapi from 'face-api.js'
import { useStore } from 'vuex'
import authService from '@/services/authService'

const store = useStore()
const user = computed(() => store.getters.user)
console.log(user.value.email)

const props = defineProps({
  show: Boolean,
  mode: {
    type: String,
    required: true,
    validator: (value) => ['signup', 'quiz'].includes(value)
  },
  quizId: {
    type: String,
    required: false
  }
})
const quizId = props.quizId
const emit = defineEmits(['close', 'verified', 'notCaptured', 'faceDescriptor'])

const faceDetected = ref(false)
const faceVerified = ref(false)
const video = ref(null)
const faceAuthLoading = ref(false)
const errorMessage = ref(null)
const faceCaptured = ref(false)
const isVideoLoading = ref(true)
let faceCaptureInterval = null
let faceCaptureTimeout = null

const loadModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromUri('http://localhost:8900/models')
  await faceapi.nets.faceLandmark68Net.loadFromUri('http://localhost:8900/models')
  await faceapi.nets.faceRecognitionNet.loadFromUri('http://localhost:8900/models')
}

const startVideo = async () => {
  if (cancelLoading.value) return // If cancel is clicked, stop further processing
  const constraints = { audio: false, video: true }
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    video.value.srcObject = stream
    isVideoLoading.value = false // Video has started loading
  } catch (error) {
    console.error('Error accessing camera:', error)
    isVideoLoading.value = false // Handle the error by marking loading as false
  }
}

watch(cancelLoading, (newCancelLoading) => {
  if (!newCancelLoading.state) {
    stopVideo()
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

const captureAndVerifyFace = async () => {
  faceCaptureTimeout = setTimeout(() => {
    if (!faceCaptured.value) {
      clearInterval(faceCaptureInterval)
      showCamera.state = false
      stopVideo()
      emit('notCaptured')
      errorMessage.value = 'An error occurred during face verification.'
    }
  }, 10000)

  faceCaptureInterval = setInterval(async () => {
    try {
      const detection = await faceapi
        .detectSingleFace(video.value)
        .withFaceLandmarks()
        .withFaceDescriptor()

      if (detection) {
        const faceDescriptor = Array.from(detection.descriptor)
        clearTimeout(faceCaptureTimeout)
        clearInterval(faceCaptureInterval)
        faceAuthLoading.value = false
        faceCaptured.value = true

        if (props.mode === 'signup') {
          // Emit face descriptor for signup
          faceCaptured.value = true
          faceVerified.value = true
          showCamera.state = false
          stopVideo()
          emit('faceDescriptor', faceDescriptor)
          emit('verified')
        } else if (props.mode === 'quiz') {
          console.log(faceDescriptor, user.value.email)

          const response = await authService.validateFace(faceDescriptor, user.value.email)

          if (response.success) {
            faceCaptured.value = true
            faceVerified.value = true
            showCamera.state = false
            stopVideo()
            emit('verified')
          } else {
            errorMessage.value = response.data.message
          }
        }
      }
    } catch (error) {
      console.error(error)
      errorMessage.value = 'An error occurred during face verification.'
    }
  }, 500)
}

watch(showCamera, async (newShowCamera) => {
  if (newShowCamera.state) {
    faceAuthLoading.value = true
    isVideoLoading.value = true
    await loadModels()
    await startVideo()
    if (!cancelLoading.value) {
      captureAndVerifyFace()
    }
  } else {
    clearInterval(faceCaptureInterval)
    clearTimeout(faceCaptureTimeout)
    stopVideo()
    faceAuthLoading.value = false
    isVideoLoading.value = false
  }
})

onBeforeUnmount(() => {
  clearInterval(faceCaptureInterval)
  clearTimeout(faceCaptureTimeout)
  stopVideo()
})

const closeModal = () => {
  cancelLoading.value = true
  clearInterval(faceCaptureInterval)
  clearTimeout(faceCaptureTimeout)
  stopVideo()
  showCamera.state = false
  emit('close')
}
</script>

<style scoped>
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border-top-color: #6366f1;
  animation: spin 1s ease infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
