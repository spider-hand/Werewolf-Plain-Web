import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import game from './modules/game'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    game,
  }
})