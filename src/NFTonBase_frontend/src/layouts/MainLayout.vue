<template>
  <q-layout view="hHh LpR lFf">
    <q-header v-if="isLogin" elevated height-hint="100">
      <HeaderComponent />
    </q-header>

    <SidebarComponent v-if="isLogin" />

    <q-page-container class="scroll-y-auto">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import HeaderComponent from '@/components/header/HeaderComponent.vue';
import SidebarComponent from '@/components/sideBar/SidebarComponent.vue';

const authStore = useAuthStore();
const isLogin = computed(() => authStore.isLogin);
</script>
