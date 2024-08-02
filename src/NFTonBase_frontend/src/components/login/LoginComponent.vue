<template>
  <div class="login-container">
    <div class="login-form">
      <h2 class="text-black font-bold my-4">Gate23</h2>
      <q-btn class="login-button" @click="onLogin" :loading="isLoading">
        <i class="fas fa-fingerprint"></i> Log in
      </q-btn>
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
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ffffff;
}

.login-form {
  background-color: #ffffff;
  padding: 3rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
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
  border: none;
  color: #0c0c0c;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-button i {
  margin-right: 0.5rem;
}

.login-button:hover {
  background-color: #1e1d1d;
}

.login-button:active {
  transform: scale(0.98);
}

</style>
