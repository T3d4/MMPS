<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white w-1/3 rounded-lg p-8 shadow-md">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">
        {{ mode === 'signup' ? 'Facial Capture' : 'Facial Recognition' }}
      </h2>

      <video
        ref="video"
        class="w-2/3 mx-auto rounded-lg border-[3px] border-indigo-500 shadow-md"
        autoplay
        playsinline
        muted
      ></video>

      <div v-if="faceAuthLoading" class="flex justify-center mt-4">
        <span class="loader"></span>
        <!-- This can be a spinner or any loading indicator -->
        <p class="text-gray-900 ml-2">Verifying...</p>
      </div>

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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue'
import { showCamera } from '@/global_state/state'
import * as faceapi from 'face-api.js'
import axios from 'axios'

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

const emit = defineEmits(['close', 'verified', 'notCaptured', 'faceDescriptor'])

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
  faceCaptureTimeout = setTimeout(() => {
    if (!faceCaptured.value) {
      clearInterval(faceCaptureInterval)
      showCamera.state = false
      stopVideo()
      emit('notCaptured')
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
          const response = await axios.post('/api/v1/auth/validate-face', {
            faceDescriptor,
            quizId: props.quizId,
            email: localStorage.getItem('user_email')
          })

          if (response.data.success) {
            faceCaptured.value = true
            faceVerified.value = true
            showCamera.state = false
            stopVideo()
            emit('verified')
          }
        }
      }
    } catch (error) {
      console.error(error)
      errorMessage.value = 'An error occurred during face verification.'
    }
  }, 750)
}

watch(showCamera, async (newShowCamera) => {
 
  if (newShowCamera.state) {
    faceAuthLoading.value = true
    await loadModels()
    await startVideo()
    captureAndVerifyFace()
  } else {
    clearInterval(faceCaptureInterval)
    clearTimeout(faceCaptureTimeout)
    stopVideo()
    faceAuthLoading.value = false
  }
})

// onMounted(() => {
//   if (props.show) {
//     showCamera.value = true
//   }
// })

onBeforeUnmount(() => {
  clearInterval(faceCaptureInterval)
  clearTimeout(faceCaptureTimeout)
  stopVideo()
})

const closeModal = () => {
  showCamera.state = false
  clearInterval(faceCaptureInterval)
  clearTimeout(faceCaptureTimeout)
  stopVideo()
  emit('close')
}
</script>

<style scoped>
.loader {
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
