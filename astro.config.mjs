import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://your-github-username.github.io',
  base: '/kemeko.morphusai/',
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
    }
  }
});
