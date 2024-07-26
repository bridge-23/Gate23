<template>
  <div class="login-container">
    <div class="login-form">
      <h1>Login</h1>
      <q-btn class="login-button" @click="onLogin" :loading="isLoading">
        <i class="fas fa-fingerprint"></i> Log In with Internet Identity
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { NFTonBase_backend } from 'declarations/NFTonBase_backend'
import { NFIDProvider, signIn, authSubscribe, type User } from '@junobuild/core'
import logoUrl from '@/assets/icon-512x512.png'
import { useProfileStore } from '@/stores/profile'

const isLoading = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const profileStore = useProfileStore()

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

    authSubscribe((user: User | null) => {
      if (user) {
        profileStore.setId(user.key)
        authStore.setIsLogin(true)
        authStore.setPrincipal(user.key)

        NFTonBase_backend.get_evm_address(user.key)
          .then((result) => {
            authStore.setAddress(result)
            profileStore.setAddress(result)
          })
          .catch((error) => {
            console.error('Error fetching EVM address:', error)
          })

        router.push('/')
      }
    })
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
}

.login-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  text-align: center;
  color: white;
}

.login-form h1 {
  margin-bottom: 2rem;
  font-size: 3rem;
  color: #fff;
}

.login-button {
  background-color: #1c92d2;
  background-image: linear-gradient(to top, #f2fcfe 0%, #1c92d2 100%);
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
  background-image: linear-gradient(to top, #1c92d2 0%, #f2fcfe 100%);
}

.login-button:active {
  transform: scale(0.98);
}
</style>
