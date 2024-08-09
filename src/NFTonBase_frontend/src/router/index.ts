import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { JunoProfileAPI } from '@/api/junoProfileAPI'
// import { useProfileStore } from '@/stores/profile'
// import { useCollectionStore } from '@/stores/collection'
// import { JunoCollectionAPI } from '../api/junoCollectionAPI'

const routes = [
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/components/login/LoginComponent.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/ProductView.vue'),
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
      },
      {
        path: '/collections/:collectionId',
        component: () => import('@/components/dashboard/ProductPage.vue'),
        meta: { requiresAuth: true }
      }

    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  if (requiresAuth && !authStore.isLogin) {
    next('/auth/login')
  } else if (to.path === '/' && !authStore.isLogin) {
    next('/auth/login')
  } else if (requiresAuth && authStore.isLogin) {
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
  // const junoCollectionAPI = new JunoCollectionAPI()
  const authStore = useAuthStore()
  // const collectionStore = useCollectionStore()

  try {
    const userProfile = await junoProfileAPI.fetchProfile(authStore.principal)
    // const collections = await junoCollectionAPI.fetchAll()
    // collectionStore.setAllCollectionData(collections)

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
