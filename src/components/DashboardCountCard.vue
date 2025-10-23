<script setup lang="ts">
export interface DashboardCountCardProps {
  title: string
  count: number | undefined
  icon: object
}
const props = defineProps<DashboardCountCardProps>()
</script>

<template>
  <div v-bind="$attrs" class="border rounded-lg p-4 w-[30%] h-32">
    <div class="flex flex-row justify-between">
      <h2 class="font-bold">{{ props.title }}</h2>
      <component :is="props.icon" class="h-6 w-6" />
    </div>
    <p class="text-2xl">{{ props.count }}</p>
  </div>
</template>
