
<script setup>
import Slider from '@/components/layout/Slider.vue';
import BarraFiltro from '@/components/layout/BarraFiltro.vue';
import ProductoGrid from '@/components/layout/ProductoGrid.vue';
</script>

<template>
  <Slider></Slider>
    <div class="main-content">
    <BarraFiltro></BarraFiltro>
    <ProductoGrid> </ProductoGrid>
        

    </div>
</template>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
}

.main-content {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    padding: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

@media (max-width: 768px) {
    .main-content {
        grid-template-columns: 1fr;
    }
}
</style>