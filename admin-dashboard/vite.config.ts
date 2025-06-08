import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Set up aliases to match the baseUrl in tsconfig.json
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Configure environment variables prefix
  envPrefix: 'REACT_APP_',
  // Configure server options
  server: {
    port: 3000,
    open: true,
  },
  // Configure build options
  build: {
    outDir: 'build',
    sourcemap: true,
  },
});