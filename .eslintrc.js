// module.exports = {
//   root: true,
//   env: {
//     browser: true,
//     node: true
//   },
//   parserOptions: {
//     parser: 'babel-eslint'
//   },
//   extends: [
//     '@nuxtjs',
//     'prettier',
//     'prettier/vue',
//     'plugin:prettier/recommended',
//     'plugin:nuxt/recommended'
//   ],
//   plugins: ['prettier'],
//   // add your custom rules here
//   rules: {}
// }
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'prettier'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {}
}
