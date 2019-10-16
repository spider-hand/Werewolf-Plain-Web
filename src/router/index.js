import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Home from '@/pages/Home'
import VillageList from '@/pages/VillageList'
import Game from '@/pages/Game'

const ifAuthenticated = (to, from, next) => {
  // Redirect the user to home page if the user isn't authenticated
  if (store.getters.isSignedIn) {
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
    {
      path: '/village-list',
      name: 'village-list',
      component: VillageList,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/game',
      name: 'game',
      component: Game,
      beforeEnter: ifAuthenticated,
    }
	]
})
