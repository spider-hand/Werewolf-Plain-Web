const state = {
	roomId: localStorage.getItem('roomId') || '',
}

const getters = {
	isInRoom: state => !!state.roomId,
}

const actions = {
	enterRoom({ commit }, roomId) {
		localStorage.setItem('roomId', roomId)
		commit('enteredRoom', roomId)
	},
	leaveRoom({ commit }) {
		localStorage.removeItem('roomId')
		commit('leftRoom')
	},
}

const mutations = {
	enteredRoom(state, roomId) {
		state.roomId = roomId
	},
	leftRoom(state) {
		state.roomId = ''
	},
}

export default {
	state,
	getters,
	actions,
	mutations,
}
