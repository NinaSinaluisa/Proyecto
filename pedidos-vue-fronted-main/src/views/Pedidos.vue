<script setup>
import { ref, onMounted, computed } from 'vue';
import User from '@/apis/User';
import Api from '@/apis/Api';
import { IMAGE_BASE_URL } from '@/apis/Api';


const user = ref(null);
const orders = ref([]);
const estadoFilter = ref("");
const showModal = ref(false);
const selectedOrder = ref(null);


const loadUser = async () => {
  try {
    const response = await User.UsuarioActual();
    if (response) {
      user.value = response;
      await loadOrders(user.value.id);
    }
  } catch (error) {
    console.error('Error al cargar el usuario:', error);
  }
};

const loadOrders = async (userId) => {
  try {
    const response = await Api.get(`usuarios/${userId}/ordenes`);
    if (response.status === 200) {
      orders.value = response.data.ordenes;
    } else {
      console.log('No se pudieron cargar las órdenes.');
    }
  } catch (error) {
    console.error('Error al cargar órdenes:', error);
  }
};

const filteredOrders = computed(() => {
  if (!estadoFilter.value) {
    return orders.value;
  }
  return orders.value.filter(order => order.estado === estadoFilter.value);
});

const openModal = (order) => {
  selectedOrder.value = order;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  selectedOrder.value = null;
};

// const formatDate = (dateString) => {
//   if (!dateString) return '';
//   return new Date(dateString).toLocaleDateString('es-ES', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     timeZone: 'America/Guayaquil',
//   });
// };
const formatDate = (dateString) => {
  if (!dateString) return '';

  // Crear un objeto de fecha a partir de la cadena de fecha
  let date = new Date(dateString);

  // Sumar un día
  date.setDate(date.getDate() + 1);

  // Formatear la fecha con el ajuste de zona horaria adecuado
  return new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Guayaquil',  // Zona horaria explícita
  }).format(date);
};



const getUserName = (userId) => {
  return user.value?.id === userId ? `${user.value.nombre} ${user.value.apellido}` : 'Usuario';
};

const getColorName = (color) => {
  return color?.nombre || 'N/A';
};

const getTallaName = (tallaId, detalleProducto) => {
  const talla = detalleProducto?.tallas?.find(t => t.id === tallaId);
  return talla?.nombre || 'N/A';
};

const orderTotal = computed(() => {
  if (!selectedOrder.value?.detalles_con_tallas_y_colores) return 0;
  return selectedOrder.value.detalles_con_tallas_y_colores.reduce(
    (total, detalle) => total + parseFloat(detalle.subtotal),
    0
  );
});

const getStatusClass = (estado) => {
  const statusClasses = {
    Pagado: 'bg-success',
    Entregando: 'bg-primary',
    Atrasado: 'bg-danger',
  };
  return statusClasses[estado] || 'bg-secondary';
};

const getPaymentStatusClass = (estadoPago) => {
  const paymentStatusClasses = {
    'pendiente': 'bg-warning text-dark',
    'completado': 'bg-success',
    'fallido': 'bg-danger'
  };
  return paymentStatusClasses[estadoPago] || 'bg-secondary';
};
onMounted(() => {
  loadUser();
});
</script>

