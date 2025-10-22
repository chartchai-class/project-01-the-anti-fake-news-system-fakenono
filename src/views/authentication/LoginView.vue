<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
//import { login } from '@/services/AuthService'
import { useAuthStore } from '@/stores/auth'

//import axios from 'axios'


const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')

async function handleLogin() {
  try {
    await authStore.login(username.value, password.value)
    router.push('/')
  } catch {
    errorMessage.value = 'Login failed. Please check your credentials.'
  }
}


</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
    <form @submit.prevent="handleLogin" class="space-y-6">
      <h2 class="text-2xl font-bold text-center text-gray-800">Login</h2>
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-2" for="username">Username</label>
        <input id="username" v-model="username" type="text" placeholder="Enter your username"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-2" for="password">Password</label>
        <input id="password" v-model="password" type="password" placeholder="Enter your password"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div class="text-center">
        <button type="submit"
          class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
          Login
        </button>
      </div>
    </form>
  </div>
  <div v-if="errorMessage" class="text-red-600 text-center mt-2">
    {{ errorMessage }}
  </div>

</template>
