// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  plugins: [
    // PostgreSQL plugin
    { src: '~/plugins/postgres.js' },

    // MongoDB plugin
    { src: '~/plugins/mongo.js' },
  ],
})
