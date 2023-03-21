// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  plugins: [
    // PostgreSQL plugin
    { src: '~/plugins/postgres.ts' },

    // MongoDB plugin
    { src: '~/plugins/mongo.ts' },
  ],
})
