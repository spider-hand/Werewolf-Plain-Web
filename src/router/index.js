import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Home from '@/components/Home'

const ifNotAuthenticated = (to, from, next) => {
  // Redirect the user to home page if the user isn't authenticated
  if (!store.getters.isSignedIn) {
    next()
    return
  }
  next('/')
}

Vue.use(Router)

export default new Router ({
	mode: 'history',
	routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
	]
})