<template>
  <div class="container-fluid position-relative">
    <h2 class="mb-4 mt-4 margen">Mis Órdenes</h2>
    
    <!-- Cargando usuario -->
    <div v-if="!user" class="text-center my-3">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>

    <!-- Filtro de estado -->
  
    <div class="mb-3 margen">
      <label for="estadoFilter" class="form-label">Filtrar por Estado:</label>
      <select v-model="estadoFilter" class="form-select" id="estadoFilter">
        <option value="">Todos</option>
        <option value="pendiente">Pendiente</option>
        <option value="aprobada">Aprobada</option>
        <option value="rechazada">Rechazada</option>
        <option value="pagada">Pagada</option>
        <option value="entregada">Entregada</option>
      </select>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h4 class="modal-title">Detalle de la Orden #{{ selectedOrder?.id }}</h4>
            <button type="button" class="btn-close btn-close-white" @click="closeModal"></button>
          </div>

          <div class="modal-body">
            <!-- Order Summary -->
            <div class="order-summary mb-4">
              <h5 class="border-bottom pb-2">Información General</h5>
              <div class="info-grid row">
                <div class="col-md-6">
                  <p><strong>Cliente:</strong> {{ getUserName(selectedOrder?.usuario_id) }}</p>
                  <p><strong>Monto Total:</strong> ${{ selectedOrder?.monto_total }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Fecha de Entrega:</strong> {{ formatDate(selectedOrder?.fecha_entrega) }}</p>
                  <p><strong>Fecha de Creación:</strong> {{ formatDate(selectedOrder?.created_at) }}</p>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="order-items mb-4">
              <h5 class="border-bottom pb-2">Productos</h5>
              <div v-if="selectedOrder?.detalles_con_tallas_y_colores" class="table-responsive">
                <table class="table table-striped table-bordered table-sm">
                  <thead class="table-light">
                    <tr>
                      <th>Imagen</th>
                      <th>Color</th>
                      <th>Talla</th>
                      <th>Cantidad</th>
                      <th>Precio Unit.</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="detalle in selectedOrder.detalles_con_tallas_y_colores" :key="detalle.id">
                      <td>
                        <img 
                          :src="`${IMAGE_BASE_URL}/${detalle.detalle_producto.imagen_url}`" 
                          alt="Producto" 
                          class="product-thumbnail"
                        />
                      </td>
                      <td>{{ getColorName(detalle.detalle_producto.color) }}</td>
                      <td>{{ getTallaName(detalle.talla_id, detalle.detalle_producto) }}</td>
                      <td>{{ detalle.cantidad }}</td>
                      <td>${{ detalle.precio_unitario }}</td>
                      <td>${{ detalle.subtotal }}</td>
                    </tr>
                  </tbody>
                  <tfoot class="table-light">
                    <tr>
                      <td colspan="5" class="text-end"><strong>Total:</strong></td>
                      <td><strong>${{ selectedOrder?.monto_total }}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <!-- <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cerrar</button>
            <button type="button" class="btn btn-primary" @click="closeModal">Aceptar</button>
          </div> -->
        </div>
      </div>
    </div>

    <!-- Main Table -->
    <div class="table-responsive">
      <table class="table table-striped table-hover align-middle" v-if="orders.length > 0">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Monto Total</th>
            <th>Fecha Entrega</th>
            <th>Estado</th>
            <th>Estado Pago</th>
            <th>Fecha Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>#{{ order.id }}</td>
            <td>{{ user.nombre }} {{ user.apellido }}</td>
            <td>${{ order.monto_total }}</td>
            <td>{{ formatDate(order.fecha_entrega) }}</td>
            <td>
              <span :class="'badge ' + getStatusClass(order.estado)">
                {{ order.estado }}
              </span>
            </td>
            <td>
              <span :class="'badge ' + getPaymentStatusClass(order.estado_pago)">
                {{ order.estado_pago }}
              </span>
            </td>
            <td>{{ formatDate(order.created_at) }}</td>
            <td>
              <button class="btn btn-primary btn-sm" @click="openModal(order)">
                <i class="fas fa-eye me-1"></i> Ver Detalles
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else class="text-center text-muted">No tienes órdenes disponibles.</p>
    </div>
  </div>
</template>

<style scoped>
 .margen{
  margin-left: 2cm;
 }
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-container {
  width: 100%;
  max-width: 900px;
  max-height: 100vh;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.modal-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dee2e6;
}

.modal-body {
  padding: 1rem;
  overflow-y: auto;
}

.modal-footer {
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.product-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}

.info-grid {
  margin-bottom: 1rem;
}


.table-responsive {
  margin: 20px auto;
  max-width: 90%; 
  background-color: #fff; 
  border-radius: 10px; 
  overflow: hidden; 
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
}

/* Tabla */
.table {
  margin: 0;
  border-collapse: collapse;
  width: 100%; 
}

/* Encabezado */
.table thead {
  background-color: #1022a2; /* Azul oscuro */
  color: #fff; /* Color de texto blanco */
  text-transform: uppercase;
}

.table th {
  padding: 15px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
}

/* Filas */
.table tbody tr {
  border-bottom: 1px solid #ccc;
  transition: background-color 0.3s ease;
}

.table tbody tr:hover {
  background-color: #f9f9f9; /* Cambia color al pasar el ratón */
}

.table td {
  padding: 12px 15px;
  text-align: left;
  font-size: 14px;
}

/* Pies de tabla */
.table tfoot td {
  font-weight: bold;
  background-color: #f1f1f1;
}

/* Badges */
.badge {
  padding: 5px 10px;
  font-size: 12px;
  border-radius: 5px;
}

/* Botón de acción */
.btn-sm {
  font-size: 13px;
  padding: 8px 12px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn-sm:hover {
  background-color: #1022a2;
  color: #fff;
}

/* Texto centrado para cuando no hay órdenes */
.text-center {
  text-align: center;
  margin: 20px 0;
}

/* Ajustes para pantallas más pequeñas */
@media (max-width: 768px) {
  .table-responsive {
    max-width: 100%; /* Ocupará todo el ancho en pantallas pequeñas */
  }

  .table td, .table th {
    padding: 8px; /* Reducir espacios en pantallas pequeñas */
  }
}

</style>