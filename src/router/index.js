import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Home from '@/pages/Home'
import RoomList from '@/pages/RoomList'
import Game from '@/pages/Game'
import Profile from '@/pages/Profile'

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
      path: '/room-list',
      name: 'room-list',
      component: RoomList,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/game',
      name: 'game',
      component: Game,
      beforeEnter: ifAuthenticated,
    },
    {
      path: '/profile/:uid',
      name: 'profile',
      component: Profile,
      props: true,
    }
	]
})
