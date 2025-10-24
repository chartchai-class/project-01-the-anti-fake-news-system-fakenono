<template>
  <div class="flex flex-col items-center">
    <!-- Profile Image -->
    <img
      :src="profileImage || defaultImage"
      alt="Profile Image"
      class="w-32 h-32 rounded-full object-cover border-2 border-gray-300 mb-3"
    />

    <!-- File input -->
    <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileSelect" />

    <!-- Upload button -->
    <button
      @click="fileInput.click()"
      class="px-1 py-1 bg-black text-white text-sm rounded transition"
    >
      Change
    </button>

    <!-- Uploading indicator -->
    <p v-if="isUploading" class="text-gray-500 mt-2">Uploading...</p>
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, onMounted, ref } from 'vue'

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
const defaultImage = '/images/default-avatar.png'
const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

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

    // 1️⃣ Upload to backend to get image URL
    const uploadResponse = await fetch(uploadImageUrl, {
      method: 'POST',
      body: formData,
    })

    if (!uploadResponse.ok) throw new Error('Image upload failed')
    const uploadData = await uploadResponse.json()
    const imageUrl = uploadData.name // make sure backend returns this key

    // 2️⃣ Send image URL to update user's profile
    const updateResponse = await fetch(`http://localhost:8080/user/${props.userId}/updateImage`, {
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
    alert('Upload failed. Please try again.')
  } finally {
    isUploading.value = false
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
