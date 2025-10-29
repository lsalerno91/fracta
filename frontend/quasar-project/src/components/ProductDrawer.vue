<template>
  <q-drawer
    show-if-above
    overlay
    elevated
    v-model="rightDrawerOpen"
    side="right"
    v-if="productStore.selectedProduct"
    :width="drawerWidth"
  >
    <div class="q-pa-md">
      <div class="row">
        <div class="col-12">
          <q-card>
            <q-card-section position="relative">
              <!-- Title and badge -->
              <div class="row">
                <div class="text-h5 text-primary title-font q-mr-md">
                  {{ productStore.selectedProduct.name }}
                </div>
                <div>
                  <!-- Qui inserisci i tuoi badge -->
                  <div v-if="productStore.selectedProduct.tags">
                    <img
                      v-for="tag in productStore.selectedProduct.tags"
                      :key="tag"
                      :src="`/src/assets/icons/${tag}.png`"
                      alt=""
                      class="icon q-mr-sm"
                    />
                  </div>
                </div>
              </div>
              <div class="text-overline text-blue subtitle-font">
                {{ productStore.selectedProduct.brand }}
              </div>

              <!-- Pulsante di chiusura -->
              <q-btn
                icon="close"
                flat
                round
                dense
                @click="closeProductDrawer"
                class="absolute-top-right q-mt-sm q-mr-sm"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row q-pa-md">
        <div class="col-6 q-pa-md">
          <q-carousel
            animated
            v-model="slide"
            arrows
            navigation
            infinite
            control-color="blue"
          >
            <q-carousel-slide :name="1" class="column no-wrap">
              <div
                class="row fit justify-center items-center q-gutter-xs q-col-gutter no-wrap contain"
              >
                <!-- Immagini del prodotto -->
                <q-img
                  class="fit-image"
                  :src="productImageSrc"
                  @error="handleImageError"
                />
              </div>
            </q-carousel-slide>
          </q-carousel>
        </div>
        <div class="col-6">
          <!-- Codice del prodotto e categorie -->
          <p
            v-if="productStore.selectedProduct.code"
            class="text-grey paragraph-font"
          >
            <span class="text-blue">Codice: </span>
            {{ productStore.selectedProduct.code }}
          </p>
          <p class="text-grey paragraph-font">
            <span class="text-blue">Categorie: </span>
            {{ productStore.selectedProduct.category.join(", ") }}
          </p>
          <p class="paragraph-font">
            {{ productStore.selectedProduct.description }}
          </p>
        </div>
      </div>
      <div class="row q-pa-md">
        <div class="col-6 q-gutter-sm flex flex-center">
          <q-btn
            align="center"
            color="primary"
            label="Scheda tecnica"
            icon="cloud_download"
            @click="handleDownload(productStore.selectedProduct.name)"
          />
          <q-btn
            align="center"
            color="primary"
            label="Scheda di sicurezza"
            icon="cloud_download"
            @click="handleDownload(productStore.selectedProduct.name, 's')"
          />
        </div>
        <div class="col-6">
          <div class="col-6 q-gutter-sm flex flex-center">
            <q-btn
              align="center"
              :color="
                cartStore.isInCart(productStore.selectedProduct._id)
                  ? 'red'
                  : 'green'
              "
              :label="
                cartStore.isInCart(productStore.selectedProduct._id)
                  ? 'Rimuovi dal preventivo'
                  : 'Aggiungi al preventivo'
              "
              :icon="
                cartStore.isInCart(productStore.selectedProduct._id)
                  ? 'remove_shopping_cart'
                  : 'add_shopping_cart'
              "
              @click="handleCartClick"
            />
          </div>
        </div>
      </div>
    </div>
  </q-drawer>
</template>

<style>
.fit-image {
  object-fit: contain; /* L'immagine sarà ridimensionata per adattarsi al contenitore, mantenendo le proporzioni */
  max-width: 80%; /* Larghezza massima dell'immagine */
  height: auto; /* Altezza automatica in base alla larghezza */
}
</style>

<script setup>
import { ref, computed } from 'vue';
import { useProductStore } from '../stores/products';
import { useCartStore } from '../stores/cart';
import { useProductImage } from '../composables/useProductImage';
//import { handleDownload } from "../utils/functions.js";

const productStore = useProductStore();
const cartStore = useCartStore();

const rightDrawerOpen = ref(false);
const slide = ref(1);

// Image handling using composable
const { productImageSrc, handleImageError } = useProductImage(() => productStore.selectedProduct);

const closeProductDrawer = () => {
  rightDrawerOpen.value = false;
  productStore.clearSelection(); // Pulisci il prodotto selezionato
};

//console.log(productStore.selectedProductName)

// Calcola la larghezza del drawer come percentuale della larghezza dello schermo
const drawerWidth = computed(() => Math.min(window.innerWidth * 0.7, 1200));

// gestisce l'aggiunta/rimozione dal preventivo
const handleCartClick = () => {
  if (cartStore.isInCart(productStore.selectedProduct._id)) {
    cartStore.removeFromCart(productStore.selectedProduct._id);
  } else {
    cartStore.addToCart(productStore.selectedProduct);
  }
};
</script>
