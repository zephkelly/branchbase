import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

export default defineNuxtPlugin(() => {
  return {
    provide: {
      md: () => md
    }
  }
});