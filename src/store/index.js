import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import game from './modules/game'

Vue.use(Vuex)

export default new Vuex.Store({
	modules: {
		auth,
		game,
	}
})
