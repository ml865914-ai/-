import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    base: '/-/',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.svg', 'images/*.jpg'],
        manifest: {
  id: '/-/',
  name: 'الصلاة على النبي ﷺ',
  short_name: 'صلِّ على النبي',
  description: 'تطبيق للتذكير بالصلاة والسلام على رسول الله محمد ﷺ كل 5 دقائق بصور منبثقة وعداد تسبيح.',
  theme_color: '#064e3b',
  background_color: '#064e3b',
  display: 'standalone',
  orientation: 'portrait',
  start_url: '/-/',
  scope: '/-/',
  icons: [
    {
      src: '/-/pwa-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/-/pwa-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any',
    },
    {
      src: '/-/pwa-maskable-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
},
