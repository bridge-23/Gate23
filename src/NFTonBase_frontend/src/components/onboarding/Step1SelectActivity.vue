<template>
  <div class="container">
    <h1>Where do you plan to use it?</h1>
    <div class="button-grid">
      <button
        class="activity-button"
        :class="{ selected: selectedActivity === 'E-commerce' }"
        @click="selectActivity('E-commerce')"
      >
        E-commerce
      </button>
      <button
        class="activity-button"
        :class="{ selected: selectedActivity === 'Restaurant' }"
        @click="selectActivity('Restaurant')"
      >
        Restaurant
      </button>
      <button
        class="activity-button"
        :class="{ selected: selectedActivity === 'Coffee-shop' }"
        @click="selectActivity('Coffee-shop')"
      >
        Coffee-shop
      </button>
      <button
        class="activity-button"
        :class="{ selected: selectedActivity === 'F&B' }"
        @click="selectActivity('F&B')"
      >
        F&B
      </button>
      <button
        class="activity-button"
        :class="{ selected: selectedActivity === 'Retail' }"
        @click="selectActivity('Retail')"
      >
        Retail
      </button>
      <button
        class="activity-button"
        :class="{ selected: selectedActivity === 'CRM' }"
        @click="selectActivity('CRM')"
      >
        CRM
      </button>
    </div>
    <button class="btn-next" @click="nextStep">Next</button>
  </div>
</template>

<script setup lang="ts">

import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profile'

const selectedActivity = ref('')
const router = useRouter()
const profileStore = useProfileStore()

const selectActivity = (activity: string) => {
  selectedActivity.value = activity
}

const nextStep = () => {
  if (!selectedActivity.value) {
    alert('Please select an activity type.')
    return
  }
  profileStore.setActivity(selectedActivity.value)
  router.push('/create-shop')
}
</script>

<style scoped>
h1 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.button-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.activity-button {
  margin: 5px;
  padding: 10px;
  border: none;
  background-color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
  border-radius: 5px;
}

.activity-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
