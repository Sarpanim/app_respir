import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true,  // <--- ajoute cette ligne
  },
});
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dyadComponentTagger from '@dyad-sh/react-vite-component-tagger';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dyadComponentTagger(), react()],
  server: {
    port: 5173,
    host: true
  },
  define: {
    'process.env': {}
  }
});
