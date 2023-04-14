// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@sidebase/nuxt-auth'],
  scss: ['~/assets/global.scss'],
  nitro: {
    plugins: [
      '~/server/mongo.ts',
      '~/server/postgres.ts'
    ]
  },
  plugins: [
    '~/plugins/markdown-it.ts',
  ],
  routeRules: {
    '/': { ssr: true },
  }
})
