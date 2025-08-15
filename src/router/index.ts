import HomeView from '@/views/HomeView.vue'
import CommentsView from '@/views/news/CommentsView.vue'
import DetailsView from '@/views/news/DetailsView.vue'
import LayoutView from '@/views/news/LayoutView.vue'
import VoteView from '@/views/news/VoteView.vue'
import PostView from '@/views/PostView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/news/:id',
      name: 'news-layout-view',
      component: LayoutView,
      props: true,
      children: [
        {
          path: '',
          name: 'news-details-view',
          component: DetailsView,
          props: true,
        },
        {
          path: 'vote',
          name: 'news-vote-view',
          component: VoteView,
        },
        {
          path: 'comment',
          name: 'news-comment-view',
          component: CommentsView,
        },
      ],
    },
    {
      path: '/post',
      name: 'news-post-view',
      component: PostView,
    },
  ],
})

export default router
