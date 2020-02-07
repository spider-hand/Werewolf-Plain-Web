module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  pwa: {
  	workboxOptions: {
  		exclude: ['_redirects'],
  	}
  }
}