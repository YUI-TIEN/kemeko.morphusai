import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  build: {
    assets: '_astro'
  },
  server: {
    port: process.env.PORT || 4321,
    host: true
  }
});
