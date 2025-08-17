<!-- <template>
  <div class="w-full bg-gray-200 rounded-full h-4">
    <div
      class="h-4 rounded-full transition-all duration-500"
      :class="barColor"
      :style="{ width: percent + '%' }"
    ></div>
  </div>
  <p class="mt-2 text-sm font-medium">{{ percent }}%</p>
</template>

<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
  percent: {
    type: Number,
    required: true,
    validator: (val) => val >= 0 && val <= 100,
  },
})

const barColor = computed(() => {
  if (props.percent < 40) return "bg-red-500"
  if (props.percent < 70) return "bg-yellow-500"
  return "bg-green-500"
})
</script> -->
<template>
  <div class="w-full max-w-md">
    <div class="mb-2 flex justify-between text-sm">
      <span>Real: {{ realPercent }}%</span>
      <span>Fake: {{ fakePercent }}%</span>
    </div>

    <!-- Stacked Percent Bar -->
    <div class="w-full h-6 bg-gray-200 rounded-full overflow-hidden flex">
      <div class="h-full bg-green-600" :style="{ width: realPercent + '%' }"></div>
      <div class="h-full bg-red-600" :style="{ width: fakePercent + '%' }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ realVote: number; fakeVote: number }>()
const realVotes = computed(() => {
  return props.realVote
})
const fakeVotes = computed(() => {
  return props.fakeVote
})
console.log(realVotes.value)
console.log(fakeVotes.value)

const total = computed(() => realVotes.value + fakeVotes.value)

const realPercent = computed(() =>
  total.value ? ((realVotes.value / total.value) * 100).toFixed(1) : 0,
)
const fakePercent = computed(() =>
  total.value ? ((fakeVotes.value / total.value) * 100).toFixed(1) : 0,
)
</script>
