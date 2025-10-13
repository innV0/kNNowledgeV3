import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/kNNowledgeV3/tools/projections/', // Path for subdirectory deployment
  build: {
    outDir: '.'
  }
})