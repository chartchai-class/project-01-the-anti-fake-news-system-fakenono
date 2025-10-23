<script setup lang="ts">
import { ArcElement, Chart, Legend, Title, Tooltip } from 'chart.js'
import { defineProps } from 'vue'
import { Pie } from 'vue-chartjs'

const props = defineProps<{
  verifiedCount: number
  fakeCount: number
  pendingCount: number
}>()

Chart.register(Title, Tooltip, Legend, ArcElement)
</script>

<template>
  <div v-bind="$attrs">
    <Pie
      :data="{
        labels: ['Verified', 'Fake', 'Pending'],
        datasets: [
          {
            data: [props.verifiedCount, props.fakeCount, props.pendingCount],
            backgroundColor: ['#81C784', '#E57373', '#FFD54F'],
          },
        ],
      }"
    />
  </div>
  <hr />
  <div class="flex justify-around mt-4">
    <div class="flex items-center">
      <span class="inline-block w-4 h-4 mr-2" :style="{ backgroundColor: '#81C784' }"></span>
      <span>Verified: {{ props.verifiedCount }}</span>
    </div>
    <div class="flex items-center">
      <span class="inline-block w-4 h-4 mr-2" :style="{ backgroundColor: '#E57373' }"></span>
      <span>Fake: {{ props.fakeCount }}</span>
    </div>
    <div class="flex items-center">
      <span class="inline-block w-4 h-4 mr-2" :style="{ backgroundColor: '#FFD54F' }"></span>
      <span>Pending: {{ props.pendingCount }}</span>
    </div>
  </div>
</template>
