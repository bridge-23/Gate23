<template>
  <q-card class="my-card">
    <q-img :src="receipt.image_url" class="aspect-square" fit="contain"> </q-img>
    <q-card-actions class="flex flex-col items-center mx-10">
      <q-btn color="primary" @click="onViewDetails" class="w-full"
        >Details</q-btn
      >
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

const props = defineProps(["receipt"]);
import { ref } from 'vue'


interface Modifier {
  modifier_name: string,
  modifier_price: number
}

interface Item {
      product_name: string,
      category: string,
      item_price: number,
      quantity: number,
      total_price: number,
      modifiers: Modifier[]
}

interface Locale {
  language: string,
  country: string,
  currency: string
}

interface Receipt {
  receipt_number: string,
  store_name: string,
  date: string,
  address: string,
  total_price: number,
  tax_and_serv: number,
  currency: string,
  main_category: string,
  line_items: Item[],
  locale: Locale,
  description: string,
  image_url: string
}

const showDetail = ref(false)
const details = ref()

const onViewDetails = async () => {
  details.value = JSON.stringify(props.receipt)
  showDetail.value = true
}
</script>
