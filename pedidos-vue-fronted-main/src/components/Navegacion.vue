

<!-- <script setup>
import User from '../apis/User';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import {show_alerta} from '../apis/Api';
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
userStore.checkAuth()  // Revisa si el usuario está autenticado
const router = useRouter();


const logout = async () => {
  try {
    // Realizamos la petición al backend para cerrar sesión
    const response = await User.logout();
    
    // Verificamos la respuesta
    if (response.data) {
      // Eliminamos el token de la sesión
      localStorage.removeItem('auth');
      
      // Redirigimos al usuario al Login
      router.push({ name: 'Login' });

      // Mostramos el mensaje de éxito
      show_alerta('Cierre de sesión con éxito', 'success', '');
    }
  } catch (error) {
    // En caso de error mostramos un alerta
    show_alerta('Error al cerrar sesión', 'error', '');
    console.error('Error:', error);
  }
};
</script> -->
<script setup>
import User from '../apis/User';
import { useRouter } from 'vue-router';
import { show_alerta } from '../apis/Api';
import { useUserStore } from '@/stores/authstore';
import { useCartStore } from '@/stores/cartStore';

const userStore = useUserStore(); // Accede al store de usuario
const cartStore = useCartStore();
const router = useRouter();


 const logout = async () => {
  try {
    // Realizamos la petición al backend para cerrar sesión
    const response = await User.logout();

    // Verificamos la respuesta
    if (response.data) {
      // Eliminamos el token de la sesión
      cartStore.clearCart();
       localStorage.removeItem('auth');
      
      // // Actualizamos el estado de autenticación en el store de Pinia
      userStore.authenticated = false;
      userStore.token = null;
      userStore.user = null;
      cartStore.clearCart(); 
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



import NotificationComponent from '@/components/layout/Noiticacion/Notificacion.vue';

</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
    <div class="container-fluid px-4">
      <!-- Logo y enlaces principales -->
      <div class="d-flex align-items-center">
        <router-link to="/" class="navbar-brand d-flex align-items-center me-4">
          <img src="/logo.jpeg" height="50" alt="Logo" class="logo-image" />
          <span class="brand-name ms-3">New Blessings</span>
        </router-link>
        
        <!-- Enlaces principales -->
        <div class="main-links d-none d-lg-flex">
          <router-link :to="{ name: 'Pedidos' }" v-if="userStore.authenticated" class="nav-link">Mis Pedidos</router-link>
          <router-link :to="{ name: 'Nosotros' }" class="nav-link">Nosotros</router-link>
          <router-link :to="{ name: 'Contactos' }" class="nav-link">Contáctanos</router-link>
        </div>
      </div>

      <!-- Botón hamburguesa para móvil -->
      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Contenido del navbar -->
      <div class="collapse navbar-collapse" id="navbarContent">
        <!-- Enlaces para móvil -->
        <div class="d-lg-none mobile-links">
          <router-link :to="{ name: 'Pedidos' }" v-if="userStore.authenticated" class="nav-link">Mis Pedidos</router-link>
          <router-link :to="{ name: 'Nosotros' }" class="nav-link">Nosotros</router-link>
          <router-link :to="{ name: 'Contactos' }" class="nav-link">Contáctanos</router-link>
        </div>
    

        <!-- Sección derecha: Carrito y Usuario -->
          <div class="ms-lg-auto d-flex align-items-center user-section " >
            
            <NotificationComponent v-if="userStore.authenticated" />
  
          <!-- Carrito -->
          <div v-if="userStore.authenticated" class="cart-section me-3">
            <router-link :to="{ name: 'Carrito' }" class="cart-link">
              <span class="material-icons cart-icon">shopping_cart</span>
              <span v-if="cartStore.cartItemsCount > 0" class="cart-badge">
                {{ cartStore.cartItemsCount }}
              </span>
            </router-link>
          </div>
          
          <!-- Separador vertical -->
          <div v-if="userStore.authenticated" class="vertical-divider "></div>
         
          <!-- Sección de autenticación -->
          <div v-if="!userStore.authenticated" class="auth-section">
            <router-link :to="{ name: 'Login' }" class="login-button">
              <span class="material-icons">login</span>
              <span>Iniciar sesión</span>
            </router-link>
          </div>

          <!-- Dropdown de usuario autenticado -->
          <div class="dropdown " v-if="userStore.authenticated">
            <button class="user-dropdown-btn" 
                    type="button" 
                    id="userDropdown" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false">
                    <span class="material-icons">face_6</span>
              <span class="username">{{ userStore.user.nombre }}</span>
              <span class="material-icons">expand_more</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end custom-dropdown" aria-labelledby="userDropdown">
              <li>
                <router-link class="dropdown-item" :to="{ name: 'home' }">
                  <span class="material-icons">person</span>
                  <span>Mi Perfil</span>
                </router-link>
              </li>
              <li>
                <router-link class="dropdown-item" :to="{ name: 'Pedidos' }">
                  <span class="material-icons">shopping_bag</span>
                  <span>Mis Pedidos</span>
                </router-link>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <a href="#" @click.prevent="logout" class="dropdown-item text-danger">
                  <span class="material-icons">logout</span>
                  <span>Cerrar Sesión</span>
                </a>
              </li>
            </ul>
          </div>
          
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.container-fluid {
  max-width: 1400px;
}

.brand-name {
  color: #2c3e50;
  font-size: 1.5rem;
  font-weight: 600;
  text-decoration: none;
}

.main-links {
  display: flex;
  gap: 2rem;
  margin-left: 2rem;
}

.nav-link {
  color: #2c3e50;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #3498db;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.cart-section {
  position: relative;
}

.cart-link {
  text-decoration: none;
  color: #2c3e50;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.cart-link:hover {
  background-color: #f8f9fa;
}

.cart-icon {
  font-size: 1.5rem;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 0.25rem;
  font-size: 0.75rem;
  min-width: 1.25rem;
  height: 1.08rem;
  display: flex;
  align-items: center;
  justify-content: center;
}


.vertical-divider {
  width: 1px;
  height: 24px;
  background-color: #e0e0e0;
}

.login-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: background-color 0.3s ease;
  font-weight: 500;
}

.login-button:hover {
  background-color: #f8f9fa;
}

.user-dropdown-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  color: #2c3e50;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}

.user-dropdown-btn:hover {
  background-color: #f8f9fa;
}

.username {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.custom-dropdown {
  margin-top: 0.5rem;
  border: none;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-radius: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #2c3e50;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

.dropdown-item .material-icons {
  font-size: 1.25rem;
}

/* Estilos móviles */
@media (max-width: 991.98px) {
  .mobile-links {
    padding: 1rem 0;
  }

  .mobile-links .nav-link {
    padding: 0.5rem 0;
    margin: 0.25rem 0;
  }

  .user-section {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e0e0e0;
  }
}
</style>
