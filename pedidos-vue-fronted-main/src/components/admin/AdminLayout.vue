<script setup>
import AdminSidebar from './BarraLateral.vue';
import { ref } from 'vue'

const isSidebarOpen = ref(true)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}


</script>

<template>
  <div class="d-flex">
    <AdminSidebar />
    <main class="flex-grow-1 bg-light min-vh-100 p-4">

      <RouterView />

    </main>
    
    
  </div>
  
</template>

<style scoped>
.sidebar {
  width: 250px;
  min-height: 100vh;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  transition: width 0.3s ease;
}

.sidebar-collapsed {
  width: 60px;
}

.nav-link:hover {
  background: rgba(255,255,255,0.1);
}

.transition-width {
  transition: width 0.3s ease;
}

.material-icons {
  vertical-align: middle;
}
</style>