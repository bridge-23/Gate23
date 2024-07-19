import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore({
  id: 'layout',
  state: () => ({
    drawerOpen: true
  }),
  actions: {
      setDrawerOpen() {
          this.drawerOpen = !this.drawerOpen 
      }
  },
  persist: {
      enabled: true,
      strategies: [
          { 
              key: 'my_store',
              storage: localStorage
          }
      ]
  }
})