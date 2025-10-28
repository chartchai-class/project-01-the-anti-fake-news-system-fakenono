<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
//import { login } from '@/services/AuthService'
import { useAuthStore } from '@/stores/auth'

//import axios from 'axios'
import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'

const loginSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
})

const { handleSubmit, errors } = useForm<{ username: string; password: string }>({
  validationSchema: loginSchema,
})

const { value: username } = useField<string>('username')
const { value: password } = useField<string>('password')

const router = useRouter()
const authStore = useAuthStore()

const errorMessage = ref('')

const onSubmit = handleSubmit(async (values: { username: string; password: string }) => {
  try {
    await authStore.login(values.username, values.password)
    if (previousRoute == '/registration') {
      router.push({ name: 'home' })
    } else {
      router.push(previousRoute as string)
    }
  } catch {
    errorMessage.value = 'Login failed. Please check your credentials.'
  }
})

// async function handleLogin() {
//   try {
//     await authStore.login(username.value, password.value)
//     router.push('/')
//   } catch {
//     errorMessage.value = 'Login failed. Please check your credentials.'
//   }
// }

const previousRoute = router.options.history.state.back
console.log(previousRoute)
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
    <form @submit.prevent="onSubmit" class="space-y-6">
      <h2 class="text-2xl font-bold text-center text-gray-800">Login</h2>

      <div>
        <label for="username" class="block text-lg font-semibold text-gray-700 mb-2"
          >Username</label
        >
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Enter your username"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span class="text-red-500 text-sm">{{ errors.username }}</span>
      </div>

      <div>
        <label for="password" class="block text-lg font-semibold text-gray-700 mb-2"
          >Password</label
        >
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Enter your password"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span class="text-red-500 text-sm">{{ errors.password }}</span>
      </div>

      <div class="text-center">
        <button
          type="submit"
          class="px-6 py-2 bg-black text-white font-semibold rounded-xl hover:bg-white hover:text-black transition"
        >
          Login
        </button>
      </div>
    </form>

    <div v-if="errorMessage" class="text-red-600 text-center mt-2">
      {{ errorMessage }}
    </div>
  </div>
</template>
