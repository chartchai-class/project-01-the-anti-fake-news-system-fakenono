<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
//import { registration } from '@/services/AuthService'
//import axios from 'axios'
import ImageUpload from '@/components/ImageUpload.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const name = ref('')
const surname = ref('')
const email = ref('')
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const imageUrl = ref<string[]>([])

async function handleRegistration() {
  try {
    await authStore.signUp(
      name.value,
      surname.value,
      username.value,
      email.value,
      password.value,
      imageUrl.value[0] || ''
    )
    router.push('/login')
  } catch {
    errorMessage.value = 'Registration failed. Please try again.'
  }
}

</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
    <form @submit.prevent="handleRegistration" class="space-y-6">
      <h2 class="text-2xl font-bold text-center text-gray-800">Registration</h2>
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-2" for="name">First name</label>
        <input id="name" v-model="name" type="text" placeholder="Enter your First name"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-2" for="surname">Last name</label>
        <input id="surname" v-model="surname" type="text" placeholder="Enter your Last name"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-2" for="email">Email</label>
        <input id="email" v-model="email" type="text" placeholder="Enter your Email"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
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
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-2">Profile Image</label>
        <ImageUpload v-model="imageUrl" />
      </div>


      <div class="text-center">
        <button type="submit"
          class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition">
          Register
        </button>
      </div>
    </form>
  </div>
  <div v-if="errorMessage" class="text-red-600 text-center mt-2">
    {{ errorMessage }}

  </div>



</template>
