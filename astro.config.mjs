import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://your-github-username.github.io',
  base: process.env.NODE_ENV === 'production' ? '/kemeko.morphusai/' : '/',
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
