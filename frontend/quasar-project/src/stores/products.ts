// -----------------------------------------------------
// Pinia store for managing products, categories,
// and related API interactions.
// -----------------------------------------------------

import { defineStore } from 'pinia'
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
    error: null
  }),
  actions: {
    // Fetch all products
    async fetchProducts(): Promise<void> {
      try {
        this.loading = true
        const res = await fetch(apiUrls.searchProducts)
        if (!res.ok) throw new Error('Failed to fetch products')
        const data: Product[] = await res.json()
        this.products = data
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
    }
  }
})
