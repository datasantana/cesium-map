import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/cesium/Build/Cesium/Workers',
          dest: '.'
        },
        {
          src: 'node_modules/cesium/Build/Cesium/ThirdParty',
          dest: '.'
        },
        {
          src: 'node_modules/cesium/Build/Cesium/Assets',
          dest: '.'
        },
        {
          src: 'node_modules/cesium/Build/Cesium/Widgets',
          dest: '.'
        }
      ]
    })
  ],
  define: {
    // Define relative base path to static assets
    CESIUM_BASE_URL: JSON.stringify('./')
  }
})
