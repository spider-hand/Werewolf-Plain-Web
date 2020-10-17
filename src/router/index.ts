import Vue from 'vue'
import Router from 'vue-router'

import RoomList from '@/pages/RoomList.vue'
import Game from '@/pages/Game.vue'
import SignIn from '@/pages/SignIn.vue'
import SignUp from '@/pages/SignUp.vue'
import PasswordReset from '@/pages/PasswordReset.vue'
import AuthAction from '@/pages/AuthAction.vue'
import AccountDelete from '@/pages/AccountDelete.vue'

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
    },
    {
      path: '/password/reset',
      name: 'password-reset',
      component: PasswordReset,
    },
    {
      path: '/auth/action',
      name: 'auth-action',
      component: AuthAction,
    },
    {
      path: '/account/delete',
      name: 'account-delete',
      component: AccountDelete,
    },
	]
})
