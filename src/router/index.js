import DashboardView from '@/views/DashboardView.vue'
import CreateView from '@/views/CreateView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LoginVue from '@/views/LoginVue.vue'
import { useAuthStore } from '@/stores/auth'
import UpdateView from '@/views/UpdateView.vue'
import VideoView from '@/views/VideoView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginVue,
      meta: { guest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { auth: true }
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView,
      meta: { auth: true }
    },
    {
      path: '/update/:id',
      name: 'update',
      component: UpdateView,
      meta: { auth: true }
    },
    {
      path: '/videos',
      name: 'videos',
      component: VideoView,
      meta: { auth: true }
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  await authStore.getUser()

  if (authStore.user && to.meta.guest) {
    return next({ name: 'dashboard' })
  }

  if (!authStore.user && to.meta.auth) {
    return next({ name: 'login' })
  }

  next()
})


export default router
