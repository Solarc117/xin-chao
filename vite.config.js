import { defineConfig } from 'vite'
import { resolve } from 'path'

console.log('__dirname:', __dirname)
console.log('process.cwd:', process.cwd())
console.log(resolve(__dirname, 'index.html'))

export default defineConfig({
  server: {
    port: process.env.PORT || 5500,
  },
  resolve: {
    alias: {
      $css: resolve(__dirname, 'public'),
      $images: resolve(__dirname, 'public/images'),
      $fonts: resolve('./typography'),
    },
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
