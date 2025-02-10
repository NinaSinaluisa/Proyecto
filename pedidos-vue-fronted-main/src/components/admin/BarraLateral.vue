<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useRouter } from 'vue-router';
import User from '@/apis/User';
import { show_alerta } from '@/apis/Api';
import { useUserStore } from '@/stores/authstore';

const userStore = useUserStore(); // Accede al store de usuario
const router = useRouter();

const isDropdownOpen = ref({
  products: false,
});

const toggleDropdown = (key) => {
  isDropdownOpen.value[key] = !isDropdownOpen.value[key];
};

const logout = async () => {
  try {
    // Realizamos la petición al backend para cerrar sesión
    const response = await User.logout();

    // Verificamos la respuesta
    if (response.data) {
      // Eliminamos el token de la sesión
       localStorage.removeItem('auth');
      
      // // Actualizamos el estado de autenticación en el store de Pinia
       userStore.authenticated = false;
      userStore.token = null;
      userStore.user = null;

     

      // Redirigimos al usuario al Login
      router.push({ name: 'home' });

      // Mostramos el mensaje de éxito
      show_alerta('Cierre de sesión con éxito', 'success', '');
    }
  } catch (error) {
    // En caso de error mostramos una alerta
    show_alerta('Error al cerrar sesión', 'error', '');
    console.error('Error:', error);
  }
};




const isExpanded = ref(true);
const toggleSidebar = () => {
  isExpanded.value = !isExpanded.value;
};


</script>

<template>
  <aside :class="['sidebar bg-white shadow h-100 d-flex flex-column', { 'collapsed': !isExpanded }]">
    <div class="sidebar-header d-flex align-items-center justify-content-between p-4">
      <h1 class="fs-4 fw-semibold text-center mb-0" v-show="isExpanded">Panel de Administración</h1>
      <button @click="toggleSidebar" class="btn btn-link p-0" :class="{ 'ms-auto': isExpanded }">
        <span class="material-icons px-3 text-secondary">{{ isExpanded ? 'menu_open' : 'menu' }}</span>
      </button>
    </div>
    
    <nav class="mt-4 flex-grow-1">
      <ul class="nav flex-column vh-100 list-unstyled">
        <li class="nav-item">
          <RouterLink to="/admin" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">dashboard</span>
            <span v-show="isExpanded">Dashboard</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/admin/reportes" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">summarize</span>
            <span v-show="isExpanded">Reportes</span>
          </RouterLink>
        </li>
        <li class="nav-item">
        <!-- Opción principal: Productos -->
              <div class="nav-link d-flex align-items-center px-4 py-2 text-dark" @click="toggleDropdown('products')">
                <span class="material-icons me-3">shopping_bag</span>
                <span v-show="isExpanded">Productos</span>
                <span class="material-icons ms-auto" v-if="isDropdownOpen.products">expand_less</span>
                <span class="material-icons ms-auto" v-else>expand_more</span>
              </div>

        <!-- Submenú desplegable -->
            <ul v-if="isDropdownOpen.products" class="list-unstyled ps-4">
              <li class="nav-item">
                <RouterLink to="/admin/productobase" class="nav-link d-flex align-items-center py-2 text-dark">
                  <span class="material-icons me-2">layers</span>
                Base
                </RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/admin/productofinal" class="nav-link d-flex align-items-center py-2 text-dark">
                  <span class="material-icons me-2">check_circle</span>
                  Finales
                </RouterLink>
              </li>
            </ul>
       </li>
        <li class="nav-item">
          <RouterLink to="/admin/pedidosadmin" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">receipt_long</span>
            <span v-show="isExpanded">Pedidos</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/admin/descuentos" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons  me-3">savings</span>
            <span v-show="isExpanded">Descuentos</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/admin/categorias" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">category</span>
            <span v-show="isExpanded">Categorías</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/admin/tallas" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">checkroom</span>
            
            <span v-show="isExpanded">Tallas</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/admin/colores" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">palette</span>
            <span v-show="isExpanded">Colores</span>
          </RouterLink>
        </li>
        <!-- <li class="nav-item">
          <RouterLink to="/admin/products" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">shopping_bag</span>
            <span v-show="isExpanded">Productos</span>
          </RouterLink>
        </li> -->
      


        <li class="nav-item">
          <!-- <RouterLink to="/admin/notifications" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">notifications</span>
            <span v-show="isExpanded">Notificaciones</span>
          </RouterLink> -->
        </li>
        <!-- <li class="nav-item">
          <RouterLink to="/admin/payments" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">credit_card</span>
            <span v-show="isExpanded">Pagos</span>
          </RouterLink>
        </li> -->
        <li class="nav-item">
          <RouterLink to="/admin/usuarios" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">person</span>
            <span v-show="isExpanded">Usuarios</span>
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/admin/configuration" class="nav-link d-flex align-items-center px-4 py-2 text-dark">
            <span class="material-icons me-3">settings</span>
            <span v-show="isExpanded">Configuraciones</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <div class="p-4  ">
      <button @click.prevent="logout" class=" btn btn-light w-100 d-flex align-items-center justify-content-start px-4 py-2">
        <span class="material-icons me-3">logout</span>
        <span   v-show="isExpanded">Salir</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 280px;
  transition: width 0.3s ease;
}

.sidebar.collapsed {
  width: 80px;
}

.nav-link {
  transition: background-color 0.3s;
  white-space: nowrap;
  overflow: hidden;
}

.nav-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.nav-link.router-link-active {
  background-color: rgba(0, 0, 0, 0.08);
  font-weight: 500;
}

/* Ajustes para el modo colapsado */
.collapsed .material-icons {
  margin-right: 29px !important;
  
}

.collapsed .nav-link {
  padding-left: 28px !important;
  justify-content: center;
}

.collapsed .btn {
  padding-left: 28px !important;
  justify-content: center;
}

.collapsed .sidebar-header {
  justify-content: center !important;
}

ul.list-unstyled li a {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

ul.list-unstyled li span.material-icons {
  font-size: 1rem;
  color: #0a131b; /* Color gris estándar */
}


</style>
