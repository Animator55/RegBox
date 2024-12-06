import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permite conexiones desde otras máquinas en la misma red
    port: 3000,        // Asegúrate de usar un puerto que esté libre
  },
})
