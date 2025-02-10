<template>
    <div class="slider-wrapper">
      <!-- Contenedor de imágenes -->
      <div class="slider-container">
        <div class="slider">
          <div 
            v-for="(image, index) in images" 
            :key="index" 
            class="slide" 
            :style="{
              opacity: currentIndex === index ? 1 : 0,
              transition: 'opacity 1.5s ease-out',
            }">
            <img :src="image" alt="Slide" class="slide-image"/>
          </div>
        </div>
      </div>
  
      <!-- Contenedor de los botones fuera del slider -->
      <div class="buttons-container">
        <button @click="prevSlide" class="prev-btn">❮</button>
        <button @click="nextSlide" class="next-btn">❯</button>
      </div>
    </div>
  </template>
  
  <script>
  import { onMounted, ref } from 'vue';
  
  export default {
    setup() {
      const images = [
        'https://scontent.fatf2-1.fna.fbcdn.net/v/t39.30808-6/458396693_1034109468408718_2666466109178469465_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=fx--a6nR2LoQ7kNvgHechmI&_nc_zt=23&_nc_ht=scontent.fatf2-1.fna&_nc_gid=AF3dJmbhB6z3b_s0Wpv9KKI&oh=00_AYCjgteVZIVzYhnfEofUyFGk3kUI1EDeptsDGdGhhvwQIQ&oe=679DD3CB',
        'https://scontent.fuio6-3.fna.fbcdn.net/v/t1.6435-9/130557848_2793424360906312_483053812293563513_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeGUTewp25baNMbJhF4aNZIja5Uww3cMSclrlTDDdwxJyesNZX1nQ83ed8EJXutxlSdWAMAyvyF2zC3gohJcWwt5&_nc_ohc=6ffkdlB_2tQQ7kNvgGiRyXe&_nc_zt=23&_nc_ht=scontent.fuio6-3.fna&_nc_gid=ANVxfx99TIfMCWggDO9q5Pu&oh=00_AYDFr4Mmk8OX63KJMyJl3FmhhWGXolAwqC_9cZ8I3Iss7g&oe=67ACEBC7',
        'https://scontent.fatf2-1.fna.fbcdn.net/v/t39.30808-6/277742726_493588815794122_6984467798098462731_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=86c6b0&_nc_ohc=48BQifGdrwYQ7kNvgHRQFVm&_nc_zt=23&_nc_ht=scontent.fatf2-1.fna&_nc_gid=AGCTnotJ-DnsZOQOtksMZXx&oh=00_AYBwFfpwRI-9tOTjCSCryz2v6D_MSsgIJiw0o9TuPELL7w&oe=679DCEE8'
      ];
      const currentIndex = ref(0); // El índice actual de la imagen visible.
  
      // Función para ir a la imagen siguiente
      const nextSlide = () => {
        currentIndex.value = (currentIndex.value + 1) % images.length;
      };
  
      // Función para ir a la imagen anterior
      const prevSlide = () => {
        currentIndex.value = (currentIndex.value - 1 + images.length) % images.length;
      };
  
      // Cambio automático de imagen segundos
      onMounted(() => {
        setInterval(nextSlide, 8000);
      });
  
      return {
        images,
        currentIndex,
        nextSlide,
        prevSlide,
      };
    },
  };
  </script>
  
  <style scoped>
.slider-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 400px; /* Ajusta la altura de la imagen según sea necesario */
}

.slider-container {
  position: relative;
  overflow: hidden;
  width: calc(100% - 6cm); /* El contenedor solo ocupa el ancho disponible, dejando 3cm a la izquierda y derecha */
  height: 100%;
  margin: 0 3cm; /* Márgenes izquierdo y derecho de 3cm para el espacio de los botones */
}

.slider {
  display: flex;
  transition: transform 90s ease-in-out; /* Transición de 90 segundos (1.5 minutos) */
}

.slide {
  min-width: 100%;
  height: 100%;
  position: absolute; /* Las imágenes estarán apiladas */
  transition: opacity 90s ease-in-out; /* Transición de 90 segundos para la opacidad */
  opacity: 0;
}

.slide:nth-child(1) {
  opacity: 1; /* Solo la primera imagen está visible */
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Asegura que la imagen no se deforme */
}



  /* Contenedor de botones, fuera del área de las imágenes */
  .buttons-container {
    position: absolute;
    width: 100%; /* El contenedor abarca todo el ancho */
    display: flex;
    justify-content: space-between; /* Alineación horizontal de los botones */
    top: 50%;
    transform: translateY(-50%);
    z-index: 10; /* Asegura que los botones estén por encima de las imágenes */
  }
  
  button {
    background-color: rgba(255, 255, 255, 0.712);
    color: #d8b621;
    border: none;
    font-size: 2rem;
    cursor: pointer;
    padding: 10px;
    z-index: 10;
  }
  
  .prev-btn {
    position: absolute;
    left: 55px;
  }
  
  .next-btn {
    position: absolute;
    right: 55px;
  }
  </style>
  