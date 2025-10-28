<script lang='ts' setup>
import { ref, watch } from 'vue'
import { useFiltersStore } from '../stores/filters'

// --- Tipi ---
type Option = string

const filtersStore = useFiltersStore()

// --- Props ---
const props = defineProps<{
  items: Option[]
  label: string
}>()

// --- Stato locale ---
const selectedItems = ref<Option[]>([])
const filteredItems = ref<Option[]>([...props.items])

// --- Aggiorna filteredItems quando cambiano le props.items ---
watch(
  () => props.items,
  (newItems) => {
    filteredItems.value = [...newItems]
  }
)

// --- Aggiorna store quando cambia selectedItems ---
watch(
  () => selectedItems.value,
  (newVal) => {
    if (props.label === 'Categoria') {
      if (selectedItems.value?.length) filtersStore.setCategory(newVal)
      else filtersStore.resetCategory()
    } else if (props.label === 'Brand') {
      if (selectedItems.value?.length) filtersStore.setBrand(newVal)
      else filtersStore.resetBrand()
    } else if (props.label === 'Codice') {
      if (selectedItems.value?.length) filtersStore.setCode(newVal)
      else filtersStore.resetCode()
    }
  }
)

// --- Aggiorna selectedItems quando cambiano i filtri nello store ---
if (props.label === 'Categoria') {
  watch(
    () => filtersStore.category,
    (newVal) => {
      if (filtersStore.category !== selectedItems.value) {
        selectedItems.value = [...filtersStore.category]
      }
    },
    { deep: true }
  )
} else if (props.label === 'Brand') {
  watch(
    () => filtersStore.brand,
    (newVal) => {
      if (filtersStore.brand !== selectedItems.value) {
        selectedItems.value = [...filtersStore.brand]
      }
    },
    { deep: true }
  )
} else if (props.label === 'Codice') {
  watch(
    () => filtersStore.code,
    (newVal) => {
      if (filtersStore.code !== selectedItems.value) {
        selectedItems.value = [...filtersStore.code]
      }
    },
    { deep: true }
  )
}

// --- Funzione di filtro per Q-Select ---
const filterFn = (val: string, update: (fn: () => void) => void, abort: () => void) => {
  update(() => {
    if (!val || val.length < 2) {
      filteredItems.value = [...props.items]
      return
    }

    const needle = val.toLowerCase()
    filteredItems.value = props.items.filter(
      (v) => v && v.toLowerCase().includes(needle)
    )
  })
}
</script>

<template>
  <q-select
    class='text-select'
    filled
    multiple
    color='green'
    v-model='selectedItems'
    :options='filteredItems'
    stack-label
    :label='`${props.label} : ${selectedItems ? selectedItems.length : "0"}`'
    :display-value='selectedItems ? selectedItems.join(", ") : ""'
    hide-selected
    use-input
    fill-input
    input-debounce='1'
    @filter='filterFn'
  >
    <template v-slot:append>
      <q-icon
        v-if='selectedItems.length'
        class='cursor-pointer text-primary'
        name='clear'
        @click.stop.prevent='selectedItems = []'
      ></q-icon>
    </template>
  </q-select>
</template>

<style>
.text-select {
  .q-field__native {
    color: #050a30;
  }
  .q-field__label {
    font-weight: bolder;
    color: #050a30;
  }
  .q-field__shadow {
    opacity: 0.1;
  }
  width: 100%;
  max-width: 180px;
  max-height: 50px;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
