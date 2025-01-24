import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts()],
  build: {
    emptyOutDir: true,
    lib: {
      entry: ['src/main.ts'],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      name: 'qrEncode',
      formats: ['es', 'cjs', 'umd'],
    },
  },
})
