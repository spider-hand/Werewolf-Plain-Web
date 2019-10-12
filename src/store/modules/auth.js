const state = {
	token: localStorage.getItem('token') || '',
}

const getters = {
	isSignedIn: state => !!state.token,
}

const actions = {
	signIn({ commit }, token) {
		localStorage.setItem('token', token)
		commit('signedIn', token)
	},
	signOut({ commit }) {
		localStorage.removeItem('token')
		commit('signedOut')
	},
}

const mutations = {
	signedIn(state, token) {
		state.token = token
	},
	signedOut(state) {
		state.token = ''
	},
}

export default {
  state,
  getters,
  actions,
  mutations,
}
