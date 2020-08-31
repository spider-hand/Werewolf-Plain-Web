import Vue from 'vue'
import Router from 'vue-router'

import RoomList from '@/pages/RoomListTS.vue'
import Game from '@/pages/GameTS.vue'

Vue.use(Router)

export default new Router ({
	mode: 'history',
	routes: [
    {
      path: '*',
      redirect: '/room-list',
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
	]
})
