// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@sidebase/nuxt-auth'
  ],
  scss: ['~/assets/global.scss'],
  nitro: {
    hooks: {
      'dev:reload': () => require('sharp')
    },
    plugins: [
    ]
  },
  plugins: [
    '~/plugins/markdown-it.client.ts',
  ],
  routeRules: {
    '/': { ssr: true },
  }
})
