<template>
  <div class="container">
  <h3 class="text-center">Administración de Reportes </h3>
    
    <div class="navbar">
      <a 
        :class="['navbar-item', selectedReport === 'ordenes' ? 'active' : '']" 
        @click="selectedReport = 'ordenes'">
        Órdenes
      </a>
      <a 
        :class="['navbar-item', selectedReport === 'ingresos' ? 'active' : '']" 
        @click="selectedReport = 'ingresos'">
        Ingresos
      </a>
    </div>

    <!-- Componentes de reportes -->
    <div v-if="selectedReport === 'ordenes'">
      <OrdenesReport />
    </div>
    <div v-if="selectedReport === 'ingresos'">
      <IngresosReport />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import IngresosReport from '@/components/layout/reportes/ReporteIngresos.vue'; 
import OrdenesReport from '@/components/layout/reportes/ReporteOrdenes.vue'; 

// Estado para el reporte seleccionado
const selectedReport = ref('ordenes');
</script>

<style scoped>


.navbar {
  display: flex;
  justify-content: flex-start;
  gap: 20px;  /* Espacio entre los enlaces */
  margin-bottom: 20px;  /* Separar navbar del contenido */
}

.navbar-item {
  padding: 10px 25px;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  color: #444;
  background-color: #f4f4f9;  /* Fondo claro */
  border-radius: 25px;
  transition: all 0.3s ease;
  display: inline-block;
}

.navbar-item:hover {
  background-color: #347ca098; /* Color del fondo al pasar el ratón */
  color: white;
}

.navbar-item.active {
  background-color: #3798dac9; /* Color del fondo para el enlace activo */
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transform: scale(1.1);  /* Efecto visual cuando está activo */
}

.report {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
