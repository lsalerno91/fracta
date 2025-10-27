<!--
  IndexPage.vue
  ----------------
  This page component defines the content of the home/index page.
  It is injected into the MainLayout via <router-view />.
  Responsibilities include:
  - Displaying a list of products or other page-specific content
  - Handling local UI interactions for this page
  - Fetching data from Pinia stores or API services for this page only
-->

<template>
  <q-page class="justify-start padding">
    <!-- Cards dei prodotti -->
    <div
      class="q-pa-md row items-start q-gutter-md"
      v-if="productStore.viewMode === 'card'"
    >
      <ProductCard
        v-for="(product, index) in productStore.products"
        :key="index"
        :product="product"
      />
    </div>

    <!-- Lista dei prodotti -->
    <div
      class="q-pa-md row items-start q-gutter-md"
      v-if="productStore.viewMode === 'list'"
    >
      <TableHeader v-if="productStore.products" />
    </div>

    <!-- Pagination -->
    <ProductPagination v-if="productStore.totalPages > 1" />

    <!-- Drawer del prodotto -->
    <ProductDrawer v-if="productStore.selectedProduct" />

    <!-- No Results -->
    <div class="fixed-center" v-if="!productStore.products">
      <img src="../assets/no-data.jpg" class="fit max-width" />
      <div class="text-h4 text-center title-font text-red-7">
        Ops... nessun prodotto disponibile
      </div>
    </div>
  </q-page>
</template>

<style lang="sass">
.bordered2
  border: 2px solid red
.bordered3
  border: 3px solid black

.row-variable-width
  .row
    background: rgba(#aa0, .1)
  .row > div
    padding: 10px 15px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  .row + .row
    margin-top: 1rem

.my-card
  width: 200px

.max-width
  max-width: 600px
</style>

<script setup lang="ts">
//import { ref } from 'vue';
//import { Todo, Meta } from 'components/models';
import { useProductStore } from '../stores/products';
import ProductCard from '../components/ProductCard.vue';
import ProductDrawer from '../components/ProductDrawer.vue';
//import TableHeader from "../components/ProductTable.vue";

defineOptions({
  name: 'IndexPage'
});

const productStore = useProductStore(); // Crea un'istanza del tuo store dei prodotti

</script>
