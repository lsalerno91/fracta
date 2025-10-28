<template>
  <div class="q-pa-lg flex flex-center">
    <q-pagination
      v-model="currentPage"
      :max="productStore.pagination.totalPages"
      :max-pages="3"
      direction-links
      boundary-links
      @update:model-value="onPageChange"
      color="primary"
      :disable="productStore.loading"
    />
  </div>
  
  <!-- Pagination controls 
  <div class="flex flex-center q-mb-md q-gutter-sm">
    <q-btn
      :disable="!productStore.pagination.hasPrev || productStore.loading"
      flat
      dense
      icon="first_page"
      @click="productStore.firstPage()"
      label="Prima"
      size="sm"
    />
    <q-btn
      :disable="!productStore.pagination.hasPrev || productStore.loading"
      flat
      dense
      icon="chevron_left"
      @click="productStore.prevPage()"
      label="Precedente"
      size="sm"
    />
    <q-btn
      :disable="!productStore.pagination.hasNext || productStore.loading"
      flat
      dense
      @click="productStore.nextPage()"
      label="Successiva"
      size="sm"
    >
      <q-icon name="chevron_right" right />
    </q-btn>
    <q-btn
      :disable="!productStore.pagination.hasNext || productStore.loading"
      flat
      dense
      @click="productStore.lastPage()"
      label="Ultima"
      size="sm"
    >
      <q-icon name="last_page" right />
    </q-btn>
  </div>
  -->
  
  <!-- Pagination info -->
  <div class="text-center q-mt-md text-grey-6">
    <div class="text-caption">
      Mostrando {{ startItem }} - {{ endItem }} di {{ productStore.pagination.totalCount }} prodotti
    </div>
    <div class="text-caption" v-if="productStore.pagination.totalPages > 1">
      Pagina {{ productStore.pagination.currentPage }} di {{ productStore.pagination.totalPages }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useProductStore } from '../stores/products'

const productStore = useProductStore()

// Reactive current page that syncs with store
const currentPage = ref(productStore.pagination.currentPage)

// Watch for changes in store pagination to update local currentPage
watch(
  () => productStore.pagination.currentPage,
  (newPage) => {
    currentPage.value = newPage
  }
)

// Computed properties for pagination info
const startItem = computed(() => {
  if (productStore.pagination.totalCount === 0) return 0
  return (productStore.pagination.currentPage - 1) * productStore.pagination.limit + 1
})

const endItem = computed(() => {
  const calculated = productStore.pagination.currentPage * productStore.pagination.limit
  return Math.min(calculated, productStore.pagination.totalCount)
})

// Handle page changes
const onPageChange = async (page: number) => {
  if (page !== productStore.pagination.currentPage) {
    await productStore.goToPage(page)
  }
}
</script>

<style scoped>
.q-pagination {
  gap: 4px;
}
</style>