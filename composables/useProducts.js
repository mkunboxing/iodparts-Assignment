import { ref, computed } from 'vue'

export const useProducts = () => {
  const products = ref([])
  const categories = ref([])
  const loading = ref(false)
  const error = ref(null)
  const selectedCategory = ref('')
  const currentPage = ref(1)
  const totalItems = ref(0)
  const itemsPerPage = 8
  const sortField = ref('') // 'title' or 'price'
  const sortOrder = ref('asc') // 'asc' or 'desc'

  const totalPages = computed(() => 
    Math.ceil(totalItems.value / itemsPerPage)
  )

  const canGoPrev = computed(() => currentPage.value > 1)
  const canGoNext = computed(() => currentPage.value < totalPages.value)

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://dummyjson.com/products/category-list')
      const data = await response.json()
      categories.value = data
      // console.log('Categories fetched:', categories.value)
    } catch (e) {
      console.error('Error fetching categories:', e)
    }
  }

  const fetchProducts = async (category = '') => {
    loading.value = true
    error.value = null
    
    try {
      const skip = (currentPage.value - 1) * itemsPerPage
      let url = category 
        ? `https://dummyjson.com/products/category/${category}?limit=${itemsPerPage}&skip=${skip}`
        : `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${skip}`

      // Add sorting parameters if set
      if (sortField.value) {
        url += `&sortBy=${sortField.value}&order=${sortOrder.value}`
      }
      
      const response = await fetch(url)
      const data = await response.json()

      // console.log('Products data:', data)
      
      products.value = data.products
      totalItems.value = data.total
      selectedCategory.value = category
    } catch (e) {
      error.value = 'Failed to fetch products'
      console.error('Error fetching products:', e)
    } finally {
      loading.value = false
    }
  }

  const setSorting = (field) => {
    if (sortField.value === field) {
      // Toggle order if same field is clicked
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      // Set new field and default to ascending
      sortField.value = field
      sortOrder.value = 'asc'
    }
    currentPage.value = 1 // Reset to first page
    fetchProducts(selectedCategory.value)
  }

  const nextPage = () => {
    if (canGoNext.value) {
      currentPage.value++
      fetchProducts(selectedCategory.value)
    }
  }

  const prevPage = () => {
    if (canGoPrev.value) {
      currentPage.value--
      fetchProducts(selectedCategory.value)
    }
  }

  const initialize = async () => {
    await fetchCategories()
    await fetchProducts()
  }

  return {
    products,
    categories,
    loading,
    error,
    selectedCategory,
    currentPage,
    totalPages,
    canGoPrev,
    canGoNext,
    sortField,
    sortOrder,
    fetchProducts,
    fetchCategories,
    nextPage,
    prevPage,
    initialize,
    setSorting
  }
}
