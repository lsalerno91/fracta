// Quando richiamo un'API, prendo da qui il valore dei parametri da passare alla query

import { defineStore } from 'pinia'
import type { Product } from './products'

export interface CartProduct extends Product {
  quantity: number
}

interface Cart {
  products: CartProduct[]
  selectedProducts: CartProduct[]
}

export const useCartStore = defineStore('cart', {
  state: (): Cart => ({
    products: [],
    selectedProducts: []
  }),
  getters: {
    totalItems: (state) => state.products.length,
    totalSelectedItems: (state) => state.selectedProducts.length,
    isInCart: (state) => (id: string) => state.products.some(p => p._id === id),
    isSelected: (state) => (id: string) => state.selectedProducts.some(p => p._id === id)
  },
  actions: {
    // non usata
    selectProduct(product: CartProduct) {
      if (!this.selectedProducts.find(p => p._id === product._id)) {
        this.selectedProducts.push(product)
      }
    },
    deselectProduct(productId: string) {
      this.selectedProducts = this.selectedProducts.filter(p => p._id !== productId)
    },
    addToCart(product: Product, quantity = 1) {
      const existing = this.products.find(p => p._id === product._id)
      if (existing) {
        existing.quantity += quantity
      } else {
        this.products.push({ ...product, quantity })
      }
    },
    removeFromCart(productId: string) {
      this.products = this.products.filter(p => p._id !== productId)
      this.selectedProducts = this.selectedProducts.filter(p => p._id !== productId)
    },
    clearCart() {
      this.products = []
      this.selectedProducts = []
    },
    updateQuantity(productId: string, quantity: number) {
      const product = this.products.find(p => p._id === productId)
      if (product) {
        product.quantity = quantity
      }
    },
    clearSelectedProducts() {
      this.selectedProducts = [];
    },
    isInCart(productId: string): boolean {
      return this.products.some(p => p._id === productId)
    },
  },
});
