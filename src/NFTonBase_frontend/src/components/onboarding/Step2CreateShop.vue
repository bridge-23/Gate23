<template>
  <div class="container">
    <div class="header">Create Shop</div>
    <div class="form-group">
      <label class="label">Title (Name)</label>
      <input v-model="shopTitle" type="text" class="input" />
    </div>
    <div class="form-group">
      <label class="label">Address</label>
      <input v-model="shopAddress" type="text" class="input" />
    </div>
    <div class="form-group">
      <label class="label">Media</label>
      <div class="button-group">
        <button class="btn" @click="uploadNew">Upload new</button>
        <button class="btn" @click="addFromLink">Add from link</button>
      </div>
    </div>
    <button class="btn-next" @click="nextStep">Next</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profile'

const shopTitle = ref('')
const shopAddress = ref('')

const router = useRouter()
const profileStore = useProfileStore()

const nextStep = () => {
  if (!shopTitle.value || !shopAddress.value) {
    alert('Please fill in all fields.')
    return
  }
  profileStore.setShopDetails(shopTitle.value, shopAddress.value)
  router.push('/create-collection')
}

const uploadNew = () => {
  // Реализуйте логику загрузки нового медиа
}

const addFromLink = () => {
  // Реализуйте логику добавления медиа по ссылке
}
</script>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: bold;
}

.form-group {
  margin-bottom: 15px;
}

.label {
  display: block;
  margin-bottom: 5px;
  font-size: 1rem;
}

.input {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.btn,
.btn-next {
  margin-top: 10px;
  width: 48%;
}

.btn-next {
  width: 100%;
}
</style>
