// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  experimental: { payloadExtraction: false, appManifest: false },
  vite: {
    optimizeDeps: {
      include: ['localforage'],
    },
  },
  nitro: {
    static: true,
    output: { publicDir: '~/dist' },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['vscode-webview'],
      },
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.startsWith('vscode-'),
    },
  },
  modules: ['@nuxt/ui', 'nuxt3-localforage'],
  app: {

    head: {
      meta: [
        // TODO: set CSP details as VSCode requests
        // {
        //   'http-equiv': 'Content-Security-Policy',
        //   'content': 'default-src \'none\'; img-src ${webview.cspSource} https:; script-src ${webview.cspSource}; style-src ${webview.cspSource};',
        // },
      ],
    },
  },

})
