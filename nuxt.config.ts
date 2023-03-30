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
  routeRules: {
    '/': { ssr: true },
  },
  // auth: {
  //   origin: process.env.AUTH_ORIGIN,
  // },
})
