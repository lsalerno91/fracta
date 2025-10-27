// -----------------------------------------------------
// Pinia store for managing products, categories,
// and related API interactions.
// -----------------------------------------------------

import { defineStore } from 'pinia'
import { useFiltersStore } from './filters';
import { apiUrls } from '../utils/apiUrls.js'

export interface Product {
  _id: string
  name: string
  category: string[]
  description?: string
  code: string
  price?: number
  image_url?: string
  brand?: string
  stock?: number
  tags?: string[]
}

interface State {
  products: Product[]
  categories: string[]
  totalPages: number
  selectedProduct: Product | null
  loading: boolean
  viewMode: 'card' | 'list'
  countByCategory: Record<string, number>
  error: string | null
}

export const useProductStore = defineStore('products', {
  state: (): State => ({
    products: [],
    categories: [],
    totalPages: 0,
    selectedProduct: null,  
    loading: false,
    viewMode: 'card',
    countByCategory: {},
    error: null
  }),
  actions: {
    // Fetch all products
    async fetchProducts() {
          const filtersStore = useFiltersStore()
          this.loading = true
          try {
            // costruisci query string dai filtri
            const params = new URLSearchParams()
            if (filtersStore.query) params.append('q', filtersStore.query)
            if (filtersStore.category.length) params.append('category', filtersStore.category.join(','))
            if (filtersStore.brand.length) params.append('brand', filtersStore.brand.join(','))
            if (filtersStore.code.length) params.append('code', filtersStore.code.join(','))
            if (filtersStore.tags.length) params.append('tags', filtersStore.tags.join(','))

            const res = await fetch(`${apiUrls.searchProducts}?${params.toString()}`)
            if (!res.ok) throw new Error('Failed to fetch products')
            this.products = await res.json()
          } catch (err: unknown) {
            this.error = err instanceof Error ? err.message : String(err)
          } finally {
            this.loading = false
          }
        },
    // Fetch categories 
    async fetchCategories(): Promise<void> {
      try {
        this.loading = true
        const res = await fetch(apiUrls.listCategories)
        if (!res.ok) throw new Error('Failed to fetch categories')
        const data: string[] = await res.json()
        this.categories = data
            } catch (err: unknown) {
          if (err instanceof Error) {
            this.error = err.message
          } else {
            this.error = String(err)
          }
        } finally {
              this.loading = false
          }
    },
    selectProduct(product: Product) {
      this.selectedProduct = product
    },
    clearSelection() {
      this.selectedProduct = null
    },
    async countProductsPerCategory(): Promise<void> {
      try {
        this.loading = true
        const res = await fetch(apiUrls.countProductsPerCategory)
        if (!res.ok) throw new Error('Failed to fetch count by category')
        this.countByCategory = await res.json()  // ✅ già oggetto
      } catch (err: unknown) {
        this.error = err instanceof Error ? err.message : String(err)
      } finally {
        this.loading = false
      }
    }
  }
})
