import axios from 'axios';
import Swal from 'sweetalert2'
import { nextTick } from '@vue/runtime-core';


const Api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Configurar la baseURL para las imágenes públicas (accesibles sin autenticación)
export const ImagesApi = axios.create({
  baseURL: 'http://localhost:8000/storage', // Ruta pública para las imágenes
  withCredentials: false, // No necesita credenciales
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Configurar la baseURL para las rutas públicas (sin necesidad de autenticación)
export const PublicApi = axios.create({
  baseURL: 'http://localhost:8000/api/public', // Rutas públicas sin autenticación
  withCredentials: false, // No necesita credenciales
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Configuración centralizada
export const IMAGE_BASE_URL = 'http://localhost:8000/storage';


export function show_alerta(msj,icon, focus){
    if(focus!==''){
        nextTick(()=> focus.value.focus()); 
    }
    Swal.fire({
        title:msj, 
        icon:icon,
        buttonsStyling:true
    });
}




export default Api;

