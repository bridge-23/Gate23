<template>
  <div class="header-container">
    <q-toolbar class="h-[60px] z-50">
      <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
      <!-- <q-Img :src=""></q-Img> -->
      <q-toolbar-title>
        <p class="m-0 text-2xl font-semibold">{{ title }}</p>
      </q-toolbar-title>
      <div>
        <p v-if="isLogin" class="mb-0 text-md font-semibold">{{ principal }}</p>
        <p v-if="isLogin" class="mb-0 text-md font-semibold">{{ ethAddress }}</p>
        <!-- <q-inner-loading :showing="isLoading" label-class="text-teal" label-style="font-size: 1.1em" /> -->
      </div>
    </q-toolbar>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useLayoutStore } from '@/stores/layout'
import { useProfileStore } from '@/stores/profile'
import { Actor, HttpAgent } from '@dfinity/agent'
import { authSubscribe, type User } from '@junobuild/core'
import { storeToRefs } from 'pinia'
import { ref, watch, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { idlFactory as NFTonBase_idlFactory } from '@/utils/backend.did'

const route = useRoute()
const router = useRouter()

const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const profileStore = useProfileStore()

// const { setIsLogin, setPrincipal, setAddress } = authStore
const { setDrawerOpen } = layoutStore
const { isLogin, principal, ethAddress } = storeToRefs(authStore)
// const isLoading = ref(false)
const title = ref('Mint NFT')

watch(
  () => route.path,
  () => {
    if (route.path == '/mint-nft') title.value = 'Mint NFT'
    if (route.path == '/mint-nfts') title.value = 'Mint NFTs'
    if (route.path == '/all-nfts') title.value = 'All NFTs'
    if (route.path == '/wallet') title.value = 'Wallet'
  }
)

onBeforeMount(() => {
  if (route.path == '/') title.value = 'Mint NFT'
  if (route.path == '/mint-nfts') title.value = 'Mint NFTs'
  if (route.path == '/all-nfts') title.value = 'All NFTs'
  if (route.path == '/wallet') title.value = 'Wallet'
})

const toggleLeftDrawer = () => {
  setDrawerOpen()
}

authSubscribe(async (user: User | null) => {
  if (user) {
    profileStore.setId(user.key)
    authStore.setIsLogin(true)
    authStore.setPrincipal(user.key)

    try {
      const canisterId = 'tkuag-tqaaa-aaaak-akvgq-cai' as string
      const agent = new HttpAgent({ host: 'https://ic0.app' })
      const actor = Actor.createActor(NFTonBase_idlFactory, { agent, canisterId })
      const result = await actor.get_evm_address(user.key)
      authStore.setAddress(result)
      profileStore.setAddress(result as string)
    } catch (error) {
      console.error('Error fetching EVM address:', error)
    }

    router.push('/')
  }
})
</script>

<style scoped>
.header-container {
  background-color: #0d0d0d;
  color: #e1e1e1;
}
</style>
