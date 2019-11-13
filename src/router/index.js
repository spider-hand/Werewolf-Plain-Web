import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import Home from '@/pages/Home'
import RoomList from '@/pages/RoomList'
import Game from '@/pages/Game'
import Profile from '@/pages/Profile'

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
    },
    {
      path: '/game',
      name: 'game',
      component: Game,
    },
    {
      path: '/profile/:uid',
      name: 'profile',
      component: Profile,
      props: true,
    }
	]
})
