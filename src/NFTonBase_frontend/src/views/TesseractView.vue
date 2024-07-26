<template>
  <main>
    <TesseractComponent />
  </main>
</template>

<script setup lang="ts">
import TesseractComponent from "@/components/dashboard/TesseractComponent.vue";

defineOptions({
  name: 'TesseractView'
});
</script>