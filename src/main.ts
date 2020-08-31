import Vue from 'vue'
import AppTS from './AppTS.vue'
import vuetify from './plugins/vuetify'
import router from './router'

import firebase from 'firebase/app'
import 'firebase/analytics'
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

var firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_PROJECT_ID + ".firebaseapp.com",
  databaseURL: "https://" + process.env.VUE_APP_FIREBASE_PROJECT_ID + ".firebaseio.com",
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_PROJECT_ID + ".appspot.com",
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

new Vue({
  vuetify,
  router,
  render: h => h(AppTS)
}).$mount('#app')
