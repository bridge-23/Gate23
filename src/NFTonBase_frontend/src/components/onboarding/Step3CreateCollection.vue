<template>
  <div class="container">
    <h1 style="font-weight: bold;">Create First Collection</h1>
    <div class="form-group">
      <label class="label" style="font-weight: bold;">Title (Name)</label>
      <input v-model="collectionTitle" placeholder="Collection Name" type="text" class="input" />
    </div>
    <div class="form-group">
      <label class="label" style="font-weight: bold;">Media</label>
      <div class="button-group">
        <button class="btn" @click="uploadNew">Upload new</button>
        <button class="btn" @click="addFromLink">Add from link</button>
      </div>
    </div>
    <div class="form-group">
      <label class="label" style="font-weight: bold;">Collection Chain </label>
      <select v-model="collectionType" class="select">
        <option value="BASE">BASE</option>
        <!-- Add other options as needed -->
      </select>
    </div>
    <div class="form-group">
      <label class="radio-label">
        <input type="radio" value="ERC1155" v-model="itemType" class="radio-input" />
        Regular items (ERC1155, send on demand)
      </label>
      <label class="radio-label">
        <input type="radio" value="ERC721" v-model="itemType" class="radio-input" />
        Gift Card (ERC721)
      </label>
    </div>
    <button class="btn-next" @click="finishSetup">Finish</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/stores/profile'
import { useCollectionStore } from '@/stores/collection'

const collectionTitle = ref('')
const collectionType = ref('BASE')
const itemType = ref('ERC1155')
const imageUrl = ref('')

const router = useRouter()
const profileStore = useProfileStore()
const collectionStore = useCollectionStore()

const finishSetup = async () => {
  if (!collectionTitle.value) {
    alert('Please fill in all fields.')
    return
  }
  collectionStore.setName(collectionTitle.value)
  collectionStore.setCollectionType(itemType.value)
  collectionStore.setImageUrl(imageUrl.value)
  profileStore.setOnboardingCompleted()

/*  console.log('Collection created:', collectionStore.collection)
  console.log('Profile:', profileStore.profile)*/

  try {
    await profileStore.saveProfileToDB()
    await collectionStore.saveCollectionToDB()
    console.log('Collection saved successfully');

    // Redirect after a successful save
    await router.push('/')
  } catch (error) {
    console.error('Error saving collection or profile:', error)
    alert('Failed to save collection or profile. Please try again.')
  }
}

const uploadNew = () => {}
const addFromLink = () => {}
</script>

<style scoped>

.container {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-align: center;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.form-group {
  margin: 20px 0; /* Optional: space around the form group */
  text-align: left; /* Ensure text is left-aligned */
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
  border-width: 1px;
  background: rgb(245, 245, 245);
}

.select {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border-width: 1px;
  background: rgb(245, 245, 245);
  margin-bottom: 10px;
}

.radio-label {
  display: flex;
  align-items: center; /* Aligns the radio input and text vertically */
  margin-bottom: 10px; /* Space between radio options */
}

.radio-input {
  margin-right: 8px; /* Space between radio button and label text */
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.btn,
.btn-next {
  background-color: #ffffff;
  color: #1e1d1d;
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 10px;
  width: 48%;
}

.btn:hover,
.btn:active,
.btn-next:active {
  transform: scale(0.98);
  border-color: black;
}

.btn-next {
  width: 100%;
  border: 2px solid transparent;
  font-weight: bold
}
.btn-next:hover {
  transform: scale(0.98);
  font-size: 1rem;
  border-color: black;
  font-weight: bold;
}
</style>
