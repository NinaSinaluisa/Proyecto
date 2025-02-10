<template>
    <div class="container">
      <!-- Información de la Empresa -->
      <div class="header">
        <h1 class="company-name">New Blessing</h1>
        <p class="company-info">Suministro y distribución de productos innovadores para toda la comunidad.</p>
      </div>
  
      <!-- Formulario para seleccionar el rango de fechas del reporte -->
      <div class="form-group">
        <label for="startDate">Fecha de inicio:</label>
        <input type="date" v-model="startDate" id="startDate" class="form-control">
      </div>
  
      <div class="form-group">
        <label for="endDate">Fecha de fin:</label>
        <input type="date" v-model="endDate" id="endDate" class="form-control">
      </div>
  
      <!-- Botón para cargar el reporte -->
      <div class="button-container">
        <button @click="loadData" class="btn btn-primary">Generar reporte</button>
      </div>
  
      <!-- Total de ingresos -->
      <div class="report-summary">
        <h3 class="total-ingresos">Total Ingresos: {{ formatCurrency(totalIngresos) }}</h3>
      </div>
  
      <!-- Tabla con los ingresos mensuales -->
      <div v-if="ingresosMensuales.length > 0" class="table-container">
        <table ref="reportTable" class="table">
          <thead>
            <tr>
              <th>Mes</th>
              <th>Ingresos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ingreso in ingresosMensuales" :key="ingreso.mes">
              <td>{{ formatMonth(ingreso.mes) }}</td> <!-- Mostrar mes como formato adecuado -->
              <td>{{ formatCurrency(ingreso.ingresos) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p class="no-data">No se encontraron ingresos en este periodo.</p>
      </div>
  
      <!-- Botón para exportar el reporte -->
      <div class="export-button">
        <button @click="exportToPDF" class="btn btn-success">Exportar a PDF</button>
      </div>
  
      <!-- Footer con información de la empresa -->
      <div class="footer">
        <p class="company-contact">Dirección: Calle Ficticia, 123, Ciudad</p>
        <p class="company-contact">Teléfono: (123) 456-7890</p>
        <p class="company-contact">Correo: contacto@newblessing.com</p>
        <p class="footer-note">¡Gracias por elegir New Blessing para sus soluciones innovadoras!</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import jsPDF from 'jspdf';
  import 'jspdf-autotable'; 
  import { format } from 'date-fns';

  
  // Variables para los ingresos
  const ingresosMensuales = ref([]);
  const totalIngresos = ref(0);
  const startDate = ref('');  // Fecha de inicio
  const endDate = ref('');    // Fecha de fin
  
  // Método para formatear valores numéricos a moneda
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };
  
  // Método para formatear el nombre del mes a su formato completo
  const formatMonth = (monthName) => {
    const months = {
      "January": "Enero",
      "February": "Febrero",
      "March": "Marzo",
      "April": "Abril",
      "May": "Mayo",
      "June": "Junio",
      "July": "Julio",
      "August": "Agosto",
      "September": "Septiembre",
      "October": "Octubre",
      "November": "Noviembre",
      "December": "Diciembre"
    };
  
    return months[monthName] || monthName;  // Si no hay un mes, devolvemos el nombre tal como está
  };
  
  // Cargar los datos al montar el componente
  const loadData = async () => {
    try {
      if (startDate.value && endDate.value) {
        const response = await axios.post('http://localhost:8000/api/reportes/ingresos-mensuales', {
          start_date: startDate.value,
          end_date: endDate.value
        });
        ingresosMensuales.value = response.data.ingresos_mensuales;
        totalIngresos.value = response.data.total_ingresos;
      } else {
        console.error("Por favor selecciona un rango de fechas válido.");
      }
    } catch (error) {
      console.error("Error al cargar los datos de ingresos:", error);
    }
  };
  
  // Función para exportar los datos a un archivo PDF
  const exportToPDF = () => {
  const doc = new jsPDF();
  const margin = 20;

  // Título principal con el nombre de la empresa
  doc.setFontSize(36);
  doc.setTextColor(44, 62, 80); // Color #2c3e50
  doc.text("New Blessing", margin, 30);

  // Información de la empresa (subtítulo)
  doc.setFontSize(18);
  doc.setTextColor(149, 165, 166); // Color #95a5a6
  doc.text("Dirección: Calle Ficticia, 123, Ciudad", margin, 40);
  doc.text("Teléfono: (123) 456-7890", margin, 50);
  doc.text("Correo: contacto@newblessing.com", margin, 60);

  // Fecha de reporte
  doc.setFontSize(12);
  doc.setTextColor(52, 73, 94); // Color #34495e
  doc.text(`Fecha de reporte: ${format(new Date(), 'dd/MM/yyyy')}`, margin, 70);

  // Encabezado del reporte
  doc.setFont('Helvetica', 'bold');  
  doc.setFontSize(14);
  doc.setTextColor(52, 152, 219); // Color #3498db
  doc.text("Reporte de Ingresos Mensuales", margin, 90);

  // Generación de la tabla de datos
  const ingresosData = ingresosMensuales.value.map(item => [item.mes, item.ingresos]);

  doc.autoTable({
    head: [['Mes', 'Ingresos']],
    body: ingresosData,
    startY: 100,
    theme: 'striped',  // Usamos el tema 'striped' para la tabla
    styles: {
      fontSize: 12,
      cellPadding: 5,
      valign: 'middle',
    },
    headStyles: {
      fillColor: [52, 152, 219], // Fondo del encabezado
      textColor: [255, 255, 255], // Color del texto (blanco)
      fontSize: 12,
      halign: 'center', // Alineación del texto en las celdas
    },
    columnStyles: {
      0: { cellWidth: 60 },  // Establecemos ancho fijo para la columna del mes
      1: { cellWidth: 60 },  // Establecemos ancho fijo para la columna de ingresos
    },
  });

  // Total de ingresos
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.setTextColor(39, 174, 96); // Color #27ae60 (verde)
  doc.text(`Total de Ingresos: ${totalIngresos.value}`, margin, finalY);

  // Footer de la empresa
  const footerY = finalY + 20;
  doc.setFontSize(10);
  doc.setTextColor(52, 73, 94); // Color #34495e
  doc.text("¡Gracias por elegir New Blessing!", margin, footerY);

  // Guardamos el archivo
  doc.save("reporte-ingresos.pdf");
};
  // Cargar los datos cuando el componente se monta
  onMounted(() => {
    loadData();
  });
  </script>
  
  <style scoped>
    .container {
      max-width: 1200px;
      margin: auto;
      padding: 20px;
      font-family: 'Arial', sans-serif;
    }
  
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
  
    .company-name {
      font-size: 36px;
      font-weight: bold;
      color: #2c3e50;
    }
  
    .company-info {
      font-size: 18px;
      color: #95a5a6;
      margin-top: 10px;
    }
  
    .form-group {
      margin-bottom: 20px;
    }
  
    label {
      font-size: 16px;
      font-weight: bold;
      color: #34495e;
    }
  
    input[type="date"] {
      width: 100%;
      padding: 8px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      font-size: 16px;
    }
  
    .button-container {
      text-align: center;
      margin-bottom: 30px;
    }
  
    .btn {
      background-color: #3498db;
      color: white;
      font-size: 16px;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }
  
    .btn:hover {
      background-color: #2980b9;
    }
  
    .report-summary {
      text-align: center;
      margin-bottom: 30px;
    }
  
    .total-ingresos {
      font-size: 20px;
      font-weight: bold;
      color: #27ae60;
    }
  
    .table-container {
      margin-top: 40px;
      background-color: #ecf0f1;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
    }
  
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
  
    th {
      background-color: #3498db;
      color: white;
    }
  
    td {
      font-size: 16px;
      color: #34495e;
    }
  
    .no-data {
      text-align: center;
      font-size: 18px;
      font-weight: bold;
      color: #e74c3c;
    }
  
    .footer {
      background-color: #f5f6f7;
      padding: 20px;
      text-align: center;
      margin-top: 50px;
      border-top: 2px solid #3498db;
      font-size: 14px;
      color: #34495e;
    }
  
    .footer p {
      margin: 5px 0;
    }
  
    .footer-note {
      font-weight: bold;
      color: #2980b9;
    }
  </style>
  