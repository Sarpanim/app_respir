import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dyadComponentTagger from '@dyad-sh/react-vite-component-tagger';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dyadComponentTagger(), react()],
  server: {
    port: 5173,
    host: true,
  },
  define: {
    'process.env': {},
  },
  build: {
    sourcemap: true, // ← active les source maps (important pour déboguer)
  },
});
