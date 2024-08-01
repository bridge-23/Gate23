<template>
    <div class="products-page">
      <h4>{{ collectionName }}</h4>
      <div v-if="filteredProducts.length">
        <div v-for="product in filteredProducts" :key="product.id" class="product-item">
          <q-img
            :src="product.img_url"
            class="product-image"
            fit="contain"
            v-if="product.img_url"
          ></q-img>
          <div v-else class="product-image no-image justify-center text-center">
            <span class="text-gray-500">No Image Available</span>
          </div>
          <div class="product-details">
            <h2 class="product-name">Title: {{ product.product_name }}</h2>
            <p class="product-description">Description: {{ product.description }}</p>
            <p class="product-price">Price: {{ product.product_price }} {{ product.product_currency }}</p>
            <!-- Add more product details as needed -->
          </div>
        </div>
      </div>
      <div v-else>
        <p>No products found for this collection.</p>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useCollectionStore } from '@/stores/collection'
  import { storeToRefs } from 'pinia'
  import { useProductStore } from '@/stores/product'
  
  const route = useRoute()
  const collectionStore = useCollectionStore()
  const productStore = useProductStore()
  
  const { collections } = storeToRefs(collectionStore)
  const { products } = storeToRefs(productStore)
  const collectionName = ref('')
  
  const updateCollectionName = () => {
    const collectionId = route.params.collectionId as string
    const collection = collections.value.find((c) => c.id === collectionId)
    collectionName.value = collection ? collection.collection_name : 'Collection'
  }
  
  const filteredProducts = computed(() => {
    const collectionId = route.params.collectionId as string
    return products.value.filter((product) => product.product_collection_id === collectionId)
  })
  
  onMounted(async () => {
    await collectionStore.fetchCollections()
    await productStore.fetchProducts()
    updateCollectionName()
  })
  
  watch(route, updateCollectionName)
  </script>
  
  <style scoped>
  .products-page {
    padding: 20px;
  }
  
  .product-item {
    display: flex;
    align-items: center;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
  }
  
  .product-image {
    width: 100px;
    height: 100px;
    margin-right: 20px;
  }
  
  .no-image {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    color: #888;
  }
  
  .product-details {
    flex: 1;
  }
  
  .product-name {
    font-size: 1.2em;
    margin: 0;
  }
  
  .product-description {
    color: #555;
  }
  </style>
  