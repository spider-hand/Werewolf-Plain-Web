import { User as FirebaseUser } from 'firebase'

import { UserState } from '@/types/index'

const state = {
  user: null,
  status: false,
} as UserState

const mutations = {
  onAuthStateChanged(state: UserState, user: FirebaseUser) {
    state.user = user
    state.status = Boolean(user)
  }
}

const getters = {
  user(state: UserState): FirebaseUser | null {
    return state.user
  },

  isSignedIn(state: UserState): boolean {
    return state.status
  }
}

export default {
  state,
  mutations,
  getters,
}