import { defineStore } from 'pinia'

// Interfaccia per lo stato dei filtri
interface FiltersState {
  query: string | null
  page: number
  category: string[]
  brand: string[]
  code: string[]
  tags: string[]
  error: string | null
}

export const useFiltersStore = defineStore('filters', {
  state: (): FiltersState => ({
    query: null,
    page: 0,
    category: [],
    brand: [],
    code: [],
    tags: [],
    error: null,
  }),

  actions: {
    // Set singoli filtri
    setQuery(query: string | null) {
      this.query = query
    },
    setPage(page: number) {
      this.page = page
    },
    setCategory(category: string[]) {
      this.category = category
    },
    addCategory(category: string) {
      if (!this.category.includes(category)) {
        this.category.push(category)
      }
    },
    setBrand(brand: string[]) {
      this.brand = brand
    },
    setCode(code: string[]) {
      this.code = code
    },
    // Reset dei singoli filtri
    resetQuery() {
      this.query = null
    },
    resetCategory() {
      this.category = []
    },
    resetBrand() {
      this.brand = []
    },
    resetCode() {
      this.code = []
    },
    resetPage() {
      this.page = 0
    },
    // Reset completo di tutti i filtri
    resetAll() {
      this.resetQuery()
      this.resetCategory()
      this.resetBrand()
      this.resetCode()
      this.resetPage()
    },
  },
})
