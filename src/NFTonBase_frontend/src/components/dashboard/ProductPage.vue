<template>
  <div class="products-page">
    <h4>{{ collectionName }}</h4>
    <div v-if="products.length" class="table-container">
      <table class="products-table">
        <thead>
        <tr>
          <th>Image</th>
          <th>Product</th>
          <th>Status</th>
          <th>Description</th>
          <th>Price</th>
          <th>Inventory</th>
          <th>Category</th>
          <th>BaseScan</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>
            <q-img
              :src="product.img_url"
              class="product-image"
              fit="contain"
              v-if="product.img_url"
            ></q-img>
            <div v-else class="product-image no-image text-center">
              <span class="text-gray-500">No Image Available</span>
            </div>
          </td>
          <td>{{ product.product_name }}</td>
          <td><span class="status-label">Available</span></td>
          <td>{{ product.description }}</td>
          <td>{{ product.product_price }} {{ product.product_currency }}</td>
          <!-- Add more product details as needed -->
          <td>100</td>
          <td>Beverage</td>
          <td>
            <a href="https://basescan.org/address/0x1cfea7ecb518b3e4c5f72f11bc0f8e75a070a5c0" target="_blank" class="status-link">
              <span class="status-label1">Minted</span>
            </a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>No products found for this collection.</p>
    </div>
    <q-inner-loading
      :showing="isLoading"
      label="Loading NFTs..."
      label-class="text-teal"
      label-style="font-size: 1.1em"
    />
  </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCollectionStore } from '@/stores/collection'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { ethers } from "ethers";
import TokenABI from "@/utils/NFTABI.json";


interface Product {
  description: string, 
  id: string, 
  img_url: string, 
  nft_data: string, 
  product_collection_id: string, 
  product_currency: string, 
  product_name: string, 
  product_price: string 
}

const RPC_ENDPOINT = "wss://base-rpc.publicnode.com";
const CONTRACT_ADDRESS = "0x1CFEA7ecB518B3e4C5f72f11bc0F8E75A070A5C0";

const collectionStore = useCollectionStore()
const route = useRoute()
const authStore = useAuthStore()
const { ethAddress } = storeToRefs(authStore)
const products = ref<Product[]>([])
const isLoading = ref(false)
  
  const { collections } = storeToRefs(collectionStore)
  const collectionName = ref('')
  
  onMounted(async () => {
    updateCollection()
  })
  watch(() => route.params.collectionId, async () => {
    products.value = []
    updateCollection()
  })

  const updateCollection = async () => {
    const collectionId = route.params.collectionId as string
    const collection = collections.value.find((c) => c.id === collectionId)
    collectionName.value = collection ? collection.collection_name : 'Collection'
    if(!ethAddress.value) return
    isLoading.value = true
    const provider = new ethers.providers.WebSocketProvider(RPC_ENDPOINT);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, TokenABI, provider);
    try {
      const nftIDs: number[] = await contract.getHoldTokenIds(ethAddress.value); 
      nftIDs.forEach(async (nftID) => {
        const uri: string = await contract.uri(nftID);
        const nftData = await fetch(uri);
        const json:Product = await nftData.json()
        if(json.product_collection_id == collectionId)
          products.value.push(json)
      })
      isLoading.value = false
    } catch (error) {
      console.error("Error calling contract method:", error);
    }
  }
  </script>

<style scoped>
.products-page {
  padding: 20px;
}

.table-container {
  overflow-x: auto; /* To allow horizontal scrolling for small screens */
}

.products-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.products-table th, .products-table td {
  border: 1px solid #e0e0e0;
  padding: 10px;
  text-align: left;
}

.products-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.product-image {
  width: 50px;
  height: 50px;
}

.no-image {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #888;
}

.status-label {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #d4f4dd; /* Example for "Active" */
  color: #007e33; /* Dark green text */
  font-size: 0.9em;
}

.status-label1 {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: #0b4ba9; /* Example for "Active" */
  color: #f5f6f6; /* Dark green text */
  font-size: 0.9em;
}

.products-table tr:nth-child(even) {
  background-color: #fafafa;
}
</style>