import { defineStore } from 'pinia'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    isLogin: "",
    principal: "",
    ethAddress: "",
  }),
  actions: {
      setIsLogin(value) {
          this.isLogin = value 
      },
      setPrincipal(value) {
          this.principal = value 
      },
      setAddress(value) {
          this.ethAddress = value 
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