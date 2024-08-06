<template>
  <div class="header-container">
    <q-toolbar class="h-[65px] z-50">
      <q-btn flat dense round icon="menu" @click="toggleLeftDrawer" />
      <!-- <q-Img :src=""></q-Img> -->
      <q-toolbar-title>
        <div class="flex items-center">
          <img src="/icon-512x512.png" alt="Icon" class="w-8 h-8 mr-2">
          <p class="m-0 text-2xl font-semibold">Gate 23</p>
          <!-- <p class="m-0 text-2xl font-semibold">{{ title }}</p> -->
        </div>
      </q-toolbar-title>
      <div>
        <div class="address-container" v-if="isLogin">
          <p class="mb-0 text-md font-semibold">
            Principal ID: {{ truncatedPrincipal }}
          </p>
          <q-btn
            round
            flat
            icon="content_copy"
            size="xs"
            class="icon-only-btn"
            @click="copyToClipboard(principal)"
          />
        </div>
        <div class="address-container" v-if="isLogin">
          <p class="mb-0 text-md font-semibold">
            EVM Address: {{ truncatedEthAddress }}
          </p>
          <q-btn
            round
            flat
            icon="content_copy"
            size="xs"
            class="icon-only-btn"
            @click="copyToClipboard(ethAddress)"
          />
        </div>
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
import { ref, watch, onBeforeMount, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { idlFactory as NFTonBase_idlFactory } from '@/utils/backend.did'

const route = useRoute()
//const router = useRouter()
const authStore = useAuthStore()
const layoutStore = useLayoutStore()
const profileStore = useProfileStore()
// const { setIsLogin, setPrincipal, setAddress } = authStore
const { setDrawerOpen } = layoutStore
const { isLogin, principal, ethAddress } = storeToRefs(authStore)

// Define a method to truncate strings
const truncate = (text: string, length: number): string => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Define computed properties for truncated values
const truncatedPrincipal = computed(() => truncate(principal.value, 14))
const truncatedEthAddress = computed(() => truncate(ethAddress.value, 10))
// const isLoading = ref(false)
const title = ref('Mint NFT')

watch(
  () => route.path,
  () => {
    if (route.path == '/mint-nft') title.value = 'Add product'
    if (route.path == '/mint-nfts') title.value = 'Add product'
    if (route.path == '/all-nfts') title.value = 'All products'
    if (route.path == '/wallet') title.value = 'Wallet'
  }
)

onBeforeMount(() => {
  if (route.path == '/') title.value = 'Add product'
  if (route.path == '/mint-nfts') title.value = 'Add product'
  if (route.path == '/all-nfts') title.value = 'All products'
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
  }
})
// Method to copy text to the clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied to clipboard!')
  }).catch(err => {
    console.error('Failed to copy: ', err)
  })
}
</script>

<style scoped>
.header-container {
  background-color: #0d0d0d;
  color: #e1e1e1;
  padding: 5px;
}
.address-container {
  display: flex;
  align-items: center; /* Vertically center the text and button */
  margin-bottom: 1px; /* Add some space between each container */

}

.icon-only-btn {
  margin-left: 1px; /* Space between text and button */
  margin-bottom: 5px;
}
</style>
