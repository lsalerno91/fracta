import { computed } from 'vue'

/**
 * Composable per gestire le immagini dei prodotti con fallback
 */
export function useProductImage<T extends { image_url?: string }>(productGetter: () => T | null | undefined) {
  const placeholderImage = '/src/assets/img_placeholder.jpg'
  
  const productImageSrc = computed(() => {
    const product = productGetter()
    return product?.image_url || placeholderImage
  })
  
  const handleImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    if (target) {
      target.src = placeholderImage
    }
  }
  
  return {
    productImageSrc,
    handleImageError,
    placeholderImage
  }
}