<template>
  <main>
    <ProductComponent />
  </main>
</template>

<script setup lang="ts">
import ProductComponent from "@/components/dashboard/ProductComponent.vue";

defineOptions({
  name: 'ProductView'
});
</script>