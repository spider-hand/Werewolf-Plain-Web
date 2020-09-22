import { User, UserState } from '@/types/index'

const state = {
  user: null,
  status: false,
} as UserState

const mutations = {
  onAuthStateChanged(state: UserState, user: User) {
    state.user = user
    state.status = Boolean(user)
  }
}

const getters = {
  user(state: UserState): User | null {
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