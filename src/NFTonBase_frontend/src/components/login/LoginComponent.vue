<template>
  <div class="login-container">
    <div class="login-form">
      <h2 class="text-white">Login</h2>
      <h3 class="text-white my-4">Gate23</h3>
      <q-btn class="login-button" @click="onLogin" :loading="isLoading">
        <i class="fas fa-fingerprint"></i> Log In with Internet Identity
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NFIDProvider, signIn } from '@junobuild/core'
import logoUrl from '@/assets/icon-512x512.png'
import router from '@/router';

const isLoading = ref(false)

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
  background: linear-gradient(to top, #2e2e2e 0%, #070707 100%);
}

.login-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  text-align: center;
  color: black;
}

.login-form h1 {
  margin-bottom: 2rem;
  font-size: 3rem;
  color: #fff;
}

.login-button {
  background-color: #1c92d2;
  background: linear-gradient(to top, #2e2e2e 0%, #070707 100%);
  border: none;
  color: white;
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
  background-image: linear-gradient(to top, #070707 0%, #2e2e2e 100%);
}

.login-button:active {
  transform: scale(0.98);
}
</style>
