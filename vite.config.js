import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    emptyOutDir: true,
    lib: {
      entry: ['src/main.ts'],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
      name: 'qrDecode',
      formats: ['es', 'cjs', 'umd'],
    },
  },
})
