import { ref, computed } from 'vue'

export const useProducts = () => {
  const products = ref([])
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentPage = ref(1)
  const selectedCategory = ref('')
  const sortOrder = ref('') // '' | 'asc' | 'desc'
  const itemsPerPage = 10

  // First, sort the products
  const sortedProducts = computed(() => {
    if (!sortOrder.value) return [...products.value] // Create a new array to avoid mutation

    return [...products.value].sort((a, b) => {
      const priceA = parseFloat(a.price)
      const priceB = parseFloat(b.price)
      
      if (sortOrder.value === 'asc') {
        return priceA - priceB
      } else {
        return priceB - priceA
      }
    })
  })

  // Then paginate the sorted products
  const paginatedProducts = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return sortedProducts.value.slice(start, end)
  })

  const totalPages = computed(() => 
    Math.ceil(products.value.length / itemsPerPage)
  )

  const canGoPrev = computed(() => currentPage.value > 1)
  const canGoNext = computed(() => currentPage.value < totalPages.value)

  const nextPage = () => {
    if (canGoNext.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (canGoPrev.value) {
      currentPage.value--
    }
  }

  const setSortOrder = (order) => {
    // If clicking the same sort order, clear it
    if (sortOrder.value === order) {
      sortOrder.value = ''
    } else {
      sortOrder.value = order
    }
    currentPage.value = 1 // Reset to first page when sorting
  }

  const fetchCategories = async () => {
    try {
      const response = await $fetch('https://fakestoreapi.com/products/categories')
      categories.value = response
    } catch (e) {
      console.error('Error fetching categories:', e)
    }
  }

  const fetchProducts = async (category = '') => {
    loading.value = true
    error.value = null
    currentPage.value = 1 // Reset to first page when changing category
    sortOrder.value = '' // Reset sort order when changing category
    
    try {
      const url = category 
        ? `https://fakestoreapi.com/products/category/${category}`
        : 'https://fakestoreapi.com/products'
      
      const response = await $fetch(url)
      products.value = response
      selectedCategory.value = category
    } catch (e) {
      error.value = 'Failed to fetch products'
      console.error('Error fetching products:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    products,
    categories,
    loading,
    error,
    currentPage,
    totalPages,
    selectedCategory,
    sortOrder,
    paginatedProducts,
    nextPage,
    prevPage,
    canGoPrev,
    canGoNext,
    fetchProducts,
    fetchCategories,
    setSortOrder
  }
}
