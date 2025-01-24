import { defineConfig } from 'vite'

export default defineConfig({
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
