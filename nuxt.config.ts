// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  /*
  routeRules: {
    '/food/**': { isr: 2592000, fallback: true } // or 604800 = 7 days
  },
  */
  runtimeConfig: {
    public: {
      apiBaseUri: process.env.VITE_API_URI || 'http://localhost:3000'
    }
  },

  modules: [
   
    '@nuxtjs/robots',
    '@nuxt/image',

    '@vite-pwa/nuxt'
  ],

  image: {
    format: ['webp', 'avif']
  },

  site: {
    url: "https://app.juanutrisyon.info",
    name: "Juan Nutrisyon"
  },



 

  robots: {
    rules: {
      UserAgent: '*',
      Allow: '/',
      Disallow: '/__sitemap__/'
    },
    sitemap: [
      'https://app.juanutrisyon.info/sitemaps/sitemap-index.xml',
    ]
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
    plugins: [
      vuetify({ autoImport: true })
    ],
    define: {
      'process.env.DEBUG': false, 
    },
  },

  srcDir: 'src/',
  


  devtools: { enabled: true },
  ssr: true,

  nitro: {
    //preset: 'node-server', // 'cloudflare-pages', // 'vercel-static', //'vercel', // 'cloudflare-pages'

    prerender: {
      autoSubfolderIndex: false,
      ignore: [
        '/images/**' 
      ]
    },

    compressPublicAssets: true,

    /*
    prerender: {
      routes: [
        '/',     
        '/login',
        '/register',             
        '/recipe',
        '/analyze',
        '/ai',       
        '/categories'
      ]
    }
    */
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

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Juan Nutrisyon',
      short_name: 'Juan Nutrisyon',
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#84A42E',
      icons: [
      
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },

    workbox: {
     
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    
    ssr: true,

  },


  compatibilityDate: '2025-04-30'
})