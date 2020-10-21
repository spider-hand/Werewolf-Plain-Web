import { User as FirebaseUser } from 'firebase'

import { UserState } from '@/types/index'

const state = {
  user: null,
  status: false,
  token: localStorage.getItem('token'),
} as UserState

const mutations = {
  onAuthStateChanged(state: UserState, user: FirebaseUser) {
    state.user = user
    state.status = Boolean(user)

    if (user) {
      localStorage.setItem('token', user.uid)
    } else {
      localStorage.removeItem('token')
    }
  }
}

const getters = {
  user(state: UserState): FirebaseUser | null {
    return state.user
  },

  isSignedIn(state: UserState): boolean {
    return state.status
  },

  token(state: UserState): string | null {
    return state.token
  }
}

export default {
  state,
  mutations,
  getters,
}