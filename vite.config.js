// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 🔑 Polyfill para Node < 18
import { randomFillSync } from 'node:crypto'
if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = {}
}
if (!globalThis.crypto.getRandomValues) {
  // @ts-ignore
  globalThis.crypto.getRandomValues = (typedArray) => randomFillSync(typedArray)
}

export default defineConfig({
  plugins: [react()],
})