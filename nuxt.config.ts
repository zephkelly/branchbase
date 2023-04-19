// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@sidebase/nuxt-auth'
  ],
  scss: ['~/assets/global.scss'],
  nitro: {
    plugins: [
      '~/server/postgres.ts',
    ]
  },
  plugins: [
    '~/plugins/markdown-it.client.ts',
    '~/plugins/sharp.server.ts',
  ],
  routeRules: {
    '/': { ssr: true },
  }
})
