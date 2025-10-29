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
    <!-- Server Error Display -->
    <ServerErrorDisplay
      v-if="productStore.shouldShowErrorDisplay"
      :error="productStore.error"
      :loading="productStore.loading"
      :show-technical-details="isDevelopment"
      @retry="handleRetry"
      @go-home="handleGoHome"
    />
    
    <!-- Normal content when no server errors -->
    <template v-else>
      <!-- Cards dei prodotti -->
      <div
        class="q-pa-md row items-start q-gutter-md"
        v-if="productStore.viewMode === 'card' && productStore.products.length > 0"
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
        v-if="productStore.viewMode === 'list' && productStore.products.length > 0"
      >
        <TableHeader />
      </div>

      <!-- Pagination -->
      <ProductPagination v-if="productStore.pagination.totalPages > 1" />

      <!-- Drawer del prodotto -->
      <ProductDrawer v-if="productStore.selectedProduct" />

      <!-- No Results (only show when no server error and no products) -->
      <div 
        class="fixed-center" 
        v-if="!productStore.loading && !productStore.error && productStore.products.length === 0"
      >
        <img src="../assets/no-data.jpg" class="fit max-width" />
        <div class="text-h4 text-center title-font text-red-7">
          Ops... nessun prodotto disponibile
        </div>
      </div>

      <!-- Client errors (non-server errors) -->
      <div 
        class="fixed-center" 
        v-if="productStore.error && productStore.error.type !== 'server' && productStore.error.type !== 'network'"
      >
        <q-banner class="bg-negative text-white">
          <template v-slot:avatar>
            <q-icon name="error" />
          </template>
          {{ productStore.error.message }}
          <template v-slot:action>
            <q-btn 
              flat 
              color="white" 
              label="Riprova" 
              @click="handleRetry"
              :loading="productStore.loading"
            />
          </template>
        </q-banner>
      </div>
    </template>
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
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProductStore } from '../stores/products';
import { useFiltersStore } from '../stores/filters';
import ProductCard from '../components/ProductCard.vue';
import ProductDrawer from '../components/ProductDrawer.vue';
import ProductPagination from '../components/ProductPagination.vue';
import ServerErrorDisplay from '../components/ServerErrorDisplay.vue';
import TableHeader from '../components/ProductTable.vue';

defineOptions({
  name: 'IndexPage'
});

const productStore = useProductStore();
const filtersStore = useFiltersStore();
const router = useRouter();

// Check if we're in development mode
const isDevelopment = computed(() => {
  return process.env.NODE_ENV === 'development'
});

// Handle retry action
const handleRetry = async () => {
  productStore.clearError();
  await productStore.fetchProducts();
  await productStore.fetchCategories();
  await productStore.countProductsPerCategory();
};

// Handle go home action
const handleGoHome = () => {
  productStore.clearError();
  filtersStore.resetAll();
  router.push('/');
};
</script>
