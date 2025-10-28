import UserService from '@/services/UserService'
import { useAuthStore } from '@/stores/auth'
import AdminDashboardView from '@/views/admin/DashboardView.vue'
import AdminLayoutView from '@/views/admin/LayoutView.vue'
import MemberRequestView from '@/views/admin/MemberRequestView.vue'
import HomeView from '@/views/HomeView.vue'
import CommentsView from '@/views/news/CommentsView.vue'
import DetailsView from '@/views/news/DetailsView.vue'
import LayoutView from '@/views/news/LayoutView.vue'
import VoteView from '@/views/news/VoteView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import PostView from '@/views/PostView.vue'
import UserDetailView from '@/views/UserDetailView.vue'
import UserUpdateView from '@/views/UserUpdateView.vue'
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
      path: '/login',
      name: 'login-view',
      component: () => import('@/views/authentication/LoginView.vue'),
    },
    {
      path: '/registration',
      name: 'registration-view',
      component: () => import('@/views/authentication/RegistrationView.vue'),
    },
    {
      path: '/post',
      name: 'news-post-view',
      component: PostView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        UserService.getUserById(authStore.user.id)
          .then((response) => {
            authStore.setUser(response.data)
          })
          .catch(() => {
            authStore.setUser(null)
          })
          .finally(() => {
            next()
          })
      },
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
    {
      path: '/admin',
      name: 'admin-layout-view',
      component: AdminLayoutView,
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard-view',
          component: AdminDashboardView,
        },
        {
          path: 'member-requests',
          name: 'admin-member-requests-view',
          component: MemberRequestView,
        },
      ],
    },
    {
      path: '/user/update',
      name: 'user-update-view',
      component: UserUpdateView,
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
