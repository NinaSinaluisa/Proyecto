<template>
   <main class="product-section">
    <div class="product-header">
        <span><i class=""></i> 64 resultados para ropa</span>
        <select class="sort-select">
            <option>Popular</option>
            <option>Precio: Menor a Mayor</option>
            <option>Precio: Mayor a Menor</option>
        </select>
    </div>

    <div class="products-grid">
    <!-- Product Card -->
    <div
      v-for="category in categoriesWithImages"
      :key="category.id"
      class="product-card"
    >
      <div class="product-image-wrap">
        <img
          :src="category.imagenUrl"
          alt="Imagen del producto"
          class="product-image"
        />
        <button class="wishlist-btn">
          <span class="material-icons">favorite_border</span>
        </button>
      </div>
      <div class="product-info">
        <h3>{{ category.nombre }}</h3>
        <p class="price">
           <router-link 
                :to="{ 
                    name: 'DetalleProducto', 
                    params: { id: category.id } 
                }"
               
                >
                <span class="material-icons">local_shipping</span>
                Realizar Pedido
            </router-link>
        </p>
      </div>
    </div>
  </div>
</main>

  </template>
  
  <script setup>
import { ref, onMounted, computed } from "vue";
import Producto from "@/apis/Productos";
import { PublicApi } from "@/apis/Api";
import { IMAGE_BASE_URL } from "@/apis/Api";

const categories = ref([]);
const productosConImagenes = ref([]);

// Obtener las categorías
const fetchCategories = async () => {
  try {
    const data = await Producto.fetchCategoriesPublica();
    categories.value = data; // Asignar categorías obtenidas
  } catch (error) {
    console.error("Error al obtener categorías públicas:", error);
  }
};

// Obtener productos con imágenes
const fetchProductosConImagenes = async () => {
  try {
    const response = await PublicApi.get('/variante-productos');
    productosConImagenes.value = response.data.data; // Asignar datos obtenidos
  } catch (error) {
    console.error("Error al obtener productos con imágenes:", error);
  }
};

// Combinar categorías con imágenes
const categoriesWithImages = computed(() =>
  categories.value
    .map((category) => {
      const productos = productosConImagenes.value.find(
        (producto) => producto.categoria_id === category.id
      )?.productos;

      const primeraVariante = productos?.flatMap((producto) =>
        producto.variantes
      ).find((variante) => variante.imagen_url);

      if (primeraVariante) {
        const imagenUrl = `${IMAGE_BASE_URL}/${primeraVariante.imagen_url}`;
        // const imagenUrl = `http://localhost:8000/storage/${primeraVariante.imagen_url}`;
        console.log(`Imagen para la categoría "${category.nombre}": ${imagenUrl}`);
        return {
          id: category.id,
          nombre: category.nombre,
          imagenUrl,
        };
      }

      console.log(`No hay imagen para la categoría "${category.nombre}"`);
      return null;
    })
    .filter(Boolean) // Eliminar categorías sin imagen
);

onMounted(async () => {
  await fetchCategories(); // Obtener categorías
  await fetchProductosConImagenes(); // Obtener imágenes
});
</script>

<style scoped>

.product-section {
    width: 100%;
    padding: 0 15px;
}

.product-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.sort-select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
}

.product-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: box-shadow 0.3s ease;
    width: 100%;
}

.product-card:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transform: translateY(-2px);
    transition: all 0.3s ease;
}

.product-image-wrap {
    position: relative;
    width: 100%;
    height: 447px;
    overflow: hidden;
}

.product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-card:hover .product-image {
    transform: scale(1.05);
}

.wishlist-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.3s ease;
}

.wishlist-btn:hover {
    background: #fc0137;
    transform: scale(1.1);
}

.product-info {
    padding: 1rem;
}

.product-info h3 {
    margin-bottom: 0.5rem;
    font-size: 1rem;
    color: #333;
}

.price {
    color: #0066cc;
    font-weight: bold;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

@media (max-width: 1200px) {
    .products-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 992px) {
    .products-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 576px) {
    .products-grid {
        grid-template-columns: 1fr;
    }
    
    .product-section {
        padding: 0 10px;
    }
    
    .product-header {
        flex-direction: column;
        gap: 1rem;
    }
}
</style>
  