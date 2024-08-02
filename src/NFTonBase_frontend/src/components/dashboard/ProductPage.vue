<template>
  <div class="products-page">
    <h4>{{ collectionName }}</h4>
    <div v-if="filteredProducts.length" class="table-container">
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
        <tr v-for="product in filteredProducts" :key="product.id">
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