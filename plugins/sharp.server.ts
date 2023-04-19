import sharp from "sharp";

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      sharp: () => sharp
    }
  }
});