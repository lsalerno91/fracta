<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '../stores/cart';
import CartProducts from '../components/CartProducts.vue';
import QuoteForm from '../components/QuoteForm.vue';

// Define component name for debugging
defineOptions({
  name: 'QuotePage'
});

const cartStore = useCartStore();

// Typed ref for tab
const tab = ref<'Prodotti' | 'Altro' | 'Richiesta'>('Prodotti');
</script>

<style scoped>
.quote-page-container {
  display: flex;
  justify-content: center;
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
}

.quote-content {
  width: 100%;
}

.sticky-tabs {
  position: sticky;
  top: 0;
  z-index: 100;
  border-radius: 8px 8px 0 0;
}
</style>

<template>
  <q-page padding>
    <div class="quote-page-container">
      <div class="quote-content">
        <q-tabs
          v-model="tab"
          class="text-primary shadow-2 sticky-tabs bg-white"
          stretch
          align="justify"
        >
          <q-tab name="Prodotti" icon="store" label="Prodotti">
            <q-badge color="red" floating v-if="cartStore.quantity() > 0">
              {{ cartStore.quantity() }}
            </q-badge>
          </q-tab>
          <q-tab name="Altro" icon="description" label="Dettagli" />
          <q-tab 
            name="Richiesta" 
            icon="mail" 
            label="Invia Richiesta"
            :disable="cartStore.products.length === 0"
          />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="Prodotti" class="q-pa-md">
            <CartProducts />
          </q-tab-panel>
          
          <q-tab-panel name="Altro" class="q-pa-md">
            <div class="text-h6 q-mb-md">Riepilogo carrello</div>
            <div v-if="cartStore.products.length === 0" class="text-center q-pa-xl">
              <q-icon name="shopping_cart_outlined" size="3em" color="grey-5" />
              <div class="text-body1 text-grey-6 q-mt-md">Nessun prodotto nel carrello</div>
            </div>
            <div v-else>
              <q-list separator>
                <q-item v-for="product in cartStore.cart" :key="product._id">
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ product.name }}</q-item-label>
                    <q-item-label caption>
                      Codice: {{ product.code }} | Quantità: {{ product.quantity }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side v-if="product.price">
                    <q-item-label>{{ product.price }}€</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
              <q-separator class="q-my-md" />
              <div class="text-right">
                <div class="text-h6">Totale prodotti: {{ cartStore.quantity() }}</div>
              </div>
            </div>
          </q-tab-panel>
          
          <q-tab-panel name="Richiesta" class="q-pa-md">
            <QuoteForm />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </q-page>
</template>
