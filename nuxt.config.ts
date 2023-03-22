// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  scss: ['~/assets/global.scss'],
  nitro: {
    plugins: [
      '~/server/mongo.ts',
      '~/server/postgres.ts'
    ]
  },
  routeRules: {
    '/': { ssr: true },
  }
})
