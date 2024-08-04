<!-- eslint-disable vue/require-v-for-key -->
<template>
  <q-page v-if="isLogin">
    <div class="px-10 py-10">
      <div v-if="isLoading">
        <p class="text-center text-primary text-xl font-bold">Loading...</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" v-else>
        <template v-if="nftList.length > 0">
          <div class="col-span-1" v-for="nft in nftList" :key="nft.receipt_number">
            <NftCard v-bind="{ receipt: nft }" />
          </div>
        </template>
        <div v-else class="col-span-full">
          <p class="text-center text-primary text-xl font-bold">No NFTs available...</p>
        </div>
      </div>
    </div>
  </q-page>
  <q-page v-else class="flex justify-center items-center h-full">
    <p class="text-[#1976D2] text-2xl font-semibold">Please log in first...</p>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onBeforeMount } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import NftCard from '@/components/dashboard/NFTCard.vue'
import { ethers } from 'ethers'
import TokenABI from '@/utils/NFTABI.json'
import type { Product } from '@/types/entities'

// Interfaces
interface Modifier {
  modifier_name: string
  modifier_price: number
}

interface Item {
  product_name: string
  category: string
  item_price: number
  quantity: number
  total_price: number
  modifiers: Modifier[]
}

interface Locale {
  language: string
  country: string
  currency: string
}

interface Receipt {
  receipt_number: string
  store_name: string
  date: string
  address: string
  total_price: number
  tax_and_serv: number
  currency: string
  main_category: string
  line_items: Item[]
  locale: Locale
  description: string
  image_url: string
}

const authStore = useAuthStore()
const { isLogin, ethAddress } = storeToRefs(authStore)
const RPC_ENDPOINT = 'https://base.drpc.org'
const CONTRACT_ADDRESS = '0x1CFEA7ecB518B3e4C5f72f11bc0F8E75A070A5C0'
const nftList = ref<Product[]>([])
const isLoading = ref(false)

onBeforeMount(async () => {
  if (!ethAddress.value) return
  isLoading.value = true
  const provider = new ethers.providers.WebSocketProvider(RPC_ENDPOINT)
  const contract = new ethers.Contract(CONTRACT_ADDRESS, TokenABI, provider)
  try {
    const nftIDs: number[] = await contract.getHoldTokenIds(ethAddress.value)
    console.log('NFT IDs:', nftIDs)
    nftIDs.map(async (nftID) => {
      const uri: string = await contract.uri(nftID)
      const nftData = await fetch(uri)
      const json: Product = await nftData.json()
      nftList.value.push(json)
    })
  } catch (error) {
    console.error('Error calling contract method:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
