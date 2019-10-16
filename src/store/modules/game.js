const state = {
	roomId: localStorage.getItem('roomId') || '',
}

const getters = {
	isInGame: state => !!state.roomId,
}

const actions = {
	joinGame({ commit }, roomId) {
		localStorage.setItem('roomId', roomId)
		commit('joinedGame', roomId)
	},
	leaveGame({ commit }) {
		localStorage.removeItem('roomId')
		commit('leftGame')
	},
}

const mutations = {
	joinedGame(state, roomId) {
		state.roomId = roomId
	},
	leftGame(state) {
		state.roomId = ''
	},
}

export default {
	state,
	getters,
	actions,
	mutations,
}
