import { defineConfig } from 'vite'
import { resolve } from 'path'
import * as dotenv from 'dotenv'
dotenv.config()
const port = process.env.PORT || 5500

export default defineConfig({
  server: {
    port,
  },
  preview: {
    port,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about/about.html'),
        contact: resolve(__dirname, 'contact/contact.html'),
      },
    },
  },
})
