<template>
  <q-card class="my-card">
    <q-card-section>
      <div
        class="q-mt-sm q-mb-xs text-weight-medium text-primary single-line cursor-pointer"
        @click="productStore.selectProduct(product)"
      >
        {{ product.name }}
      </div>
    </q-card-section>
    <q-card-section horizontal>
      <q-img
        class="col my-img cursor-pointer"
        :ratio="16 / 9"
        :src="product.image_url"
        @click="productStore.selectProduct(product)"
      />

      <q-card-actions vertical class="justify-around">
        <q-btn
          flat
          round
          color="primary"
          :icon="isFav ? 'remove_shopping_cart' : 'add_shopping_cart'"
          @click="handleCartClick()"
        />
        <q-btn flat round color="primary" icon="share" />
        <q-space />
        <q-btn
          color="primary"
          round
          flat
          dense
          :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expanded = !expanded"
        />
      </q-card-actions>
    </q-card-section>
    <q-card-section>
      <div class="text-overline text-blue-8">
        {{ product.brand ? product.brand : "-" }}
      </div>

      <div class="text-caption text-grey single-line">
        {{ product.category ? product.category.join(", ") : "" }}
        <q-tooltip anchor="top middle" self="bottom middle">
          {{ product.category ? product.category.join(", ") : "" }}
        </q-tooltip>
      </div>
    </q-card-section>
    <q-slide-transition>
      <div v-show="expanded">
        <q-separator />
        <q-card-section class="text-subtitle2">
          {{ product.description }}
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 200px

.single-line
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.my-img
  object-fit: contain
</style>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Product } from '../stores/products'
import { useProductStore } from '../stores/products'
import { useCartStore } from '../stores/cart'

// Stores
const productStore = useProductStore();
const cartStore = useCartStore();

// Props
const props = defineProps<{ product: Product }>()

// Local state
const expanded = ref(false);

// Computed: controlla se il prodotto è già nel carrello
const isFav = computed(() => cartStore.isInCart(props.product._id))
//const isFav = ref(cartStore.isInCart(props.product._id));

// watchEffect(() => {
//   isFav.value = cartStore.isInCart(props.product._id);
// });

// Functions
function handleCartClick() {
  if (cartStore.isInCart(props.product._id)) {
    cartStore.removeFromCart(props.product._id)
  } else {
    cartStore.addToCart(props.product)
  }
}
</script>