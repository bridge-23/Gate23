<template>
  <q-drawer v-model="drawerOpen" show-if-above side="left" elevated :width="250" :breakpoint="840"
    class="bg-gradient-to-br from-[#141e30] to-[#243b55] -z-10">
    <div class="px-5 py-5 h-full">
      <div class="flex flex-col justify-between h-full">
        <div>
          <SidebarItems v-for="item in barItems" v-bind="item" :key="item.name" />
          <q-expansion-item icon="collections" label="Collections" expand-separator class="custom-expansion-item">
            <SidebarItems v-for="collection in collections" :key="collection.collection_name" :name="collection.collection_name" :route="`/collections/${collection.id}`" class="custom-sidebar-item" />
          </q-expansion-item>
        </div>
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
    name: 'Mint NFT',
    route: '/'
  },
  {
    name: 'All NFTs',
    route: '/all-nfts'
  }
]
const LogoutItem = {
  name: 'Logout',
  route: '/auth/login'
}
</script>

<style scoped>
.custom-expansion-item {
  background-color: #243b55;
  color: #ffffff;
  border-radius: 8px;
  margin-bottom: 10px;
  padding: 10px;
}

.custom-expansion-item .q-item__label {
  font-weight: bold;
  color: #ffffff;
}

.custom-expansion-item .q-item__section--main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-sidebar-item {
  background-color: #1e2a38;
  color: #ffffff;
  border-radius: 8px;
  margin: 5px 0;
  padding: 10px;
}

.custom-sidebar-item:hover {
  background-color: #17212b;
}
</style>
