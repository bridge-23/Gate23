<template>
  <q-card class="my-card">
    <q-img
      :src="receiptImageUrl"
      class="aspect-square"
      fit="contain"
      v-if="receiptImageUrl"
    ></q-img>
    <div v-else class="aspect-square flex items-center justify-center bg-gray-200">
      <span class="text-gray-500">No Image Available</span>
    </div>
    <q-card-actions class="flex flex-col items-center mx-10">
      <q-btn color="primary" @click="onViewDetails" class="w-full">Details</q-btn>
    </q-card-actions>
  </q-card>
  <q-dialog v-model="showDetail">
    <q-card>
      <q-card-section>
        <q-input
          v-model="details"
          placeholder="Uploaded Image URL"
          outlined
          readonly
          autogrow
          class="w-[350px]"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
const props = defineProps(['receipt'])
import { ref, computed } from 'vue'

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
  id: string
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
  source: string
  imageUrl?: string
  product_img_url?: string
  img_url?: string
}

const showDetail = ref(false)
const details = ref()

const receiptImageUrl = computed(() => {
  return (
    props.receipt.imageUrl ||
    props.receipt.product_img_url ||
    props.receipt.img_url ||
    props.receipt.nft_data ||
    null
  )
})

const onViewDetails = async () => {
  try {
    details.value = JSON.stringify(props.receipt, null, 2)
    showDetail.value = true
  } catch (error) {
    console.error('Error parsing receipt data:', error)
    details.value = 'Error displaying receipt details'
    showDetail.value = true
  }
}
</script>
