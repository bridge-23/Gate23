<template>
    <p @click="onClick"  class="bg-[#ecebeb] hover:bg-[#cfcdcd] bg-opcacity-50 px-5 py-2 my-2 text-lg text-[#1976D2] font-semibold rounded-lg cursor-pointer">{{ name }}</p>
</template>
<script setup lang="ts" >
import {useRouter} from "vue-router";
import {useAuthStore} from '@/stores/auth';
const props = defineProps({
  name: {
    type: String,
  },
  route: {
    type: String,
  }
});

const authStore = useAuthStore();
const {setIsLogin} = authStore; 
const router = useRouter();
const onClick = () => {
  if( props.name == 'Logout' ){
    setIsLogin(false);
  }
  router.push(`${props.route}`);
}

</script>