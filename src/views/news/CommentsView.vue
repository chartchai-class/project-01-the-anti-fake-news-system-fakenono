<script setup lang="ts">
import { useCommentListStore } from '@/stores/commentlists';
import { useNewsStore } from '@/stores/news';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const newsStore = useNewsStore()
const { news } = storeToRefs(newsStore)
const commentListStore = useCommentListStore()
const { commentlist }=storeToRefs(commentListStore)
const perPage=ref(6)
const pages = computed(() => {
    return Math.ceil((commentlist.value?.length ?? 0) / perPage.value)
})
const currentPage = ref(1)




// Slice comments for current page
const paginatedComments = computed(() => {
  const allComments = commentlist.value || []
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return allComments.slice(start, end)
})



const hasNextPage = () => {
    return currentPage.value<pages.value
}
const hasPrePage = () => {
    return currentPage.value>1
}

function increase() {
    currentPage.value+=1
}

function decrease() {
    currentPage.value-=1
}




</script>

<template>
  <div class="comment  md:w-[80%] w-[95%] mx-auto mt-10 ">
    <div class="header  border-b-2 border-gray-900 pb-2 mb-5" id="cmt-header">
       <div class="h2 text-2xl font-semibold mb-5"> Comments & Discussion</div>
       <div class="desc text-gray-600"> Discussion about    <span class="font-bold"> "{{ news?.topic }}"</span></div>
       <div class="flex flex-row justify-between mt-2">
        <div id="upvoke " class="text-green-600 flex-1">{{ news?.verifiedVoteCount }} upvokes</div>
        <div id="downvoke" class="text-red-600 flex-1">{{ news?.fakeVoteCount }} downvokes</div>
        <div id="status" class="flex-1" v-if="news?.status==1"> <div class="bg-green-600 rounded-md w-[25%] text-center text-white">Verified</div> </div>
  <div id="status" class="flex-1" v-if="news?.status==0"> <div class="bg-red-600 rounded-md w-[25%] text-center text-white">Fake</div> </div>
  <div id="status" class="flex-1" v-if="news?.status==2"> <div class="bg-gray-600 rounded-md w-[25%] text-center text-white">Pending</div> </div>




        <div id="commentCount" class="flex-1">{{ commentlist?.length }} comments</div>
       </div>
  </div>
  <div id="cmt-list"  v-if="news">
       <div class=" mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mb-4" v-for="(cmt,index) in paginatedComments" :key="index" >
  <!-- Header -->
  <div class="flex items-center justify-between mb-3">
    
    <h3 class="text-gray-900 font-semibold flex gap-2 items-center">  <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
    <span class="text-sm font-medium text-gray-600">JD</span>
  </div>  {{ cmt.commenter }}</h3>
    <span class="text-sm text-gray-500">{{ cmt.date }}</span>
  </div>

  <!-- Comment -->
  <p class="text-gray-700 leading-relaxed text-sm">
    {{ cmt.comment }}
  </p>
</div>

  </div>
  <div class="btn w-[40%] mx-auto flex flex-row justify-between ">

    <button @click="decrease" :disabled="!hasPrePage()"  class="px-2 py-1  bg-white text-black  rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 border border-black disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-100" >Previous</button>
     <div class="">Page:{{ currentPage }}</div>
    <button @click="increase" :disabled="!hasNextPage()" class="px-2 py-1  bg-white text-black  rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2  border border-black disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-300 disabled:border-gray-100">Next</button>
  </div>
  </div>
</template>
