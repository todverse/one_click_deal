// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  spaLoadingTemplate: false,
  ssr: false,

  app: {
    head: {
      title: 'OneClickDeal',
    },
  },

  runtimeConfig: {
    redis: {
      host: '',
      port: 0,
    },
  },

  modules: ['@nuxtjs/tailwindcss', '@ant-design-vue/nuxt']
})