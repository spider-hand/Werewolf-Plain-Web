import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import store from './store'
import firebase from './firebase'
import VueCompositionAPI from '@vue/composition-api'

import 'firebase/auth'
import './registerServiceWorker'

Vue.config.productionTip = false

declare interface Viewport {
  width: number,
  height: number,
}

declare module 'vue/types/vue' {
  interface Vue {
    $viewport: Viewport,
  }
}

const updateSizes = (obj: any = {}) => {
  obj.width = window.innerWidth
  obj.height = window.innerHeight
  return obj
} 

Object.defineProperty(Vue.prototype, '$viewport', {
  value: Vue.observable(updateSizes())
})

window.addEventListener('resize', () => {
  updateSizes(Vue.prototype.$viewport)
})

Vue.use(VueCompositionAPI)

const app = new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
})

firebase.auth().onAuthStateChanged((user) => {
  store.commit('onAuthStateChanged', user)
  app.$mount('#app')
})
