export default {
  target: 'static',
  /*
   ** Headers of the page
   */
  head: {
    htmlAttrs: {
      lang: 'en'
    },
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    script: [
      { src: 'https://cdn.jsdelivr.net/npm/dragselect@2.2.2/dist/DragSelect.min.js' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Lato|Unica+One|Material+Icons'
      }
    ]
  },
  loading: { color: '#fff' },
  plugins: [
    '~/plugins/globalMethods.js',
    { src: '~/plugins/vueCarousel.js', ssr: false }
  ],
  vuetify: {
    customVariables: ['~/assets/scss/_variables.scss'],
    optionsPath: '~/vuetify.options.js'
  },

  styleResources: {
    scss: ['~/assets/scss/_init.scss'] // alternative: scss
  },
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/style-resources'
  ],
  modules: ['@nuxtjs/markdownit', '@nuxtjs/axios'],
  markdownit: {
    injected: true
  },
  axios: {
    baseURL: process.env.NUXT_ENV_MONGODB_URI
  },
  generate: {
    routes() {
      const fs = require('fs')
      const path = require('path')
      const newsPosts = fs.readdirSync('./assets/content/news').map((file) => {
        return {
          route: `/news/${path.parse(file).name}`, // Return the slug
          payload: require(`./assets/content/news/${file}`)
        }
      })
      const basicPages = fs
        .readdirSync('./assets/content/pages')
        .map((file) => {
          return {
            route: `/${path.parse(file).name}`, // Return the slug
            payload: require(`./assets/content/pages/${file}`)
          }
        })
      return basicPages.concat(newsPosts)
    }
  },
  build: {
    babel: {
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-private-methods'
      ]
    }
  }
}
