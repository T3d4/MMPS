<template>
  <div
    class="h-screen flex items-center justify-center bg-slate-800 overflow-y-auto transition-all"
  >
    <div
      class="bg-white bg-opacity-90 p-8 rounded shadow-md max-w-md w-full my-4 max-h-[90dvh] overflow-y-auto"
    >
      <h2 class="text-2xl font-bold text-gray-900 mb-4 text-center sm:text-xl">Create Account</h2>
      <form @submit.prevent="signupUser" class="space-y-4">
        <TextInput id="name" v-model="signup.name" label="Name" type="text" />
        <TextInput id="email" v-model="signup.email" label="Email" type="email" />
        <PasswordInput
          id="password"
          v-model="signup.password"
          label="Password"
          :passwordMatch="passwordsMatch"
        />
        <PasswordInput
          id="confirmPassword"
          v-model="confirmPassword.confirmPwd"
          label="Confirm Password"
          :passwordMatch="passwordsMatch"
        />
        <div class="!mt-2">
          <p v-if="errorMessage" class="text-sm text-red-500 !m-0 !ml-2">{{ errorMessage }}</p>
        </div>
        <div class="">
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
            :disabled="!faceCaptured"
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
        <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
          Login
        </router-link>
      </div>
    </div>
    <FacialRecognitionModal
      :show="showModal"
      mode="signup"
      @faceDescriptor="handleFaceCaptured"
      @close="closeModal"
      @notCaptured="handleNotCaptured"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import router from '@/router'
import TextInput from '@/components/TextInput.vue'
import PasswordInput from '@/components/PasswordInput.vue'
import FacialRecognitionModal from '@/components/FacialRecoginitionModal.vue'
import { capturing, showCamera, cancelLoading } from '@/global_state/state'
import axios from 'axios'

const signup = ref({
  name: '',
  email: '',
  password: '',
  faceDescriptor: null
})

const confirmPassword = ref({
  confirmPwd: ''
})

const errorMessage = ref('')
const faceCaptured = ref(false)
const showModal = ref(false)

const passwordsMatch = computed(() => signup.value.password === confirmPassword.value.confirmPwd)

const initFaceCapture = () => {
  showModal.value = true
  capturing.state = true
  showCamera.state = true
  cancelLoading.value = false
}

const handleFaceCaptured = (descriptor) => {
  signup.value.faceDescriptor = descriptor
  faceCaptured.value = true
  showModal.value = false
  capturing.state = false
  errorMessage.value = null
}

const handleNotCaptured = () => {
  showModal.value = false
  faceCaptured.value = false
  errorMessage.value = 'Face capture failed. Please try again.'
  capturing.state = false
}

const closeModal = () => {
  showModal.value = false
  capturing.state = false
  showCamera.state = false
}

const signupUser = async () => {
  if (!passwordsMatch.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  if (!faceCaptured.value) {
    errorMessage.value = 'Please capture your face.'
    return
  }

  try {
    const response = await axios.post('/api/v1/auth/signup', signup.value)
    if (response.data.success) {
      router.push('/quizes')
    } else {
      errorMessage.value = response.data.message
    }
  } catch (error) {
    console.error('Signup error:', error)
    errorMessage.value = 'An error occurred during signup. Please try again.'
  }
}
</script>
