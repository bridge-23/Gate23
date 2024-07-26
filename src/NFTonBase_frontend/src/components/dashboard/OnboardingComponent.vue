<template>
  <div class="onboarding-container" v-if="!hasRecord">
    <div class="onboarding-form">
      <h1>Where you plan to use it?</h1>
      <div class="button-grid">
        <q-btn
          class="onboarding-button"
          outline
          label="E-commerce"
          @click="selectActivity('E-commerce')"
        ></q-btn>
        <q-btn
          class="onboarding-button"
          outline
          label="Restaurant"
          @click="selectActivity('Restaurant')"
        ></q-btn>
        <q-btn
          class="onboarding-button"
          outline
          label="Coffee-shop"
          @click="selectActivity('Coffee-shop')"
        ></q-btn>
        <q-btn class="onboarding-button" outline label="F&B" @click="selectActivity('F&B')"></q-btn>
        <q-btn
          class="onboarding-button"
          outline
          label="Retail"
          @click="selectActivity('Retail')"
        ></q-btn>
        <q-btn class="onboarding-button" outline label="CRM" @click="selectActivity('CRM')"></q-btn>
      </div>
    </div>
  </div>
  <div>
    <h1>User Profile</h1>
    <div>
      <p><strong>profile:</strong> {{ authStore.principal }}</p>
      <!-- Добавьте другие поля профиля, которые хотите отобразить -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { JunoProfileAPI } from '../../api/junoProfileAPI'
import { authSubscribe } from "@junobuild/core";
import type { User } from "@junobuild/core";
import type { Profile } from '../../types/entities'

// Профиль пользователя
const profile = ref<Profile | null>(null)
const hasRecord = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const junoProfileAPI = new JunoProfileAPI()

// Функция для получения профиля пользователя
const fetchUserProfile = async (user: User) => {
  try {
    const userProfile = await junoProfileAPI.fetchProfile(user.key)
    profile.value = userProfile
    authStore.principal = user.key
  } catch (error) {
    console.error('Failed to fetch profile:', error)
  }
}

const checkRecord = async () => {
  try {
    const record = await fetchUserRecord()
    hasRecord.value = !!record.activity
  } catch (error) {
    console.error('Error checking user record:', error)
  }
}

// Функция для получения записи пользователя
const fetchUserRecord = async () => {
  return { activity: authStore.activity }
}

// Обработчик выбора активности
const selectActivity = (activity: string) => {
  authStore.setActivity(activity)
  router.push('/')
}

// Подписка на изменения авторизации
const unsubscribe = authSubscribe((user: User | null) => {
  if (user) {
    fetchUserProfile(user)
    checkRecord()
  }
})

onMounted(() => {
  // Проверяем наличие записи при монтировании компонента
  checkRecord()
  // Очищаем подписку при размонтировании компонента
  return () => {
    unsubscribe()
  }
})
</script>

<style scoped>
.onboarding-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.onboarding-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  text-align: center;
  color: white;
}

.onboarding-form h1 {
  margin-bottom: 2rem;
  font-size: 2rem;
  color: #fff;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.onboarding-button {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  color: #fff;
  border-radius: 5px;
  transition:
    background 0.3s ease,
    color 0.3s ease;
}

.onboarding-button:hover {
  color: #fff;
}

.onboarding-button:active {
  transform: scale(0.98);
}
</style>
