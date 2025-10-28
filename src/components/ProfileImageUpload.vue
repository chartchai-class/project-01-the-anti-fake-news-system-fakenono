<template>
  <div class="flex flex-col items-center w-auto">
    <!-- Profile Image -->
    <!-- <img
      :src="profileImage || defaultImage"
      alt="Profile Image"
      class="w-32 h-32 rounded-full object-cover border-2 border-gray-300 mb-3"
    /> -->
    <div class="w-32 h-32 mb-1 rounded-full overflow-hidden border-2 border-gray-300">
      <img
        :src="profileImage || emptyImageUrl"
        alt="Profile Image"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- File input -->
    <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileSelect" />

    <!-- Upload button -->
    <button @click="fileInput.click()" class="px-5 w-auto text-sm rounded transition">
      <PencilSquareIcon class="w-3 h-3 inline-block" />Change
    </button>

    <!-- Uploading indicator -->
    <p v-if="isUploading" class="text-gray-500 mt-2">Uploading...</p>
  </div>
</template>

<script setup lang="ts">
import { PencilSquareIcon } from '@heroicons/vue/16/solid'
import nProgress from 'nprogress'
import { defineEmits, defineProps, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'

// Props and emits
const props = defineProps<{
  initialImage?: string | null
  userId: number
}>()

const emit = defineEmits<{
  (e: 'uploaded', newImageUrl: string): void
}>()

// State
const profileImage = ref(props.initialImage || null)
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)
const emptyImageUrl = import.meta.env.VITE_EMPTY_IMAGE_URL
const base_url = import.meta.env.VITE_BACKEND_URL
const toast = useToast()

// File upload handler
async function handleFileSelect(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files || files.length === 0) return

  const file = files[0]
  const formData = new FormData()
  formData.append('image', file)
  const uploadImageUrl = import.meta.env.VITE_UPLOAD_URL
  try {
    isUploading.value = true
    nProgress.start()

    // 1️⃣ Upload to backend to get image URL
    const uploadResponse = await fetch(uploadImageUrl, {
      method: 'POST',
      body: formData,
    })

    if (!uploadResponse.ok) throw new Error('Image upload failed')
    const uploadData = await uploadResponse.json()
    const imageUrl = uploadData.name // make sure backend returns this key

    // 2️⃣ Send image URL to update user's profile
    const updateResponse = await fetch(`${base_url}user/${props.userId}/updateImage`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    })

    if (!updateResponse.ok) throw new Error('Failed to update profile image')
    const updatedUser = await updateResponse.json()

    profileImage.value = updatedUser.imageUrl || imageUrl
    emit('uploaded', profileImage.value)
  } catch (err) {
    console.error(err)
    toast.error('Upload Error!')
  } finally {
    isUploading.value = false
    nProgress.done()
    if (fileInput.value) fileInput.value.value = '' // reset file input
  }
}
onMounted(() => {
  console.log(props.initialImage)
})
</script>

<style scoped>
button {
  transition: background-color 0.2s;
}
</style>
