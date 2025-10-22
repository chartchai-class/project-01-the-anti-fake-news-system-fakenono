import HomeView from '@/views/HomeView.vue'
import CommentsView from '@/views/news/CommentsView.vue'
import DetailsView from '@/views/news/DetailsView.vue'
import LayoutView from '@/views/news/LayoutView.vue'
import VoteView from '@/views/news/VoteView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import PostView from '@/views/PostView.vue'
import UserDetailView from '@/views/UserDetailView.vue'
import nProgress from 'nprogress'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: (route) => ({
        page: parseInt(route.query.page?.toString() || '1'),
        limit: parseInt(route.query.limit?.toString() || '6'),
      }),
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
          props: true,
        },
        {
          path: 'comment',
          name: 'news-comment-view',
          component: CommentsView,
          props: true,
        },
      ],
    },
    {
      path: '/post',
      name: 'news-post-view',
      component: PostView,
    },
    {
      path: '/user',
      name: 'user-detail-view',
      component: UserDetailView,
    },
    {
      path: '/404/:resource',
      name: '404-resource-view',
      component: NotFoundView,
      props: true,
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found-view',
      component: NotFoundView,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

router.beforeEach(() => {
  nProgress.start()
})

router.afterEach(() => {
  nProgress.done()
})

export default router
