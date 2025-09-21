import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/<YOUR_REPOSITORY_NAME>/', // Remplacez <YOUR_REPOSITORY_NAME> par le nom de votre dépôt GitHub
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
