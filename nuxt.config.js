export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
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
  css: [],
  plugins: ['~/plugins/globalMethods.js'],
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
  modules: ['@nuxtjs/markdownit'],
  markdownit: {
    injected: true
  },
  generate: {
    routes() {
      const fs = require('fs')
      const path = require('path')
      const arr1 = fs.readdirSync('./assets/content/news').map((file) => {
        return {
          route: `/news/${path.parse(file).name}`, // Return the slug
          payload: require(`./assets/content/news/${file}`)
        }
      })
      const arr2 = fs.readdirSync('./assets/content/pages').map((file) => {
        return {
          route: `/pages/${path.parse(file).name}`, // Return the slug
          payload: require(`./assets/content/pages/${file}`)
        }
      })
      return arr1.concat(arr2)
    }
  },
  build: {
    extend(config, ctx) {}
  }
}
