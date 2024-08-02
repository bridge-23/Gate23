<template>
  <div class="login-container">
    <div class="login-form">
      <h2 class="text-black font-bold my-4">Gate23</h2>
      <q-btn class="login-button" @click="onLogin" :loading="isLoading">
        <i class="fas fa-fingerprint"></i> Log in
      </q-btn>
    </div>
    <!-- Footer Container -->
    <div class="footer">
      <img src="/ICP-badge.png" alt="Icon" class="full-size-image">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NFIDProvider, signIn } from '@junobuild/core'
import logoUrl from '@/assets/icon-512x512.png'
import { useAuthStore } from '@/stores/auth'
import {useRouter} from "vue-router";
const isLoading = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const onLogin = async () => {
  isLoading.value = true

  try {
    await signIn({
      maxTimeToLive: BigInt(30 * 24 * 60 * 60 * 1000 * 1000 * 1000), // 30 days
      provider: new NFIDProvider({
        appName: 'Gate23',
        logoUrl
      })
    })
    authStore.setIsLogin(true)
    router.push('/')
  } catch (error) {
    console.error('Failed to sign in:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh; /* Full viewport height */
  background-color: #f8f9fa;
}

.login-form {
  background-color: #f8f9fa;
  padding: 3rem;
  border-radius: 10px;
  text-align: center;
  color: black;
}

.login-form h1 {
  margin-bottom: 2rem;
  font-size: 3rem;
  color: #0c0c0c;
}

.login-button {
  background-color: #ffffff;
  border: 2px solid transparent;
  color: #0c0c0c;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.login-button i {
  margin-right: 0.5rem;
}

.login-button:hover {
  border-color: black;
  font-weight: bold;
}

.login-button:active {
  border-color: black;
}

.footer {
  width: 100%; /* Ensure footer spans the full width */
  display: flex;
  justify-content: center; /* Center content horizontally */
  align-items: center; /* Center content vertically if needed */
  padding: 1rem 0;
  background-color: #ebebeb; /* Optional: background color for footer */
}

.full-size-image {
  max-width: 150px; /* Adjust size as needed */
  opacity: 0.8; /* Slight transparency if desired */
}

</style>
