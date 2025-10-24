<script setup lang="ts">
import ImageUpload from '@/components/ImageUpload.vue'
import { useAuthStore } from '@/stores/auth'
import { useField, useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import * as yup from 'yup'

const registerSchema = yup.object({
  name: yup.string().required('First name is required'),
  surname: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().required('Username is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
})

type RegisterForm = yup.InferType<typeof registerSchema>

const { handleSubmit, errors } = useForm<RegisterForm>({
  validationSchema: registerSchema,
})

const { value: name } = useField<string>('name')
const { value: surname } = useField<string>('surname')
const { value: email } = useField<string>('email')
const { value: username } = useField<string>('username')
const { value: password } = useField<string>('password')

const imageUrl = ref<string[]>([])
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()

const onSubmit = handleSubmit(async (values: RegisterForm) => {
  try {
    await authStore.signUp(
      values.name,
      values.surname,
      values.username,
      values.email,
      values.password,
      imageUrl.value[0] || '',
    )
    router.push('/login')
  } catch {
    errorMessage.value = 'Registration failed. Please try again.'
  }
})

// async function handleRegistration() {
//   try {
//     await authStore.signUp(
//       name.value,
//       surname.value,
//       username.value,
//       email.value,
//       password.value,
//       imageUrl.value[0] || ''
//     )
//     router.push('/login')
//   } catch {
//     errorMessage.value = 'Registration failed. Please try again.'
//   }
// }
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-md">
    <form @submit.prevent="onSubmit" class="space-y-6">
      <h2 class="text-2xl font-bold text-center text-gray-800">Registration</h2>
      <div>
        <label for="name" class="block text-lg font-semibold text-gray-700 mb-2">First name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          placeholder="Enter your First name"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span class="text-red-500 text-sm">{{ errors.name }}</span>
      </div>
      <div>
        <label for="surname" class="block text-lg font-semibold text-gray-700 mb-2"
          >Last name</label
        >
        <input
          id="surname"
          v-model="surname"
          type="text"
          placeholder="Enter your Last name"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span class="text-red-500 text-sm">{{ errors.surname }}</span>
      </div>
      <div>
        <label for="email" class="block text-lg font-semibold text-gray-700 mb-2">Email</label>
        <input
          id="email"
          v-model="email"
          type="text"
          placeholder="Enter your Email"
          class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span class="text-red-500 text-sm">{{ errors.email }}</span>
      </div>
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
      <div>
        <label class="block text-lg font-semibold text-gray-700 mb-2">Profile Image</label>
        <ImageUpload v-model="imageUrl" />
      </div>
      <div class="text-center">
        <button
          type="submit"
          class="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
        >
          Register
        </button>
      </div>
    </form>
    <div v-if="errorMessage" class="text-red-600 text-center mt-2">
      {{ errorMessage }}
    </div>
  </div>
</template>
