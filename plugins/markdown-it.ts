import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

export default function (app: any) {
  app.provide('md', md)
}