<template>
  <button
    @click="onClick"
    class="px-5 py-2 my-2 text-lg text-[#1e1b1b] font-semibold rounded-lg cursor-pointer"
  >
    {{ name }}
  </button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { signOut } from '@junobuild/core'
const props = defineProps({
  name: {
    type: String
  },
  route: {
    type: String
  }
})

const authStore = useAuthStore()
const { setIsLogin } = authStore
const router = useRouter()
const onClick = () => {
  if (props.name == 'Logout') {
    signOut()
    setIsLogin(false)
  }
  router.push(`${props.route}`)
}
</script>
