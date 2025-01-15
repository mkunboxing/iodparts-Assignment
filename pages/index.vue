<template>
  <div class="container mx-auto px-4 py-8 bg-yellow-50">
    <h1 class="text-3xl font-bold mb-8 text-gray-800">Our Products</h1>
    
    <!-- Loading State with Shimmer -->    
    <ShimmerEffect v-if="loading" />

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <!-- Products Grid -->
    <div v-else-if="!loading && products">
      <!-- Filters Row -->
      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <!-- Category Selector -->
        <div class="relative flex-1 md:max-w-xs">
          <select
            v-model="selectedCategory"
            @change="handleCategoryChange"
            class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none cursor-pointer"
          >
            <option value="">All Categories</option>
            <option 
              v-for="category in categories" 
              :key="category" 
              :value="category"
            >
              {{ formatCategory(category) }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <span class="material-icons text-gray-400">expand_more</span>
          </div>
        </div>

        <!-- Sort Buttons -->
        <div class="flex gap-2">
          <button
            @click="setSorting('title')"
            class="px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2"
            :class="sortField === 'title' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'"
          >
            Title
            <span v-if="sortField === 'title'" class="material-icons text-sm">
              {{ sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
            </span>
          </button>
          
          <button
            @click="setSorting('price')"
            class="px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2"
            :class="sortField === 'price' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'border-gray-300 hover:bg-gray-50'"
          >
            Price
            <span v-if="sortField === 'price'" class="material-icons text-sm">
              {{ sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward' }}
            </span>
          </button>

          <!-- Clear Sort Button - Only show when sort is active -->
          <button
            v-if="isSortActive"
            @click="clearSort"
            class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 text-gray-700"
          >
            <span class="material-icons text-sm">clear</span>
            Clear Sort
          </button>
        </div>
      </div>

      <!-- Products Display -->
      <div v-if="products && products.length > 0" class="space-y-8">
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div 
            v-for="product in products" 
            :key="product.id"
            class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
          >
            <!-- Product Card Content -->
            <div class="aspect-square relative overflow-hidden bg-gray-100">
              <img 
                :src="product.thumbnail" 
                :alt="product.title"
                class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                @error="handleImageError"
              />
            </div>

            <div class="p-5">
              <div class="mb-2">
                <span class="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600">
                  {{ formatCategory(product.category) }}
                </span>
              </div>

              <h2 class="text-lg font-semibold text-gray-800 mb-2 min-h-[1.5rem]">
                {{ product.title }}
              </h2>

              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center">
                  <span class="material-icons text-yellow-400 text-sm">star</span>
                  <span class="text-sm text-gray-600 ml-1">{{ product.rating.toFixed(1) }}</span>
                </div>
                <span class="text-sm" :class="product.stock > 10 ? 'text-green-600' : 'text-red-600'">
                  Stock: {{ product.stock }}
                </span>
              </div>

              <div class="mt-4">
                <p class="text-xl font-bold text-blue-600">
                  ${{ formatPrice(product.price) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex items-center justify-center gap-4">
          <button 
            @click="prevPage" 
            :disabled="!canGoPrev"
            class="px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2"
            :class="canGoPrev ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
          >
            <span class="material-icons text-sm">arrow_back</span>
            Previous
          </button>
          
          <div class="px-4 py-2 bg-gray-50 rounded-lg">
            <span class="text-sm font-medium text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
          </div>

          <button 
            @click="nextPage" 
            :disabled="!canGoNext"
            class="px-6 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2"
            :class="canGoNext ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
          >
            Next
            <span class="material-icons text-sm">arrow_forward</span>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-8">
        <p class="text-gray-600">No products found</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue'
import { useAuth } from '~/composables/useAuth'
import { useProducts } from '~/composables/useProducts'
import { useRouter } from 'vue-router'
import ShimmerEffect from '~/components/ui/ShimmerEffect.vue'

const router = useRouter()
const { checkAuth } = useAuth()
const { 
  products, 
  loading, 
  error, 
  categories,
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
  setSorting
} = useProducts()

const handleImageError = (e) => {
  e.target.src = '/placeholder-image.png'
}

const formatPrice = (price) => {
  return Number(price).toFixed(2)
}

const formatCategory = (category) => {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const handleCategoryChange = () => {
  currentPage.value = 1
  fetchProducts(selectedCategory.value)
}

// Initialize data after authentication check
const initializeData = async () => {
  if (import.meta.client) {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    const isAuthenticated = await checkAuth()
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // Fetch categories and products only after authentication is confirmed
    await fetchCategories()
    await fetchProducts()
  }
}

onMounted(() => {
  initializeData()
})

// Watch for authentication changes
watch(() => localStorage.getItem('token'), (newToken) => {
  if (!newToken) {
    router.push('/login')
  }
})

const isSortActive = computed(() => {
  return sortField.value !== ''
})

const clearSort = async () => {
  // Only reset sort-related filters
  sortField.value = ''
  sortOrder.value = 'asc'
  
  // Fetch products with current category but cleared sort
  await fetchProducts(selectedCategory.value)
}

definePageMeta({
  middleware: ['auth']
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
