import { defineVitestConfig } from '@nuxt/test-utils/config'
import vue from '@vitejs/plugin-vue'
import { ModuleResolutionKind } from 'typescript'
import { fileURLToPath } from 'url'

export default defineVitestConfig({
    plugins: [vue()],
    test: {
        exclude: ['**/node_modules/**'],
        globals: true,
        environment: 'happy-dom',
        environmentOptions: {
            nuxt: {
              rootDir: fileURLToPath(new URL('.', import.meta.url)),
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./', import.meta.url)),
        },
    },
})