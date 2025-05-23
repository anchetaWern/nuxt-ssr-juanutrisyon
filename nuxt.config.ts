// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBaseUri: process.env.VITE_API_URI || 'http://localhost:3000'
    }
  },

  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    '@/assets/main.css', 
  ],

  build: {
    transpile: ['vuetify', 'mosha-vue-toastify'],
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },

  srcDir: 'src/',


  devtools: { enabled: true },
  ssr: true,

  nitro: {
    preset: 'vercel' // 'cloudflare-pages'
  },

  app: {
    head: {
      title: 'Juan Nutrisyon',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Your assistant for healthier eating' },
        { hid: 'og:title', property: 'og:title', content: 'Juan Nutrisyon' },
        { hid: 'og:description', property: 'og:description', content: 'Your assistant for healthier eating' },
        { hid: 'og:image', property: 'og:image', content: 'https://juanutrisyon.info/images/juanutrisyon.png' },
        { hid: 'og:image:type', property: 'og:image:type', content: 'image/png' },
        { hid: 'og:url', property: 'og:url', content: 'https://juanutrisyon.info/' },
        { hid: 'og:type', property: 'og:type', content: 'website' },
        { hid: 'twitter:card', name: 'twitter:card', content: 'https://juanutrisyon.info/images/juanutrisyon.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  compatibilityDate: '2025-04-30'
})