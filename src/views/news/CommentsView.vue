<script setup lang="ts">
import { useNewsStore } from '@/stores/news';
import { storeToRefs } from 'pinia';

const newsStore = useNewsStore()
const { news } = storeToRefs(newsStore)





</script>

<template>
  <div class="comment  md:w-[80%] w-[95%] mx-auto mt-10 ">
    <div class="header  border-b-2 border-gray-900 pb-2 mb-5" id="cmt-header">
       <div class="h2 text-2xl font-semibold mb-5"> Comments & Discussion</div>
       <div class="desc text-gray-600"> Discussion about    <span class="font-bold"> "{{ news?.topic }}"</span></div>
       <div class="flex flex-row justify-between mt-2">
        <div id="upvoke " class="text-green-600 flex-1">{{ news?.verifiedVoteCount }} upvokes</div>
        <div id="downvoke" class="text-red-600 flex-1">{{ news?.fakeVoteCount }} downvokes</div>
        <div id="status" class="text-gray-500 flex-1"> Pending </div>
        <div id="commentCount" class="flex-1">{{ news?.comments.length }} comments</div>
       </div>
  </div>
  <div id="cmt-list"  v-if="news">
       <div class=" mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-4" v-for="(cmt,index) in news.comments" :key="index" >
  <!-- Header -->
  <div class="flex items-center justify-between mb-3">
    <h3 class="text-gray-900 font-semibold">John Doe</h3>
    <span class="text-sm text-gray-500">Aug 16, 2025</span>
  </div>

  <!-- Comment -->
  <p class="text-gray-700 leading-relaxed">
    {{ cmt }}
  </p>
</div>

  </div>
  </div>
</template>
