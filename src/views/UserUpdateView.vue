<script setup lang="ts">
import UserService from '@/services/UserService'
import { useAuthStore } from '@/stores/auth'
import type { UpdateUser } from '@/types'
import isEqual from 'lodash/isEqual'
import { ErrorMessage, Field, useForm } from 'vee-validate'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { object, string } from 'yup'

// store and data
const authUser = useAuthStore()
const updateUser = ref<UpdateUser>()

// fetch user data
UserService.getUserById(authUser.user.id)
  .then((response) => {
    updateUser.value = response.data
    console.log('update user:', updateUser.value)
  })
  .catch((err) => {
    console.error(err)
  })

// validation schema
const schema = object({
  name: string().required('Name is required'),
  surname: string().required('Surname is required'),
  username: string().required('Username is required'),
  email: string().email().required('Email is required'),
})

// vee-validate setup
const { handleSubmit, setValues, values, isSubmitting } = useForm({
  initialValues: {
    name: '',
    surname: '',
    username: '',
    email: '',
  },
  validationSchema: schema,
})

const formRef = ref()
const toast = useToast()
// watch and populate form when updateUser loads
watch(
  updateUser,
  (newUpdateUser) => {
    if (newUpdateUser) {
      setValues(newUpdateUser)
    }
  },
  { immediate: true },
)

// handle form submission
const onSubmit = handleSubmit(async (formValues) => {
  try {
    console.log('Updating user with:', formValues)

    if (isEqual(updateUser.value, formValues)) {
      toast.warning('No change!')
      return
    }
    // await UserService.updateUser(authUser.user.id, formValues)
    UserService.UpdateUser(authUser.user.id, formValues)
      .then((response) => {
        setValues(response.data)
        toast.success('Updated Successfully')
        router.push({ name: 'user-detail-view' })
      })
      .catch((err) => {
        setValues(updateUser.value)
        toast.error(err)
      })
  } catch (err) {
    console.error(err)
    alert('Failed to update profile.')
  }
})
const router = useRouter()
function handleCancle() {
  router.push({ name: 'user-detail-view' })
}
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-50 px-4 py-6">
    <form
      @submit.prevent="onSubmit"
      class="w-full max-w-md bg-white rounded-lg shadow-lg p-6"
      ref="formRef"
    >
      <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Update Profile</h2>

      <div class="space-y-4">
        <div class="form-group">
          <label class="block text-gray-700 text-sm font-medium mb-1"> Name </label>
          <Field
            name="name"
            placeholder="Enter name"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="name" class="text-red-500 text-sm mt-1 block" />
        </div>

        <div class="form-group">
          <label class="block text-gray-700 text-sm font-medium mb-1"> Surname </label>
          <Field
            name="surname"
            placeholder="Enter surname"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="surname" class="text-red-500 text-sm mt-1 block" />
        </div>

        <div class="form-group">
          <label class="block text-gray-700 text-sm font-medium mb-1"> Username </label>
          <Field
            name="username"
            placeholder="Enter username"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="username" class="text-red-500 text-sm mt-1 block" />
        </div>

        <div class="form-group">
          <label class="block text-gray-700 text-sm font-medium mb-1"> Email </label>
          <Field
            name="email"
            type="email"
            placeholder="Enter email"
            class="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <ErrorMessage name="email" class="text-red-500 text-sm mt-1 block" />
        </div>
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full mt-6 bg-black text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
      >
        {{ isSubmitting ? 'Updating...' : 'Update' }}
      </button>
      <button
        @click.prevent="handleCancle"
        class="w-full mt-6 bg-black text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200"
      >
        Cancel
      </button>
    </form>
  </div>
</template>
