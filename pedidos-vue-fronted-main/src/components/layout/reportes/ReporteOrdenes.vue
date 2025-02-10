<script setup>
import { ref, computed } from 'vue';
import User from '@/apis/User';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const startDate = ref('');
const endDate = ref('');
const orders = ref([]);
const isLoading = ref(false);
const users = ref([]);

// Obtener la fecha actual en formato YYYY-MM-DD
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Inicializar con la fecha actual
startDate.value = getCurrentDate();
endDate.value = getCurrentDate();

const fetchUsers = async () => {
  try {
    users.value = await User.fetchUsuarios();
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId);
  return user ? `${user.nombre} ${user.apellido}` : 'Usuario no encontrado';
};

const getUserPhone = (userId) => {
  const user = users.value.find(u => u.id === userId);
  return user ? user.celular : 'Celular no encontrado';
};

const fetchOrders = async () => {
  try {
    isLoading.value = true;
    const response = await fetch('http://localhost:8000/api/public/ordenes');
    const data = await response.json();
    orders.value = data.ordenes || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    isLoading.value = false;
  }
};

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const orderDate = new Date(order.fecha_entrega).toISOString().split('T')[0];
    return orderDate >= startDate.value && orderDate <= endDate.value;
  });
});

const generatePDF = () => {
  const doc = new jsPDF();

  // Configuración del documento
  doc.setFont('helvetica');
  
  // Título del reporte
  doc.setFontSize(20);
  doc.text('Reporte de Órdenes', 105, 15, { align: 'center' });
  
  // Información del período
  doc.setFontSize(12);
  doc.text(`Período: ${startDate.value} al ${endDate.value}`, 105, 25, { align: 'center' });
  
  // Fecha de generación
  const currentDate = new Date().toLocaleString();
  doc.setFontSize(10);
  doc.text(`Generado el: ${currentDate}`, 105, 30, { align: 'center' });

  // Estadísticas generales
  const totalOrders = filteredOrders.value.length;
  const totalAmount = filteredOrders.value.reduce((sum, order) => sum + parseFloat(order.monto_total), 0);
  const totalDiscount = filteredOrders.value.reduce((sum, order) => sum + parseFloat(order.descuento_total || 0), 0);
  
  doc.setFontSize(12);
  doc.text('Resumen:', 14, 40);
  doc.text(`Total de órdenes: ${totalOrders}`, 14, 47);
  doc.text(`Monto total: $${totalAmount.toFixed(2)}`, 14, 54);
  doc.text(`Descuento total: $${totalDiscount.toFixed(2)}`, 14, 61); // Nuevo campo

  // Tabla de órdenes
  const tableColumn = ['ID', 'Cliente', 'Estado', 'Monto', 'Descuento', 'Fecha Entrega', 'Estado Pago'];
  const tableRows = filteredOrders.value.map(order => [
    order.id,
    getUserName(order.usuario_id),
    order.estado,
    `$${order.monto_total}`,
    `$${order.descuento_total || 0}`, // Nuevo campo
    new Date(new Date(order.fecha_entrega).setDate(new Date(order.fecha_entrega).getDate() + 1)).toLocaleDateString('es-ES'),
    order.estado_pago
  ]);

  doc.autoTable({
    startY: 65,
    head: [tableColumn],
    body: tableRows,
    headStyles: {
      fillColor: [51, 122, 183],
      textColor: 255,
      fontSize: 10,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 65 }
  });

  // Detalles de productos por orden
  let yPos = doc.lastAutoTable.finalY + 20;

  filteredOrders.value.forEach(order => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(11);
    doc.text(
      `Detalles de la Orden #${order.id} - ${getUserName(order.usuario_id)} - Celular: ${getUserPhone(order.usuario_id)}`,
      14,
      yPos
    );
    yPos += 7;

    const detailsColumns = ['Producto', 'Color', 'Talla', 'Cantidad', 'Precio Base', 'Precio Unit.', 'Descuento Unit.', 'Subtotal'];
    const detailsRows = order.detalles_con_tallas_y_colores.map(detalle => [
      detalle.detalle_producto.producto.nombre,
      detalle.detalle_producto.color.nombre,
      detalle.detalle_producto.tallas.find(talla => talla.id === detalle.talla_id)?.nombre,
      detalle.cantidad,
      `$${detalle.precio_base}`, // Nuevo campo
      `$${detalle.precio_unitario}`,
      `$${detalle.descuento_unitario || 0}`, // Nuevo campo
      `$${detalle.subtotal}`
    ]);

    doc.autoTable({
      startY: yPos,
      head: [detailsColumns],
      body: detailsRows,
      headStyles: {
        fillColor: [70, 130, 180],
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 8
      },
      margin: { left: 14, right: 14 },
      theme: 'grid'
    });

    yPos = doc.lastAutoTable.finalY + 15;
  });

  // Guardar el PDF
  doc.save(`reporte-ordenes-${startDate.value}-${endDate.value}.pdf`);
};

// Cargar órdenes al montar el componente
fetchUsers();
fetchOrders();
</script>

<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-header bg-primary text-white">
        <h3 class="card-title mb-0">New Blessing Reporte de Ordenes</h3>
      </div>
      
      <div class="card-body">
        <div class="row mb-4">
          <div class="col-md-4">
            <div class="form-group">
              <label for="startDate">Fecha Inicial:</label>
              <input 
                type="date" 
                id="startDate" 
                v-model="startDate" 
                class="form-control"
              >
            </div>
          </div>
          
          <div class="col-md-4">
            <div class="form-group">
              <label for="endDate">Fecha Final:</label>
              <input 
                type="date" 
                id="endDate" 
                v-model="endDate" 
                class="form-control"
              >
            </div>
          </div>
          
          <div class="col-md-4 d-flex align-items-end">
            <button 
              @click="generatePDF" 
              class="btn btn-primary w-100"
              :disabled="isLoading || filteredOrders.length === 0"
            >
              <i class="material-icons align-middle me-1">picture_as_pdf</i>
              Generar Reporte PDF
            </button>
          </div>
        </div>

        <!-- Preview de órdenes filtradas -->
        <div class="preview-section">
          <h4>Vista Previa</h4>
          <div class="table-responsive">
            <table class="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Estado</th>
                  <th>Monto Total</th>
                  <th>Descuento Total</th> 
                  <th>Fecha Entrega</th>
                  <th>Estado Pago</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="isLoading">
                  <td colspan="5" class="text-center">Cargando órdenes...</td>
                </tr>
                <tr v-else-if="filteredOrders.length === 0">
                  <td colspan="5" class="text-center">No hay órdenes en el rango de fechas seleccionado</td>
                </tr>
                <tr v-for="order in filteredOrders" :key="order.id">
                  <td>#{{ order.id }}</td>
                  <td>{{ getUserName(order.usuario_id) }}</td>
                  <td>{{ order.estado }}</td>
                  <td>${{ order.monto_total }}</td>
                  <td>${{ order.descuento_total || 0 }}</td>
                  <!-- <td>{{ new Date(order.fecha_entrega).toLocaleDateString() }}</td> -->
                  <td>{{ new Date(new Date(order.fecha_entrega).setDate(new Date(order.fecha_entrega).getDate() + 1)).toLocaleDateString() }}</td>

                  <td>{{ order.estado_pago }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  margin-top: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.preview-section {
  margin-top: 2rem;
}

.material-icons {
  vertical-align: middle;
  font-size: 20px;
}

.form-group {
  margin-bottom: 1rem;
}

.btn i {
  margin-right: 0.5rem;
}
</style>