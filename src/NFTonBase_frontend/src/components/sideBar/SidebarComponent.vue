<template>
  <q-drawer v-model="drawerOpen" show-if-above side="left" elevated :width="250" :breakpoint="840"
  class=" bg-gradient-to-br from-[#141e30] to-[#243b55] -z-10">
    <div class="px-5 py-5 h-full">
      <div class="flex flex-col justify-between h-full">
        <div>
          <SidebarItems v-for="item in barItems" v-bind="item" :key="item.name" />
        </div>
        <SidebarItems v-bind="LogoutItem" v-if="isLogin" />
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import SidebarItems from './SidebarItems.vue'

const layoutStore = useLayoutStore()
const authStore = useAuthStore()

const { isLogin } = storeToRefs(authStore)
const { drawerOpen } = storeToRefs(layoutStore)
const barItems = [
  {
    name: 'Mint NFT',
    route: '/'
  },
  {
    name: 'All NFTs',
    route: '/all-nfts'
  }
  // {
  //     name: "Mint NFTs",
  //     route: "/mint-nfts"
  // },
  // {
  //     name: "Wallet",
  //     route: "/wallet"
  // },
]
const LogoutItem = {
  name: 'Logout',
  route: '/auth/login'
}
</script>

<style scoped>

</style>