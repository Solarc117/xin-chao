import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    port: process.env.PORT || 5500,
  },
  build: {
    rollUpOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'views/about.html'),
        contact: resolve(__dirname, 'views/contact.html'),
      },
    },
  },
})
