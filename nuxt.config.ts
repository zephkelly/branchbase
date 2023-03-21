// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  plugins: [
    //Database connections
    { src: '~/plugins/postgres.ts' },
    { src: '~/plugins/mongo.ts' },
    //File upload
    { src: '~/plugins/multer.ts' },
    //Image processing
    { src: '~/plugins/sharp.ts' },
  ],
})
