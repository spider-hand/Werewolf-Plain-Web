import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import RoomList from '@/pages/RoomList.vue'
import Game from '@/pages/Game.vue'
import SignIn from '@/pages/SignIn.vue'
import SignUp from '@/pages/SignUp.vue'
import PasswordReset from '@/pages/PasswordReset.vue'
import AuthAction from '@/pages/AuthAction.vue'
import AccountDelete from '@/pages/AccountDelete.vue'

Vue.use(Router)

const ifNotAuthenticated = ((to: any, from: any, next: any) => {
  // Redirect to the main page if the user is already authenticated
  if (!store.getters.token) {
    next()
  } else {
    next('/')
  }
})

const ifAuthenticated = ((to: any, from: any, next: any) => {
  // Have the user sign in when the user is not authenticated
  if (store.getters.token) {
    next()
  } else {
    next('/sign-in')
  }
})

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
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUp,
      beforeEnter: ifNotAuthenticated,
    },
    {
      path: '/password/reset',
      name: 'password-reset',
      component: PasswordReset,
      beforeEnter: ifNotAuthenticated,
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
      beforeEnter: ifAuthenticated,
    },
	]
})
