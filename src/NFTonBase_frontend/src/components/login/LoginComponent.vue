<template>
  <div class="main-container">
    <!-- Navbar -->
    <div class="navbar">
      <div class="navbar2">
        <img src="/icon-512x512.png" alt="Gate23 Logo" class="logo">
        <h1 class="site-title">Gate23</h1>
      </div>
      <q-btn class="login-button" @click="onLogin" :loading="isLoading">
         Log in
      </q-btn>
    </div>

    <!-- Cover Image and Text -->
    <div class="cover-image-container">
      <div class="cover-text">
        <h1 class="cover-title">Making Commerce Better for Everyone</h1>
        <p class="cover-subtitle">
          Gate23 is supporting the next generation of entrepreneurs,
          the world's biggest brands, and everyone in between.
        </p>
      </div>
    </div>

    <!-- Footer -->
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
import { useRouter } from "vue-router";

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
    await router.push('/')
  } catch (error) {
    console.error('Failed to sign in:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
}

.navbar {
  position: fixed;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: rgba(128, 128, 128, 0.9);
  color: white;
  height: 60px;
  z-index: 1000;
}

.navbar2 {
  display: flex;
  align-items: center;
}

.logo {
  max-height: 50px;
}

.site-title {
  font-size: 2rem;
  font-weight: bold;
  margin-left: 10px;
}

.login-button {
  background-color: #ffffff;
  color: #0c0c0c;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transition: all 0.3s ease;
}

.login-button:hover {
  background-color: #f0f0f0;
}

.cover-image-container {
  flex-grow: 1;
  background-image: url('/Cover.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 20px;
}

.cover-text {
  background: rgba(0, 0, 0, 0.5);
  padding: 2rem;
  border-radius: 10px;
}

.cover-title {
  font-size: 3rem;
  margin: 0;
  font-weight: bold;
}

.cover-subtitle {
  font-size: 1.5rem;
  margin-top: 1rem;
}

.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  background-color: rgb(245, 246, 246);
}

.full-size-image {
  max-width: 150px;
  opacity: 0.8;
}

/* Media query for small screens (mobile devices) */
@media (max-width: 600px) {
  .navbar {
    flex-direction: row;
    padding: 10px;
    height: auto;
  }

  .site-title {
    font-size: 1.5rem;
  }

  .cover-title {
    font-size: 2rem;
  }

  .cover-subtitle {
    font-size: 1rem;
  }

  .cover-text {
    padding: 1rem;
  }

  .login-button {
    margin-top: 10px; /* Adds margin for spacing on smaller screens */
  }
}
</style>
