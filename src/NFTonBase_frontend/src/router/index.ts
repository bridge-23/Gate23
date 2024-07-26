import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useProfileStore } from '@/stores/profile'
import { JunoProfileAPI } from '@/api/junoProfileAPI'

const routes = [
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'), // Layout for authentication pages
    children: [
      {
        path: 'login',
        component: () => import('@/components/login/LoginComponent.vue')
      }
      // You can add more auth-related routes here (e.g., registration, password reset)
    ]
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      // {
      //   path: '',
      //   component: () => import('@/views/HomeView.vue'),
      //   meta: { requiresAuth: true }
      // },
      {
        path: '',
        component: () => import('@/views/TesseractView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'all-nfts',
        component: () => import('@/views/AllNftsView.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'select-activity',
        component: () => import('@/components/onboarding/Step1SelectActivity.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'create-shop',
        component: () => import('@/components/onboarding/Step2CreateShop.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'create-collection',
        component: () => import('@/components/onboarding/Step3CreateCollection.vue'),
        meta: { requiresAuth: true }
      }
      // Add more routes as needed
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Add navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isLogin) {
    next('/auth/login') // Redirect to login page if not authenticated
  } else if (to.path === '/' && !authStore.isLogin) {
    next('/auth/login') // Redirect to login page if accessing home page and not authenticated
  } else if (requiresAuth && authStore.isLogin) {
    // Check if the user needs to complete onboarding
    const record = await fetchUserRecord()
    if (
      !record.onboarding_completed &&
      !['/select-activity', '/create-shop', '/create-collection'].includes(to.path)
    ) {
      next('/select-activity')
    } else if (record.onboarding_completed && to.path === '/select-activity') {
      next('/')
    } else {
      next()
    }
  } else {
    next()
  }
})

const fetchUserRecord = async () => {
  const junoProfileAPI = new JunoProfileAPI()
  const authStore = useAuthStore()

  try {
    const userProfile = await junoProfileAPI.fetchProfile(authStore.principal)
    console.log('userProfile', userProfile)

    return {
      onboarding_completed: userProfile?.onboarding_completed
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return {
      onboarding_completed: false
    }
  }
}

export default router
