<template>
  <div class="animate-pulse">
    <!-- Category Selector Shimmer -->
    <div class="mb-8">
      <div class="h-10 w-64 bg-gray-200 rounded-lg"></div>
    </div>

    <!-- Products Grid Shimmer -->
    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div 
        v-for="n in 8" 
        :key="n"
        class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
      >
        <!-- Image Shimmer -->
        <div class="aspect-square bg-gray-200"></div>

        <div class="p-5 space-y-4">
          <!-- Category Badge Shimmer -->
          <div class="w-24 h-6 bg-gray-200 rounded-full"></div>

          <!-- Title Shimmer -->
          <div class="space-y-2">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>

          <!-- Rating and Stock Shimmer -->
          <div class="flex justify-between">
            <div class="w-16 h-4 bg-gray-200 rounded"></div>
            <div class="w-20 h-4 bg-gray-200 rounded"></div>
          </div>

          <!-- Price Shimmer -->
          <div class="w-24 h-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style> 