export const useSeo = () => {
  const setSeoMeta = (config) => {
    const defaultConfig = {
      title: 'Your App Name',
      description: 'Default description of your application',
      image: '/default-og-image.jpg', // Add your default OG image
      url: process.client ? window.location.href : undefined
    }

    const finalConfig = { ...defaultConfig, ...config }

    useHead({
      title: finalConfig.title,
      meta: [
        {
          name: 'description',
          content: finalConfig.description
        },
        // Open Graph
        {
          property: 'og:title',
          content: finalConfig.title
        },
        {
          property: 'og:description',
          content: finalConfig.description
        },
        {
          property: 'og:image',
          content: finalConfig.image
        },
        {
          property: 'og:url',
          content: finalConfig.url
        },
        // Twitter Card
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:title',
          content: finalConfig.title
        },
        {
          name: 'twitter:description',
          content: finalConfig.description
        },
        {
          name: 'twitter:image',
          content: finalConfig.image
        }
      ],
      link: [
        {
          rel: 'canonical',
          href: finalConfig.url
        }
      ]
    })
  }

  return {
    setSeoMeta
  }
}
