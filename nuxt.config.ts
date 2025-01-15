export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'MK-Shop',
      meta: [
        { name: 'description', content: 'MK-Shop is a platform for buying various products' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#000000' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/icon?family=Material+Icons'
        }
      ]
    }
  },

  compatibilityDate: '2025-01-14'
})