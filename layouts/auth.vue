<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-green-100 via-blue-50 to-purple-100">
    <SharedNavbar />
    <main class="flex-grow">
      <slot />
    </main>
  </div>
</template>

<script setup>
import SharedNavbar from '~/components/shared/Navbar.vue'
</script> 