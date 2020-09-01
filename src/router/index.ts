import Vue from 'vue'
import Router from 'vue-router'

import RoomList from '@/pages/RoomListTS.vue'
import Game from '@/pages/GameTS.vue'
import SignIn from '@/pages/SignInTS.vue'
import SignUp from '@/pages/SignUpTS.vue'

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
    {
      path: '/sign-in',
      name: 'sign-in',
      component: SignIn,
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUp,
    }
	]
})
