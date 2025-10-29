<template>
  <div class="cart-products">
    <div v-if="cartStore.products.length === 0" class="text-center q-pa-xl">
      <q-icon name="shopping_cart_outlined" size="4em" color="grey-5" />
      <div class="text-h6 text-grey-6 q-mt-md">Il tuo carrello è vuoto</div>
      <div class="text-caption text-grey-5">Aggiungi alcuni prodotti per iniziare</div>
    </div>

    <div v-else>
      <div class="text-h6 q-mb-md">
        Prodotti nel carrello ({{ cartStore.quantity() }})
      </div>
      
      <q-list separator>
        <q-item
          v-for="product in cartStore.cart"
          :key="product._id"
          class="q-pa-md"
        >
          <q-item-section avatar>
            <q-avatar size="60px" square>
              <img 
                v-if="product.image_url" 
                :src="product.image_url" 
                :alt="product.name"
                style="object-fit: cover;"
              />
              <q-icon v-else name="inventory_2" size="30px" color="grey-5" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold">{{ product.name }}</q-item-label>
            <q-item-label caption>
              <div class="text-grey-7">Codice: {{ product.code }}</div>
              <div class="text-grey-7" v-if="product.brand">Brand: {{ product.brand }}</div>
              <div class="text-grey-7" v-if="product.category?.length">
                Categoria: {{ product.category.join(', ') }}
              </div>
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center q-gutter-sm">
              <q-btn
                flat
                dense
                round
                icon="remove"
                size="sm"
                @click="decreaseQuantity(product)"
                :disable="product.quantity <= 1"
              />
              <q-input
                v-model.number="product.quantity"
                type="number"
                min="1"
                dense
                style="width: 60px"
                @update:model-value="(val: string | number | null) => handleQuantityUpdate(product._id, val)"
              />
              <q-btn
                flat
                dense
                round
                icon="add"
                size="sm"
                @click="increaseQuantity(product)"
              />
            </div>
          </q-item-section>

          <q-item-section side>
            <q-btn
              flat
              dense
              round
              icon="delete"
              color="negative"
              @click="removeProduct(product._id)"
            >
              <q-tooltip>Rimuovi dal carrello</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="q-mt-lg">
        <q-separator />
        <div class="row justify-between items-center q-pa-md">
          <div class="text-h6">
            Totale prodotti: {{ cartStore.quantity() }}
          </div>
          <q-btn
            color="negative"
            outline
            @click="clearCart"
            :disable="cartStore.products.length === 0"
          >
            Svuota carrello
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cart'
import type { CartProduct } from '../stores/cart'

const cartStore = useCartStore()

const increaseQuantity = (product: CartProduct) => {
  cartStore.updateQuantity(product._id, product.quantity + 1)
}

const decreaseQuantity = (product: CartProduct) => {
  if (product.quantity > 1) {
    cartStore.updateQuantity(product._id, product.quantity - 1)
  }
}

const updateQuantity = (productId: string, quantity: number) => {
  if (quantity >= 1) {
    cartStore.updateQuantity(productId, quantity)
  }
}

const handleQuantityUpdate = (productId: string, val: string | number | null) => {
  if (val !== null) {
    const quantity = typeof val === 'string' ? parseInt(val, 10) : val
    if (!isNaN(quantity) && quantity >= 1) {
      updateQuantity(productId, quantity)
    }
  }
}

const removeProduct = (productId: string) => {
  cartStore.removeFromCart(productId)
}

const clearCart = () => {
  cartStore.clearCart()
}
</script>

<style scoped>
.cart-products {
  max-width: 100%;
}

.q-item {
  border-radius: 8px;
  margin-bottom: 8px;
}

.q-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>