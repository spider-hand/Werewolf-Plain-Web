import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

import RoomList from '@/pages/RoomList'
import Game from '@/pages/Game'
import Profile from '@/pages/Profile'
import Rules from '@/pages/Rules'
import About from '@/pages/About'
import PrivacyPolicy from '@/pages/PrivacyPolicy'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export default new Router ({
	mode: 'history',
	routes: [
    {
      path: '*',
      redirect: '/room-list',
    },
    {
      path: '/about',
      name: 'about',
      component: About,
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: PrivacyPolicy,
    },
    {
      path: '/rules',
      name: 'rules',
      component: Rules,
    },
    {
      path: '/room-list',
      name: 'room-list',
      component: RoomList,
    },
    {
      path: '/game/:id',
      name: 'game',
      component: Game,
    },
    {
      path: '/profile/:uid',
      name: 'profile',
      component: Profile,
    }
	]
})
