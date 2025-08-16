<script setup lang="ts">
import NewsService from '@/services/NewsService';
import { useNewsStore } from '@/stores/news';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps<{ id: number }>();
const tempId=useRoute().params.id//use tempId as I cannot not receive props yet
const newsStore = useNewsStore();
onMounted(() => {
        NewsService.getNewsById(tempId).then(news => {
            newsStore.setNews(news.data)
            console.log(news.data)
        }).catch((err)=>console.log(err))
  
})


</script>

<template>
    <div class="p-10 pt-5 pb-5 text-center md:text-left ">
        
        <RouterLink :to="{name:'home'}" class="px-4 py-2  bg-white text-black font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 m-10 mt-10 border border-black " > <span class="font-bold text-xl"> &larr; </span>&nbsp;&nbsp; Back To Home</RouterLink>
    </div>


    <div class="sub-route-view min-h-[80vh]">
        <RouterView/>
    </div>


    <div class="flex bg-gray-100 rounded-full p-1 md:w-[80%] w-[95%] mx-auto my-10">
  <RouterLink
    :to="{ name: 'news-details-view' }"
    class="flex-1 text-center py-2 rounded-full font-semibold"
    active-class="bg-white shadow"
    exact-active-class="bg-white shadow"
  >
    Details
  </RouterLink>

  <RouterLink
    :to="{ name: 'news-comment-view' }"
    class="flex-1 text-center py-2 rounded-full font-semibold text-gray-700"
    active-class="bg-white shadow"
    exact-active-class="bg-white shadow"
   
  >
    Comments
  </RouterLink>

  <RouterLink
    :to="{ name: 'news-vote-view' }"
    class="flex-1 text-center py-2 rounded-full font-semibold text-gray-700 "
    active-class="bg-white shadow"
    exact-active-class="bg-white shadow"
  >
    Votes
  </RouterLink>
</div>

    
</template>
