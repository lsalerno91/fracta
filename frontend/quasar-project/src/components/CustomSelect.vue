<script lang='ts' setup>
import { ref, watch, computed } from 'vue'
import { useFiltersStore } from '../stores/filters'

// --- Tipi ---
type Option = string
type FilterType = 'Categoria' | 'Brand' | 'Codice'

const filtersStore = useFiltersStore()

// --- Props ---
const props = defineProps<{
  items: Option[]
  label: FilterType
}>()

// --- Stato locale ---
const selectedItems = ref<Option[]>([])
const filteredItems = ref<Option[]>([...props.items])

// --- Computed per mappare le azioni dello store ---
const storeActions = computed(() => {
  switch (props.label) {
    case 'Categoria':
      return {
        set: filtersStore.setCategory,
        reset: filtersStore.resetCategory,
        current: () => filtersStore.category
      }
    case 'Brand':
      return {
        set: filtersStore.setBrand,
        reset: filtersStore.resetBrand,
        current: () => filtersStore.brand
      }
    case 'Codice':
      return {
        set: filtersStore.setCode,
        reset: filtersStore.resetCode,
        current: () => filtersStore.code
      }
    default:
      throw new Error(`Filter type "${props.label}" not supported`)
  }
})

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
    const actions = storeActions.value
    if (newVal?.length) {
      actions.set(newVal)
    } else {
      actions.reset()
    }
  }
)

// --- Aggiorna selectedItems quando cambiano i filtri nello store ---
watch(
  () => storeActions.value.current(),
  (newStoreValue) => {
    // Evita loop infiniti confrontando i valori
    const currentSelected = selectedItems.value
    const areEqual = currentSelected.length === newStoreValue.length && 
                    currentSelected.every(item => newStoreValue.includes(item))
    
    if (!areEqual) {
      selectedItems.value = [...newStoreValue]
    }
  },
  { deep: true }
)

// --- Funzione di filtro per Q-Select ---
const filterFn = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    if (!val || val.length < 2) {
      filteredItems.value = [...props.items]
      return
    }

    const needle = val.toLowerCase()
    filteredItems.value = props.items.filter(
      (item) => item && item.toLowerCase().includes(needle)
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
