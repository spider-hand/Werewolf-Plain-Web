module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pwa: {
  	workboxOptions: {
  		exclude: ['public/_redirects'],
  	}
  }
}