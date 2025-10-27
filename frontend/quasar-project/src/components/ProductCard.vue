<template>
  <q-card class="my-card q-ma-sm" style="width: 250px">
    <q-img :src="product.image_url || 'https://via.placeholder.com/250'" :alt="product.name" ratio="16/9" />
    <q-card-section>
      <div class="text-h6">{{ product.name }}</div>
      <div class="text-subtitle2">{{ product.brand }}</div>
      <div class="text-caption">Code: {{ product.code }}</div>
      <div v-if="product.price !== undefined" class="text-subtitle1">$ {{ product.price }}</div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import type { Product } from '../stores/products'
defineProps<{ product: Product }>();
</script>

<style scoped>
.my-card {
  transition: transform 0.2s;
}
.my-card:hover {
  transform: scale(1.03);
}
</style>
