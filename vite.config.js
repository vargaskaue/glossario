import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' // Certifique-se de que está escrito exatamente assim

export default defineConfig({
  plugins: [vue()],
  base: '/glossario/'
})