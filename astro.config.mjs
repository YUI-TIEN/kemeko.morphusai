import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  build: {
    assets: '_astro'
  },
  server: {
    port: process.env.PORT || 4321,
    host: true
  },
  vite: {
    server: {
      host: true
    },
    preview: {
      host: true,
      allowedHosts: ['kemeko-morphusai-156eb03f8830.herokuapp.com', '.herokuapp.com']
    }
  }
});
