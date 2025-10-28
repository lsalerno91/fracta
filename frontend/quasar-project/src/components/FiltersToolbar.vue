<script lang='ts' setup>
import { ref, watch, onMounted } from 'vue'
import axios from 'axios'
import CustomSelect from './CustomSelect.vue'
import { apiUrls } from '../utils/apiUrls'
import { saveAs } from 'file-saver'
import { useFiltersStore } from '../stores/filters'
import { useProductStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import type { Product } from '../stores/products'

// --- Store ---
const productStore = useProductStore()
const filtersStore = useFiltersStore()
const cartStore = useCartStore()

// --- Stato locale ---
const brands = ref<string[]>([])
const prodCods = ref<string[]>([])

// --- Props ---
const props = defineProps<{
  categories: string[]
}>()

// --- Funzione per scaricare CSV ---
function downloadCSV(): void {
  if (!productStore.products || productStore.products.length === 0) return

  let csvContent = 'Prodotto,Brand,Codice,Categoria,Formati\n'

  productStore.products.forEach((product: Product) => {
    csvContent += `${product.name || ''},${product.brand || ''},${product.code || ''},${product.category?.join('; ') || ''},-\n`
  })

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, 'products.csv')
}

// --- Fetch brand list ---
async function fetchBrands(): Promise<void> {
  try {
    const response = await axios.get<string[]>(apiUrls.listBrands)
    brands.value = response.data
  } catch (error) {
    console.error('Errore nel caricamento brand:', error)
  }
}

// --- Fetch codici prodotto ---
async function fetchCods(): Promise<void> {
  try {
    const response = await axios.get<string[]>(apiUrls.listCods)
    prodCods.value = response.data
  } catch (error) {
    console.error('Errore nel caricamento codici:', error)
  }
}

// --- Aggiunge i prodotti selezionati al preventivo ---
function addToCart(): void {
  if (!cartStore?.selectedProducts?.length) return
  cartStore.selectedProducts.forEach((product: Product) => {
    cartStore.addToCart(product)
  })
}

// --- Watch sui filtri (deep) ---
watch(
  filtersStore,
  () => {
    productStore.fetchProducts()
  },
  { deep: true }
)

// --- Lifecycle hooks ---
onMounted(() => {
  fetchBrands()
  fetchCods()
})
</script>

<template>
  <q-toolbar class='my-toolbar'>
    <!-- Filtri -->
    <CustomSelect :items='props.categories' label='Categoria' />
    <CustomSelect :items='brands' label='Brand' />
    <CustomSelect :items='prodCods' label='Codice' class='q-mr-md' />

    <!-- Aggiungi al preventivo -->
    <q-btn
      flat
      round
      dense
      icon='add'
      color='primary'
      @click='addToCart'
      class='q-mr-md'
      :disabled='!cartStore?.selectedProducts?.length'
    >
      <q-tooltip class='bg-primary text-white' transition-show='rotate' transition-hide='rotate'>
        Aggiungi al preventivo
      </q-tooltip>
    </q-btn>

    <!-- Download CSV -->
    <q-btn
      flat
      round
      dense
      icon='download'
      color='primary'
      @click='downloadCSV'
      :disabled='!productStore.products?.length'
      class='q-mr-md'
    >
      <q-tooltip class='bg-primary text-white' transition-show='rotate' transition-hide='rotate'>
        Download CSV
      </q-tooltip>
    </q-btn>

    <!-- Switch view -->
    <q-spinner-dots
      v-if='productStore.viewMode === "card"'
      color='primary'
      size='2em'
      @click='productStore.viewMode = "list"'
      class='cursor-pointer q-mr-md'
    />
    <q-spinner-grid
      v-else
      color='primary'
      size='2em'
      @click='productStore.viewMode = "card"'
      class='cursor-pointer q-mr-md'
    />
  </q-toolbar>
</template>

<style lang='sass'>
.my-toolbar
  height: 50px
  display: flex
  justify-content: flex-end
  background-color: white
  color: #050a30
</style>
