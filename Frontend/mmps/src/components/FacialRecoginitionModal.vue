<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white w-[400px] rounded-lg p-8 shadow-md relative">
      <h2 class="text-2xl font-semibold mb-4 text-gray-700">Facial Recognition</h2>

      <div
        class="relative w-[300px] mx-auto rounded-md border-[3px] border-indigo-500 shadow-md h-[227px] flex items-center justify-center"
      >
        <video
          ref="video"
          v-show="!isVideoLoading"
          class="w-full h-full"
          autoplay
          playsinline
          muted
        ></video>
        <div
          v-if="isVideoLoading"
          class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75"
        >
          <div class="spinner"></div>
        </div>
      </div>

      <div v-if="faceAuthLoading" class="flex justify-center mt-4">
        <div class="spinner"></div>
        <p v-if="mode === 'quiz'" class="text-gray-900 ml-2">Verifying...</p>
        <p v-else class="text-gray-900 ml-2">Capturing...</p>
      </div>

      <p v-if="errorMessage && !faceAuthLoading" class="text-red-500 mt-2 pl-6">
        {{ errorMessage }}
      </p>

      <div class="flex justify-center gap-4 mt-4">
        <button
          @click="closeModal"
          class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onBeforeUnmount, computed } from 'vue'
import { showCamera, cancelLoading, verified } from '@/global_state/state'
import * as faceapi from 'face-api.js'
import { useStore } from 'vuex'
import authService from '@/services/authService'

const store = useStore()
const user = computed(() => store.getters.user)

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
  if (cancelLoading.value) return
  const constraints = { audio: false, video: true }
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    if (video.value) {
      video.value.srcObject = stream
      return new Promise((resolve) => {
        video.value.onloadedmetadata = () => {
          isVideoLoading.value = false
          resolve()
        }
      })
    } else {
      throw new Error('Video element not found')
    }
  } catch (error) {
    console.error('Error accessing camera:', error)
    isVideoLoading.value = false
    errorMessage.value =
      'Unable to access camera. Please check your camera permissions and try again.'
    throw error
  }
}

const stopVideo = () => {
  if (video.value && video.value.srcObject) {
    const stream = video.value.srcObject
    const tracks = stream.getTracks()
    tracks.forEach((track) => {
      track.stop()
      stream.removeTrack(track)
    })
    video.value.srcObject = null
  }
  isVideoLoading.value = true
  faceAuthLoading.value = false
}

const captureFace = async (maxRetries, retryInterval) => {
  let retryCount = 0
  let faceDescriptors = []
  let intervalId

  return new Promise((resolve, reject) => {
    intervalId = setInterval(async () => {
      console.log(`Attempt ${retryCount + 1} of ${maxRetries}`)

      if (!video.value || video.value.paused || video.value.ended) {
        console.log('Video feed is not available')
        clearInterval(intervalId)
        reject(new Error('Video feed is not available'))
        return
      }

      try {
        const detection = await faceapi
          .detectSingleFace(video.value)
          .withFaceLandmarks()
          .withFaceDescriptor()

        if (detection) {
          console.log('Face detected')
          const faceDescriptor = Array.from(detection.descriptor)
          faceDescriptors.push(faceDescriptor)
        } else {
          console.log('No face detected in this attempt')
        }

        retryCount++

        if (retryCount >= maxRetries) {
          clearInterval(intervalId)
          if (faceDescriptors.length > 0) {
            console.log(`Face capture completed with ${faceDescriptors.length} descriptors`)
            resolve(faceDescriptors)
          } else {
            console.log('Face capture failed: No faces detected')
            reject(new Error('Face capture failed: No faces detected'))
          }
        }
      } catch (error) {
        console.error('Error during face detection:', error)
        clearInterval(intervalId)
        reject(error)
      }
    }, retryInterval)
  })
}

const captureAndVerifyFace = async () => {
  let retryCount = 0
  const maxRetries = 3

  while (retryCount < maxRetries) {
    try {
      faceAuthLoading.value = true
      if (!video.value || !video.value.srcObject || video.value.paused || video.value.ended) {
        console.log('Video stream not available or ended, attempting to restart')
        await startVideo()
      }

      let faceCaptureTimeout = setTimeout(() => {
        if (!faceCaptured.value) {
          console.log('Face capture timeout')
          throw new Error('Face capture timeout')
        }
      }, 30000) // Increased timeout to 30 seconds

      const maxCaptureRetries = 6
      const retryInterval = 850
      console.log('Starting face capture')
      const faceDescriptors = await captureFace(maxCaptureRetries, retryInterval)

      clearTimeout(faceCaptureTimeout)

      if (faceDescriptors.length === 0) {
        throw new Error('No face descriptors captured')
      }

      console.log('Computing average descriptor')
      const avgDescriptor = faceDescriptors[0].map(
        (_, i) => faceDescriptors.reduce((sum, desc) => sum + desc[i], 0) / faceDescriptors.length
      )

      if (props.mode === 'signup') {
        console.log('Signup mode: Emitting face descriptor')
        faceCaptured.value = true
        faceVerified.value = true
        emit('faceDescriptor', avgDescriptor)
        emit('verified')
        break
      } else if (props.mode === 'quiz') {
        console.log('Quiz mode: Validating face')
        const response = await authService.validateFace(avgDescriptor, user.value.email)
        console.log(response)
        if (response.status === 'success') {
          console.log('Face verified successfully')
          verified.value = true
          faceCaptured.value = true
          faceVerified.value = true
          emit('verified')
          break
        } else if (response.status === 401) {
          console.log('Authentication failed')
          errorMessage.value = 'Authentication failed. Please try again or contact support.'
        } else {
          console.log('Face verification failed')
          errorMessage.value = 'Face verification failed. Please try again.'
        }
      }
    } catch (error) {
      console.error(`Attempt ${retryCount + 1} failed:`, error)
      retryCount++
      if (retryCount >= maxRetries) {
        errorMessage.value =
          'Face verification failed after multiple attempts. Please try again later.'
      } else {
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds before retrying
      }
    } finally {
      faceAuthLoading.value = false
    }
  }

  showCamera.state = false
  stopVideo()
}

watch(showCamera, async (newShowCamera) => {
  if (newShowCamera.state) {
    faceAuthLoading.value = true
    isVideoLoading.value = true
    errorMessage.value = null
    try {
      await loadModels()
      await startVideo()
      console.log('Video started, waiting before face capture')
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds before starting face capture
      if (!cancelLoading.value) {
        await captureAndVerifyFace()
      }
    } catch (error) {
      console.error('Error in showCamera watch:', error)
      errorMessage.value = 'An error occurred while setting up the camera. Please try again.'
    } finally {
      faceAuthLoading.value = false
      isVideoLoading.value = false
    }
  } else {
    stopVideo()
  }
})

watch(cancelLoading, (newCancelLoading) => {
  if (newCancelLoading) {
    stopVideo()
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
