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

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

interface State {
  products: Product[]
  categories: string[]
  pagination: PaginationInfo
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
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      limit: 20,
      hasNext: false,
      hasPrev: false
    },
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
            
            // Add pagination parameters
            params.append('page', (filtersStore.page + 1).toString()) // API expects 1-based pages, store uses 0-based
            params.append('limit', '20')

            console.log('Fetching products with params:', params.toString())

            const res = await fetch(`${apiUrls.searchProducts}?${params.toString()}`)
            if (!res.ok) throw new Error('Failed to fetch products')
            
            const data = await res.json()
            
            // Handle paginated response
            if (data.pagination) {
              this.products = data.products
              this.pagination = data.pagination
            } else {
              // Fallback for non-paginated response (backward compatibility)
              this.products = data
              this.pagination = {
                currentPage: 1,
                totalPages: 1,
                totalCount: Array.isArray(data) ? data.length : 0,
                limit: 20,
                hasNext: false,
                hasPrev: false
              }
            }
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
    },
    // Pagination actions
    async goToPage(page: number) {
      const filtersStore = useFiltersStore()
      filtersStore.setPage(page - 1) // Convert to 0-based for store
      await this.fetchProducts()
    },
    async nextPage() {
      if (this.pagination.hasNext) {
        await this.goToPage(this.pagination.currentPage + 1)
      }
    },
    async prevPage() {
      if (this.pagination.hasPrev) {
        await this.goToPage(this.pagination.currentPage - 1)
      }
    },
    async firstPage() {
      await this.goToPage(1)
    },
    async lastPage() {
      await this.goToPage(this.pagination.totalPages)
    },
    // Sorting methods
    sortResults(field: keyof Product, direction: 'ascending' | 'descending') {
      this.products.sort((a, b) => {
        const aVal = a[field]
        const bVal = b[field]
        
        // Handle arrays (like category)
        const aStr = Array.isArray(aVal) ? aVal.join(', ') : String(aVal || '')
        const bStr = Array.isArray(bVal) ? bVal.join(', ') : String(bVal || '')
        
        if (direction === 'ascending') {
          return aStr.localeCompare(bStr)
        } else {
          return bStr.localeCompare(aStr)
        }
      })
    }
  }
})
