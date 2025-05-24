import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
    return {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      plugins: [
        VitePWA({
          registerType: 'autoUpdate',
          manifest: {
            name: 'OpenNotebook',
            short_name: 'OpenNotebook',
            description: 'AI-powered PDF summarizer, mindmap, and podcast generator.',
            start_url: '.',
            display: 'standalone',
            background_color: '#f8fafc',
            theme_color: '#3b82f6',
            icons: [
              { src: 'icons/pwa_icon_48x48.png', sizes: '48x48', type: 'image/png' },
              { src: 'icons/pwa_icon_72x72.png', sizes: '72x72', type: 'image/png' },
              { src: 'icons/pwa_icon_96x96.png', sizes: '96x96', type: 'image/png' },
              { src: 'icons/pwa_icon_128x128.png', sizes: '128x128', type: 'image/png' },
              { src: 'icons/pwa_icon_144x144.png', sizes: '144x144', type: 'image/png' },
              { src: 'icons/pwa_icon_152x152.png', sizes: '152x152', type: 'image/png' },
              { src: 'icons/pwa_icon_192x192.png', sizes: '192x192', type: 'image/png' },
              { src: 'icons/pwa_icon_256x256.png', sizes: '256x256', type: 'image/png' },
              { src: 'icons/pwa_icon_384x384.png', sizes: '384x384', type: 'image/png' },
              { src: 'icons/pwa_icon_512x512.png', sizes: '512x512', type: 'image/png' }
            ],
            screenshots: [
              {
                src: 'icons/pwa_icon_512x512.png',
                sizes: '512x512',
                type: 'image/png',
                label: 'OpenNotebook Splash',
                form_factor: 'wide'
              }
            ]
          },
          includeAssets: [
            'icons/pwa_icon_48x48.png',
            'icons/pwa_icon_72x72.png',
            'icons/pwa_icon_96x96.png',
            'icons/pwa_icon_128x128.png',
            'icons/pwa_icon_144x144.png',
            'icons/pwa_icon_152x152.png',
            'icons/pwa_icon_192x192.png',
            'icons/pwa_icon_256x256.png',
            'icons/pwa_icon_384x384.png',
            'icons/pwa_icon_512x512.png'
          ]
        })
      ],
    };
});
