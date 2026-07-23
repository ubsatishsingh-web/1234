import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  // Dynamically discover all .html files in root directory so none are missed during build
  const rootFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));
  const inputEntries: Record<string, string> = {};
  
  rootFiles.forEach(file => {
    const key = file.replace(/\.html$/, '').replace(/[^a-zA-Z0-9]/g, '_');
    inputEntries[key] = path.resolve(__dirname, file);
  });

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: inputEntries,
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
