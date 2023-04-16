import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

export default defineNuxtPlugin(nuxtApp => {
  return {
    provide: {
      md: () => md
    }
  }
});