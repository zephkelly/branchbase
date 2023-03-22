// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    plugins: [
      '~/server/mongo.ts',
      '~/server/postgres.ts'
    ]
  }
  // serverMiddleware: [
  //   '~/server/middleware/index.ts'
  // ],
})
