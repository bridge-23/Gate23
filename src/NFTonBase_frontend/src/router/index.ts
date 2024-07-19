import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [{ path: '/', component: () => import('@/views/TesseractView.vue') }],
    },
    {
      path: '/all-nfts',
      component: () => import('@/layouts/MainLayout.vue'),
      children: [{ path: '/all-nfts', component: () => import('@/views/AllNftsView.vue') }],
    }
  ]
});

export default router;
