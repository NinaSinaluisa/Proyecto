<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavegacionVue from './components/Navegacion.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isAdminRoute = () => route.path.startsWith('/admin')

</script>

<template>
  <NavegacionVue   v-if="!isAdminRoute()"/>
  
  
  <RouterView />
</template>

<style scoped>

</style>
