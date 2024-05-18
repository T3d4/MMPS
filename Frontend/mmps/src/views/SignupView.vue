<template>
  <div class="h-screen flex items-center justify-center bg-slate-800 overflow-y-auto">
    <div
      ref="formContainer"
      class="bg-white bg-opacity-90 p-8 rounded shadow-md max-w-md w-full overflow-hidden my-4 h-[80%] overflow-y-auto"
    >
      <h2 class="text-2xl font-bold text-gray-900 mb-4 text-center sm:text-xl">Create Account</h2>

      <form @submit.prevent="signupUser" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
          <input
            id="name"
            v-model="signup.name"
            type="text"
            autocomplete="on"
            required
            class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input
            id="email"
            v-model="signup.email"
            type="email"
            autocomplete="on"
            required
            class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
          />
        </div>

        <div class="relative">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="signup.password"
              :type="passwordVisible ? 'text' : 'password'"
              autocomplete="on"
              required
              class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            />
            <button
              @click="togglePasswordVisibility"
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-400"
            >
              {{ passwordVisible ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <div class="relative">
          <label ref="confirmPassword" class="block text-sm font-medium text-gray-700"
            >Confirm Password</label
          >
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              autocomplete="on"
              required
              class="mt-1 p-2 w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            />
            <button
              @click="toggleConfirmPasswordVisibility"
              type="button"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-400"
            >
              {{ confirmPasswordVisible ? 'Hide' : 'Show' }}
            </button>
          </div>
        </div>

        <div v-if="showCamera" class="mt-4" ref="faceCaptureSection">
          <label class="block text-sm font-medium text-gray-700 mb-2">Face Capture</label>
          <div :class="distanceClass" class="border rounded-md relative">
            <video id="video" class="w-full" ref="video" autoplay></video>
            <div
              v-if="showFaceGuide"
              class="absoluteinset-0 flex items-center justify-center pointer-events-none"
            ></div>
          </div>
          <p v-if="showFaceGuide" class="text-gray-600 mt-2 text-center">
            Position your face within the frame.
          </p>
          <button
            @click="captureFace"
            type="button"
            :class="{ 'opacity-50 cursor-not-allowed': faceCaptured }"
            :disabled="faceCaptured"
            class="mt-2 w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {{ faceCaptured ? 'Face Captured Successfully' : 'Capture Face' }}
          </button>
        </div>
        <div v-else>
          <p v-if="captureMessage" class="text-sm text-red-500 ml-2">{{ captureMessage }}</p>
          <button
            @click="initFaceCapture"
            type="button"
            class="mt-2 w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Capture Face
          </button>
        </div>

        <div class="w-full">
          <button
            type="submit"
            class="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
          >
            Sign Up
          </button>
        </div>
      </form>

      <div class="text-center mt-4 sm:mt-2">
        <span class="text-sm text-gray-600">Already have an account? </span>
        <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500"
          >Login</router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import axios from 'axios'
import * as faceapi from 'face-api.js'
import router from '../router'

const base = axios.create({
  baseURL: 'http://localhost:8900/api/v1'
  // replace on production env
})

const confirmPassword = ref('')
const showCamera = ref(false)
const distanceClass = ref('')
const showFaceGuide = ref(true) // Show the face guide initially
const captureMessage = ref(null)

const signup = reactive({
  name: '',
  email: '',
  password: '',
  faceDescriptor: null
})

let faceCaptureInterval
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)
const video = ref(null)
const faceCaptureSection = ref(null)
const faceCaptured = ref(false) // Track if face is capture

const initFaceCapture = async () => {
  showCamera.value = true
  await loadModels() // Load models when the button is clicked
  startVideo() // Start the video only when the button is clicked
  scrollToFaceCaptureSection() // Scroll to the face capture section
}

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const toggleConfirmPasswordVisibility = () => {
  confirmPasswordVisible.value = !confirmPasswordVisible.value
}

const loadModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromUri('http://localhost:8900/models')
  await faceapi.nets.faceLandmark68Net.loadFromUri('http://localhost:8900/models')
  await faceapi.nets.faceRecognitionNet.loadFromUri('http://localhost:8900/models')
}

watch(
  () =>
    faceapi
      .detectSingleFace(video.value, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor(),
  (detections) => {
    if (detections) {
      const box = faceapi.getMediaDimensions(video.value)
      const faceBox = detections.detection.box
      const faceAreaRatio = (faceBox.width * faceBox.height) / (box.width * box.height)

      showFaceGuide.value = faceAreaRatio < 0.1 || faceAreaRatio > 0.3
      distanceClass.value = showFaceGuide.value ? 'border-red-500' : 'border-green-500'
    } else {
      showFaceGuide.value = true
      distanceClass.value = 'border-red-500'
    }
  }
)

// Close the camera when navigating away from the page
onBeforeUnmount(() => {
  if (video.value && video.value.srcObject) {
    const stream = video.value.srcObject
    const tracks = stream.getTracks()
    tracks.forEach((track) => track.stop())
  }
})

const startVideo = () => {
  const constraints = (window.constraints = { audio: false, video: true })
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      if (video.value) {
        // Make sure video element exists
        video.value.srcObject = stream
      }
    })
    .catch((error) => {
      console.error('Error accessing camera:', error)
    })
}

onMounted(async () => {
  // ... (load models and start video only when showCamera is true)
  if (showCamera.value) {
    await loadModels()
    startVideo()
  }
})

const captureFace = async () => {
  const detection = await faceapi
    .detectSingleFace(video.value)
    .withFaceLandmarks()
    .withFaceDescriptor()

  if (detection) {
    signup.faceDescriptor = detection.descriptor
    faceCaptured.value = true
    clearInterval(faceCaptureInterval) // Clear the interval when face is captured
    showCamera.value = false
  } else {
    captureMessage.value = 'Face not detected, please try again.'
    faceCaptured.value = false;
    showCamera.value = false;
  }
}

watch(showCamera, async (newShowCamera) => {
  if (newShowCamera) {
    await loadModels()
    startVideo()
    faceCaptureInterval = setInterval(captureFace, 500) // Check for face every 500ms
  } else {
    // When showCamera is false, clear the interval to stop face detection.
    clearInterval(faceCaptureInterval)
    captureMessage.value = null // Clear the message when closing camera
  }
})

const scrollToFaceCaptureSection = () => {
  if (faceCaptureSection.value) {
    faceCaptureSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

const signupUser = () => {
  if (!signup.faceDescriptor) {
    alert('Please capture your face before signing up.')
    return
  }

  base
    .post('/user', signup)
    .then((result) => {
      if (result.data.accesstkn) {
        router.push('/quizes')
      } else {
        router.push('/quizes')
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
</script>
