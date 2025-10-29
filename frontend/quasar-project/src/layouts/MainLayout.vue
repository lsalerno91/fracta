<!--
  MainLayout.vue
  ----------------
  This layout component defines the global structure of the application.
  It contains elements that are shared across all pages such as:
  - Header / Toolbar
  - Footer
  - Sidebar or navigation menu
  - Page container for rendering page-specific content via <router-view />
  All pages of the app will be rendered inside this layout.
-->

<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-transparent">
      <q-toolbar class="bg-primary glossy text-white flex-center">
        <q-btn 
          dense 
          flat 
          round 
          icon="menu" 
          @click="toggleLeftDrawer"
          v-show="currentPath !== '/preventivo'"
        />

        <q-toolbar-title class="title-font">
          <RouterLink to="/">
            <q-btn @click="() => {}">
              <img src="../assets/nasta-logo.png" height="35" />
            </q-btn>
          </RouterLink>
        </q-toolbar-title>

        <!-- Search Bar -->
        <q-input
          class="GPL__toolbar-input"
          dense
          standout="bg-primary"
          v-model="search" 
          placeholder="Cerca"
        >
          <template v-slot:prepend>
            <q-icon v-if="search === ''" name="search" />
            <q-icon
              v-else
              name="clear"
              class="cursor-pointer"
              @click="cleanSearch"
            />
          </template>
        </q-input>
        <!-- Ricerca Avanzata -->
        <div class="cursor-pointer">
          <q-spinner-audio color="cyan" size="2em" class="q-ml-md" />
          <q-tooltip
            class="bg-primary text-white"
            transition-show="rotate"
            transition-hide="rotate"
          >
            Ricerca Avanzata
          </q-tooltip>
        </div>
        <q-space />

        <!-- Preventivo -->
        <RouterLink to="/preventivo">
          <q-btn
            flat
            round
            dense
            icon="shopping_cart"
            color="white"
            class="q-mr-md"
          >
            <q-badge color="red" floating>{{ cartStore.totalItems }}</q-badge>
            <q-tooltip
              class="bg-primary text-white"
              transition-show="rotate"
              transition-hide="rotate"
            >
              Preventivo
            </q-tooltip>
          </q-btn>
        </RouterLink>
      </q-toolbar>
      <FiltersToolbar
        :categories="categoryNames"
        v-if="currentPath !== '/preventivo'"
      />
    </q-header>

    <q-drawer 
      v-model="leftDrawerOpen" 
      side="left" 
      elevated
      v-show="currentPath !== '/preventivo'"
    >
      <q-list>
        <q-item-label header>Categorie</q-item-label>

        <!-- Menu dinamico -->
        <q-item
          v-for="(item, index) in menuItems"
          :key="index"
          clickable
          @click.prevent="handleItemClick(item)"
          rel="noopener"
          href=""
        >
          <q-item-section avatar>
            <q-icon :name="getIcon(item.name)" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge rounded color="blue" :label="item.count" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="sass">
.GPL

  &__toolbar
    height: 64px

  &__toolbar-input
    width: 20%
    border-radius: 10px
    background-color: #ffffff
    ::placeholder
      color: black
    :focus::placeholder
      color: #68bbe3
</style>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '../stores/products'
import { useCartStore } from '../stores/cart'
import { useFiltersStore } from '../stores/filters'
import { icons } from '../utils/iconsPerCategory'
import FiltersToolbar from '../components/FiltersToolbar.vue'

// Component name (for debugging and devtools)
defineOptions({
  name: 'MainLayout'
});

// Stores
const productStore = useProductStore()
const cartStore = useCartStore()
const filtersStore = useFiltersStore()

// State
const leftDrawerOpen = ref(true) // initial drawer state
const search = ref('')
//const categoryNames = ref([])

// Router
const router = useRouter()
const route = useRoute()
const currentPath = computed(() => route.path)


// Generate menu items with product counts per category dinamically
const menuItems = computed(() => {
  return productStore.categories.map(cat => ({
    name: cat,
    count: productStore.countByCategory[cat] || 0
  }))
})

// Lista di nomi categorie per la toolbar dei filtri
const categoryNames = computed(() => productStore.categories)

// Carica prodotti e categorie al montaggio del componente
onMounted(async () => {
  try {
    await productStore.fetchProducts()     // Popola store.products
    await productStore.fetchCategories()   // Popola store.categories
    await productStore.countProductsPerCategory() 
  } catch (error) {
    // Gli errori sono già gestiti nei singoli metodi del store
    console.warn('Some API calls failed during initialization:', error)
  }
})

// Function to toggle the left drawer
function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Function to get the right icon for each category
function getIcon(category: string): string {
  return icons[category] || icons.default
}

// quando clicchi X per pulire la barra di ricerca, azzera il campo query nei filtri
function cleanSearch() {
  search.value = ''
  filtersStore.resetQuery()
}

function handleItemClick(item: { name: string; count: number }) {
  filtersStore.resetAll()
  filtersStore.setCategory([item.name])
  if (currentPath.value !== '/') {
    router.push({ path: '/' })
  }
}

// Sincronizza il search locale con lo store dei filtri
watch(search, (newQuery) => {
  filtersStore.setQuery(newQuery)
})

// Watch profondo sui filtri
watch(
  () => ({ ...filtersStore }), // osserva tutto lo stato dei filtri
  () => {
    productStore.fetchProducts(); // richiama i prodotti filtrati
  },
  { deep: true, immediate: true } // deep per oggetti/array, immediate per eseguire subito al montaggio
);

// Watch per chiudere il drawer nella pagina del preventivo
watch(currentPath, (newPath) => {
  if (newPath === '/preventivo') {
    leftDrawerOpen.value = false
  }
})

// Logs
console.log('Current path: ', currentPath)

</script>
