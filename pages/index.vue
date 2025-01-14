<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8 text-gray-800">Our Products</h1>
    
    <!-- Filters and Sort Controls -->
    <div class="mb-8 space-y-4">
      <!-- Category Filter -->
      <div class="flex flex-wrap gap-3">
        <button
          class="px-4 py-2 rounded-lg transition-all duration-200"
          :class="selectedCategory === '' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          @click="fetchProducts()"
        >
          All Products
        </button>
        <button
          v-for="category in categories"
          :key="category"
          class="px-4 py-2 rounded-lg transition-all duration-200"
          :class="selectedCategory === category ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          @click="fetchProducts(category)"
        >
          {{ formatCategory(category) }}
        </button>
      </div>

      <!-- Sort Controls -->
      <div class="flex items-center gap-4">
        <label class="text-gray-700 font-medium">Sort by Price:</label>
        <div class="flex gap-2">
          <button
            class="px-4 py-2 rounded-lg transition-all duration-200"
            :class="sortOrder === 'asc' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            @click="setSortOrder('asc')"
          >
            <span class="flex items-center gap-1">
              Low to High
              <span class="material-icons text-sm">arrow_upward</span>
            </span>
          </button>
          <button
            class="px-4 py-2 rounded-lg transition-all duration-200"
            :class="sortOrder === 'desc' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
            @click="setSortOrder('desc')"
          >
            <span class="flex items-center gap-1">
              High to Low
              <span class="material-icons text-sm">arrow_downward</span>
            </span>
          </button>
          <button
            v-if="sortOrder"
            class="px-4 py-2 rounded-lg transition-all duration-200 bg-gray-100 text-gray-700 hover:bg-gray-200"
            @click="setSortOrder('')"
          >
            <span class="flex items-center gap-1">
              Clear Sort
              <span class="material-icons text-sm">clear</span>
            </span>
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Loading products...</p>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-600">{{ error }}</p>
    </div>

    <div v-else>
      <!-- Grid Layout -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div 
          v-for="product in paginatedProducts" 
          :key="product.id"
          class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
        >
          <!-- Image Container -->
          <div class="aspect-square relative overflow-hidden bg-gray-100">
            <img 
              :src="product.image" 
              :alt="product.title"
              class="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              @error="handleImageError"
            />
          </div>

          <!-- Content Container -->
          <div class="p-5">
            <!-- Category Badge -->
            <div class="mb-2">
              <span class="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-600">
                {{ formatCategory(product.category) }}
              </span>
            </div>

            <!-- Product Name -->
            <h2 class="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
              {{ product.title }}
            </h2>

            <!-- Price -->
            <div class="mt-4 flex items-center justify-between">
              <p class="text-xl font-bold text-blue-600">
                ${{ formatPrice(product.price) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="paginatedProducts.length === 0" class="text-center py-8">
        <p class="text-gray-600">No products found</p>
      </div>

      <!-- Pagination Controls -->
      <div v-if="paginatedProducts.length > 0" class="mt-12 flex items-center justify-center gap-4">
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
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProducts } from '~/composables/useProducts'
import { useSeo } from '~/composables/useSeo'

const { 
  paginatedProducts, 
  loading, 
  error, 
  currentPage,
  totalPages,
  nextPage,
  prevPage,
  canGoPrev,
  canGoNext,
  categories,
  selectedCategory,
  sortOrder,
  fetchProducts,
  fetchCategories,
  setSortOrder
} = useProducts()

const { setSeoMeta } = useSeo()

setSeoMeta({
  title: 'Products Listing - Your App Name',
  description: 'Browse our collection of products with detailed information and pricing.',
})

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

onMounted(async () => {
  await fetchCategories()
  await fetchProducts()
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
