<template>
  <q-layout view="hHh LpR lFf">
    <q-header elevated height-hint="100">
      <HeaderComponent />
    </q-header>

    <SidebarComponent />

    <q-page-container class="scroll-y-auto">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MainLayout'
})

import { ref } from 'vue'
import HeaderComponent from '@/components/header/HeaderComponent.vue'
import SidebarComponent from '@/components/sideBar/SidebarComponent.vue'

</script>
