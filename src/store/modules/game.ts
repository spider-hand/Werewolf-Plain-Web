import { Room, Player, GameState } from '@/types/index'

const state = {
  isJoiningThisGame: false,
  room: null,
  myself: null,
} as GameState

const mutations = {
  isJoiningUpdated(state: GameState, isJoiningThisGame: boolean) {
    state.isJoiningThisGame = isJoiningThisGame
  },

  onRoomUpdated(state: GameState, room: Room) {
    state.room = room
  },

  onMyselfUpdated(state: GameState, myself: Player) {
    state.myself = myself
  },
}

const getters = {
  isJoiningThisGame(state: GameState): boolean {
    return state.isJoiningThisGame
  },

  room(state: GameState): Room | null {
    return state.room
  },

  myself(state: GameState): Player | null {
    return state.myself
  },
}

export default {
  state,
  mutations,
  getters,
}
