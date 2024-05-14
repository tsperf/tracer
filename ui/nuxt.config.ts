// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  devtools: { enabled: true },
  experimental: { payloadExtraction: false, appManifest: false },
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
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
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
