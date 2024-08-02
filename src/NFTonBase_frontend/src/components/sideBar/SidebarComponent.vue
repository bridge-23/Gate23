<template>
  <q-drawer v-model="drawerOpen" show-if-above side="left" elevated :width="250" :breakpoint="840" class="bg-[#EBEBEB]">
    <div class="px-5 py-5 h-full">
      <div class="flex flex-col justify-between h-full">
        <!-- Main Sidebar Items -->
        <div>
          <q-item
            clickable
            v-ripple
            tag="a"
            href="/"
            class="sidebar-item"
          >
            <q-item-section avatar>
              <q-icon name="add_box" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Add Product</q-item-label>
            </q-item-section>
          </q-item>

          <q-item
            clickable
            v-ripple
            tag="a"
            href="/create-collection"
            class="sidebar-item"
          >
            <q-item-section avatar>
              <q-icon name="create_new_folder" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Create collection</q-item-label>
            </q-item-section>
          </q-item>

          <q-expansion-item label="Collections" icon="collections" class="custom-expansion-item">
            <q-item
              clickable
              v-ripple
              v-for="collection in collections"
              :key="collection.collection_name"
              tag="a"
              :href="`/collections/${collection.id}`"
              class="sidebar-sub-item"
            >
              <q-item-section avatar>
                <q-icon name="folder" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ collection.collection_name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-expansion-item>
        </div>

        <!-- Logout Item -->
        <SidebarItems v-bind="LogoutItem" v-if="isLogin" />
      </div>
    </div>
  </q-drawer>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import { useAuthStore } from '@/stores/auth'
import { useCollectionStore } from '@/stores/collection'
import { storeToRefs } from 'pinia'
import SidebarItems from './SidebarItems.vue'

const layoutStore = useLayoutStore()
const authStore = useAuthStore()
const collectionStore = useCollectionStore()

const { isLogin } = storeToRefs(authStore)
const { drawerOpen } = storeToRefs(layoutStore)
const { collections } = storeToRefs(collectionStore)

collectionStore.fetchCollections()

const barItems = [
  {
    name: 'Add product',
    route: '/'
  },
  {
    name: 'All products',
    route: '/all-nfts'
  }
]
const LogoutItem = {
  name: 'Logout',
  route: '/auth/login'
}
</script>

<style scoped>
.sidebar-item {
  background-color: transparent;
  color: #333;
  border-radius: 8px;
  margin-bottom: 5px;
  transition: background-color 0.3s ease;
}

.sidebar-item:hover{
  border-radius: 0px;
}

.sidebar-sub-item:hover {
  background-color: #c9c9c9;
}

.sidebar-sub-item {
  display: flex;
  align-items: center;
  background-color: transparent;
  color: #4f4d4d;
  padding-left: 40px;
}

.custom-expansion-item .q-item__label {
  color: #1e1b1b;
}

.custom-expansion-item {
  background-color: transparent;
  color: #333;
}

.custom-expansion-item .q-item__section--main {
  display: flex;
  justify-content: space-between;
}

.q-item-label {
  font-size: 1rem;
  text-align: left; /* Ensure label text aligns left */
}

.q-item-section {
  text-align: left; /* Default left alignment */
}

.q-icon {
  color: #888;
  margin-right: 8px; /* Add spacing if necessary */
}

.q-icon:hover {
  color: #444;
}
</style>
