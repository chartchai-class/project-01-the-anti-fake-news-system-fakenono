<script setup lang="ts">
export interface DashboardCompareCardProps {
  valueA: number | undefined
  valueB: number | undefined
  labelA: string
  labelB: string
  icon: object
}

const props = defineProps<DashboardCompareCardProps>()
</script>

<template>
  <div v-bind="$attrs" class="border rounded-lg p-4 w-[45%] h-32">
    <div class="flex flex-row">
      <h2 class="font-bold">{{ props.labelA }} vs {{ props.labelB }}</h2>
      <component :is="props.icon" class="h-6 w-6 ml-auto" />
    </div>
    <div class="flex flex-row justify-between mb-4">
      <div class="flex flex-col justify-center">
        <span class="font-medium">{{ props.labelA }}</span>
        <span class="text-2xl">{{ props.valueA }}</span>
      </div>
      <div class="flex flex-col justify-center">
        <span class="font-medium">{{ props.labelB }}</span>
        <span class="text-2xl">{{ props.valueB }}</span>
      </div>
    </div>
  </div>
</template>
