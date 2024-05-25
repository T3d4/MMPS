<template>
  <!-- signup view -->
  <div
    class="h-screen flex items-center justify-center bg-slate-800 overflow-y-auto transition-all"
  >
    <div
      class="bg-white bg-opacity-90 p-8 rounded shadow-md max-w-md w-full my-4 max-h-[90dvh] overflow-y-auto"
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
            class="mt-1 p-2 w-full rounded-md shadow-sm focus:outline-none border-2 focus:border-indigo-500 sm:text-sm text-gray-900"
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
            class="mt-1 p-2 w-full rounded-md shadow-sm focus:outline-none border-2 focus:border-indigo-500 sm:text-sm text-gray-900"
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
              class="mt-1 p-2 w-full focus:outline-none border-2 focus:border-indigo-500 rounded-md shadow-sm sm:text-sm text-gray-900"
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
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700"
            >Confirm Password</label
          >
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="confirmPassword.confirmPwd"
              :type="confirmPasswordVisible ? 'text' : 'password'"
              autocomplete="on"
              required
              @focus="inputFocused = true"
              @blur="inputFocused = false"
              :class="[
                'mt-1 p-2 w-full border-[2px] rounded-md shadow-sm sm:text-sm text-gray-900 focus:outline-none',
                {
                  'border-gray-100': confirmPassword.confirmPwd === '',
                  'border-green-500': passwordsMatch && confirmPassword.confirmPwd !== '',
                  'border-indigo-500': inputFocused && passwordsMatch, // When focused and passwords match
                  'border-red-500':
                    (!passwordsMatch && confirmPassword.confirmPwd !== '') ||
                    (inputFocused && !passwordsMatch)
                }
              ]"
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
          <!-- <label class="block text-sm font-medium text-gray-700 mb-2">Face Capture</label> -->
          <div :class="distanceClass" class="rounded-lg relative">
            <video
              id="video"
              class="w-2/3 mx-auto rounded-lg border-[3px] border-indigo-500 shadow-md"
              ref="video"
              autoplay
            ></video>
            <div
              v-if="showFaceGuide"
              class="absoluteinset-0 flex items-center justify-center pointer-events-none"
            ></div>
          </div>
          <p v-if="showFaceGuide" class="text-gray-600 mt-2 text-center">
            Position your face within the frame.
          </p>
        </div>

        <div class="!mt-2">
          <p v-if="errorMessage" class="text-sm text-red-500 !m-0 !ml-2">{{ errorMessage }}</p>
        </div>

        <div class="">
          <!-- TODO -->
          <!-- Modify logic to change button state to disabled and change text to capturing while capturing face -->
          <button
            @click="initFaceCapture"
            type="button"
            :disabled="faceCaptured"
            :class="{
              'opacity-40 cursor-not-allowed': faceCaptured,
              'animate-pulse opacity-100 cursor-not-allowed': capturing.state
            }"
            class="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            {{
              faceCaptured
                ? 'Face Captured Successfully'
                : capturing.state
                  ? 'Capturing...'
                  : 'Capture Face'
            }}
          </button>
        </div>

        <div class="w-full">
          <button
            :disabled="
              () => {
                faceCaptured != true
              }
            "
            :class="{
              'opacity-40 cursor-not-allowed': !faceCaptured
            }"
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
    <FacialRecognitionModal
      :show="showFaceRecognitionModal"
      @faceCaptured="onFaceCaptured"
      @close="showFaceRecognitionModal = false"
    />
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import FacialRecognitionModal from '@/components/FacialRecoginitionModal.vue'
import axios from 'axios'
import router from '../router'
import { capturing } from '@/global_state/state';

const base = axios.create({
  baseURL: 'http://localhost:8900/api/v1'
  // replace on production env
})

const signup = reactive({
  name: '',
  email: '',
  password: '',
  faceDescriptor: null
})

// auth variables
const confirmPassword = reactive({ confirmPwd: '' })
const passwordVisible = ref(false)
const confirmPasswordVisible = ref(false)
const passwordsMatch = computed(() => signup.password === confirmPassword.confirmPwd)

const showFaceRecognitionModal = ref(false)
const faceCaptured = ref(false)

// message variables
const errorMessage = ref(null)

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value
}

const toggleConfirmPasswordVisibility = () => {
  confirmPasswordVisible.value = !confirmPasswordVisible.value
}

const initFaceCapture = () => {
  capturing.state = true
  errorMessage.value = null
  showFaceRecognitionModal.value = true
}

const onFaceCaptured = () =>{
  faceCaptured.value = true
  capturing.state = false
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
