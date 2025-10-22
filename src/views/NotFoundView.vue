<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'
const props = withDefaults(
  defineProps<{
    resource: string
  }>(),
  {
    resource: 'page',
  },
)
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center">
    <h1 class="text-4xl font-bold my-6">Oops!</h1>
    <h3 class="text-lg my-2">The {{ props.resource }} you're looking for is not here.</h3>
    <router-link :to="{ name: 'home' }" class="text-white bg-black p-2 rounded-lg"
      >Back to the home page</router-link
    >
  </div>
</template>
