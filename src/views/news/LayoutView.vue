<script setup lang="ts"></script>

<template>
    <div class="p-10 border border-b-2">
        
        <RouterLink :to="{name:'home'}" class="px-4 py-2 bg-black text-white font-semibold rounded-lg shadow-md  focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 m-10 mt-10">Home</RouterLink>
    </div>
    <div class="sub-route-view min-h-[80vh]">
        <RouterView/>
    </div>
    <div class="sub-route-tabs flex flex-row flex-wrap place-content-center justify-between px-[200px] p-10 border border-t-2">
        <div class="sub-route">
            <RouterLink :to="{name:'news-details-view'}">Details</RouterLink>
        </div>
 <div class="sub-route"><RouterLink :to="{name:'news-comment-view'}">Comments</RouterLink>
</div>
 <div class="sub-route"><RouterLink :to="{name:'news-vote-view'}">Votes</RouterLink>
</div>
    </div>
    
</template>
