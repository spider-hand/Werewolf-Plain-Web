module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pwa: {
    workboxOptions: {
      exclude: ['_redirects'],
    }
  },
  css: {
      loaderOptions: {
          scss: {
              additionalData: `@import "@/styles/variables.scss";`
          }
      }
  }
}