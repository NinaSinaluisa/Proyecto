<template>
    <div class="contact-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1>¡Estamos aquí para ayudarte!</h1>
          <p>Nos encantaría escucharte y responder todas tus preguntas</p>
        </div>
      </section>
  
      <div class="contact-container">
        <!-- Información de Contacto -->
        <section class="contact-info">
          <div class="info-card">
            <div class="icon-wrapper">
              <i class="fas fa-phone-alt"></i>
            </div>
            <h3>Llámanos</h3>
            <p>+51 123 456 789</p>
            <p>Lun - Vie: 9am - 6pm</p>
          </div>
  
          <div class="info-card">
            <div class="icon-wrapper">
              <i class="fas fa-envelope"></i>
            </div>
            <h3>Escríbenos</h3>
            <p>contacto@tuempresa.com</p>
            <p>Respuesta en 24 horas</p>
          </div>
  
          <div class="info-card">
            <div class="icon-wrapper">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <h3>Visítanos</h3>
            <p>Av. Principal 123</p>
            <p>Riobamba, Centro</p>
          </div>
        </section>
  
        <!-- Formulario y Mapa -->
        <div class="contact-content">
          <div class="form-section">
            <h2>Envíanos un mensaje</h2>
            <form @submit.prevent="handleSubmit" class="contact-form">
              <div class="form-group">
                <input 
                  v-model="formData.nombre" 
                  type="text" 
                  required 
                  placeholder="Nombre completo"
                >
              </div>
              <div class="form-group">
                <input 
                  v-model="formData.email" 
                  type="email" 
                  required 
                  placeholder="Correo electrónico"
                >
              </div>
              <div class="form-group">
                <input 
                  v-model="formData.telefono" 
                  type="tel" 
                  placeholder="Número de teléfono (opcional)"
                >
              </div>
              <div class="form-group">
                <select v-model="formData.asunto">
                  <option value="">Selecciona un asunto</option>
                  <option value="consulta">Consulta general</option>
                  <option value="soporte">Soporte técnico</option>
                  <option value="ventas">Ventas</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div class="form-group">
                <textarea 
                  v-model="formData.mensaje" 
                  required 
                  placeholder="¿En qué podemos ayudarte?"
                  rows="5"
                ></textarea>
              </div>
              <button type="submit" class="submit-btn">
                Enviar mensaje
                <i class="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
  
          <div class="map-section">
            <h2>Encuéntranos aquí</h2>
            <div class="map-container">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15952.347911915978!2d-78.6396509248127!3d-1.687983721829089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x91d3a9c9328fa937%3A0xa0a8dc4d5fe1914b!2sAv.%209%20de%20Octubre%2025%2C%20Riobamba%2C%20Ecuador!5e0!3m2!1sen!2sus!4v1737668623067!5m2!1sen!2sus" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  
 
  
  const formData = ref({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: ''
  });
  
  const handleSubmit = async () => {
    try {
     
      // Simularemos una espera
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
      
      // Limpiar formulario
      formData.value = {
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
      };
    } catch (error) {
      alert('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente.');
    }
  };
  </script>
  
  <style scoped>
  .contact-page {
    min-height: 100vh;
    background-color: #f8f9fa;
  }
  
  .hero-section {
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
        url('/logo.jpeg');
    background-size: cover;
    background-position: center;
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .hero-content h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .hero-content p {
    font-size: 1.2rem;
    max-width: 600px;
  }
  
  .contact-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
  }
  
  .contact-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .info-card {
    background: white;
    padding: 2rem;
    text-align: center;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .info-card:hover {
    transform: translateY(-5px);
  }
  
  .icon-wrapper {
    width: 60px;
    height: 60px;
    background: #007bff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }
  
  .icon-wrapper i {
    color: white;
    font-size: 1.5rem;
  }
  
  .contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    margin-bottom: 3rem;
  }
  
  .form-section, .map-section {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .contact-form .form-group {
    margin-bottom: 1.5rem;
  }
  
  .contact-form input,
  .contact-form select,
  .contact-form textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
  }
  
  .contact-form textarea {
    resize: vertical;
  }
  
  .submit-btn {
    background: #007bff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.3s ease;
  }
  
  .submit-btn:hover {
    background: #0056b3;
  }
  
  .map-container {
    height: 400px;
    margin-top: 1rem;
  }
  
  .map-container iframe {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }
  
  @media (max-width: 768px) {
    .contact-content {
      grid-template-columns: 1fr;
    }
    
    .hero-content h1 {
      font-size: 2rem;
    }
    
    .hero-section {
      height: 200px;
    }
  }
  </style>
  