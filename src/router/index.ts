import NewsService from '@/services/NewsService'
import { useNewsListStore } from '@/stores/newslist'
import { NewsStatus } from '@/types'
import HomeView from '@/views/HomeView.vue'
import CommentsView from '@/views/news/CommentsView.vue'
import DetailsView from '@/views/news/DetailsView.vue'
import LayoutView from '@/views/news/LayoutView.vue'
import VoteView from '@/views/news/VoteView.vue'
import PostView from '@/views/PostView.vue'
import nProgress from 'nprogress'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: () => {
        const newsListStore = useNewsListStore()
        return NewsService.getNews()
          .then((response) => {
            const newsList = response.data
            for (const news of newsList) {
              const totalVoteCount = news.fakeVoteCount + news.verifiedVoteCount
              if (totalVoteCount < 20) {
                news.status = NewsStatus.Pending
              } else if (news.verifiedVoteCount / totalVoteCount < 0.6) {
                news.status = NewsStatus.Fake
              } else {
                news.status = NewsStatus.Verified
              }
            }
            newsListStore.setNewsList(newsList)
          })
          .catch((error) => {
            console.error('Failed to fetch news:', error)
          })
      },
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

router.beforeEach(() => {
  nProgress.start()
})

router.afterEach(() => {
  nProgress.done()
})

export default router
