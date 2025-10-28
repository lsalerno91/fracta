<script setup>
import { ref, watch } from "vue";
import { useProductStore } from "../stores/products";
import { useCartStore } from "../stores/cart";
//import { handleDownload } from "../utils/functions.js";

const productStore = useProductStore();
const cartStore = useCartStore();

let sortAscendingProd = ref(true);
let sortAscendingBrand = ref(true);
let sortAscendingCode = ref(true);
let selectAll = ref(false);
//let selectedProducts = ref([]);

const toggleSortProd = () => {
  sortAscendingProd.value = !sortAscendingProd.value;
  if (sortAscendingProd.value == false) {
    productStore.sortResults("name", "ascending");
  } else {
    productStore.sortResults("name", "descending");
  }
};
const toggleSortBrand = () => {
  sortAscendingBrand.value = !sortAscendingBrand.value;
  if (sortAscendingBrand.value == false) {
    productStore.sortResults("brand", "ascending");
  } else {
    productStore.sortResults("brand", "descending");
  }
};
const toggleSortCode = () => {
  toggleSortCode.value = !toggleSortCode.value;
  if (toggleSortCode.value == false) {
    productStore.sortResults("code", "ascending");
  } else {
    productStore.sortResults("code", "descending");
  }
};

// watch(selectAll, (newVal) => {
//   if (newVal) {
//     cartStore.selectedProducts = newVal;
//   } else {
//     cartStore.selectedProducts = [];
//   }
// });

const selectAllCurrentProducts = () => {
  if (selectAll.value) {
    // Se selectAll è deselezionato, aggiungi tutti i prodotti a cartStore.selectedProducts
    cartStore.selectedProducts = [...productStore.products];
  } else {
    // Se selectAll è true, rimuovi tutti i prodotti da cartStore.selectedProducts
    cartStore.selectedProducts = [];
  }
};

watch(
  () => cartStore.selectedProducts,
  (newVal, oldVal) => {
    console.log(`SelectedProducts changed from ${oldVal} to ${newVal}`);
    //cartStore.selectedProducts = selectedProducts.value;
  }
);

// watch(
//   () => cartStore.selectedProducts,
//   (newVal, oldVal) => {
//     // console.log(
//     //   `CartStore.selectedProducts changed from ${oldVal} to ${newVal}`
//     // );
//     selectedProducts.value = cartStore.selectedProducts;
//   }
// );
</script>

<template>
  <q-card class="my-card" flat bordered>
    <q-markup-table class="bg-grey-4 paragraph-font">
      <thead>
        <tr class="bg-primary text-white">
          <th class="text-left cursor-pointer">
            <q-checkbox
              keep-color
              v-model="selectAll"
              @click="selectAllCurrentProducts"
              color="blue"
            />
          </th>
          <th class="text-left cursor-pointer" @click="toggleSortProd">
            Prodotto
            <q-icon
              :name="sortAscendingProd ? 'arrow_drop_down' : 'arrow_drop_up'"
            />
          </th>
          <th class="text-left cursor-pointer" @click="toggleSortBrand">
            Brand
            <q-icon
              :name="sortAscendingBrand ? 'arrow_drop_down' : 'arrow_drop_up'"
            />
          </th>
          <th class="text-left cursor-pointer" @click="toggleSortCode">
            Codice
            <q-icon
              :name="sortAscendingCode ? 'arrow_drop_down' : 'arrow_drop_up'"
            />
          </th>
          <th class="text-left">Categoria</th>
          <th class="text-right">Scheda Tecnica/Sicurezza</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, index) in productStore.products" :key="index">
          <td class="text-left">
            <q-checkbox v-model="cartStore.selectedProducts" :val="product" />
          </td>
          <td
            class="text-left cursor-pointer"
            @click="productStore.selectProduct(product)"
          >
            {{ product.name }}
          </td>
          <td class="text-left">{{ product.brand }}</td>
          <td class="text-left">{{ product.cod }}</td>
          <td class="text-left">
            {{ product.category ? product.category.join(", ") : "" }}
          </td>
          <td class="text-right">
            <q-btn-dropdown dropdown-icon="fa-solid fa-cloud-arrow-down">
              <q-list>
                <q-item
                  clickable
                  v-close-popup
                  @click="handleDownload(product.name)"
                >
                  <q-item-section>
                    <q-item-label class="paragraph-font"
                      >Scheda Tecnica</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  @click="handleDownload(product.name, 's')"
                >
                  <q-item-section>
                    <q-item-label class="paragraph-font"
                      >Scheda di Sicurezza</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </q-card>
</template>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 100%
</style>
