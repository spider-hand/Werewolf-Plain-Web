<template>
  <div id="page">
    <v-navigation-drawer 
      class="nav-player-list"
      width="320"
      absolute
      :permanent="$viewport.width >= 450"
      :temporary="$viewport.width < 450"
      v-model="state.sidebar"> 
      <v-list class="player-list-wrapper">
        <v-list-item-group v-model="state.selectedPlayerIndex">
          <v-list-item class="player-item">
            <v-list-item-icon>
              <v-icon class="icon-pound">mdi-pound</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <span class="player-name">All</span>
            </v-list-item-content>
          </v-list-item>
          <v-list-item 
            class="player-item"
            v-for="player in state.players"
            :key="player.uid">
            <v-list-item-avatar>
              <v-img :src="player.avatar ? player.avatar : 'https://source.unsplash.com/random'" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <span 
                  class="player-name"
                  :class="{ 'text-danger' : !player.isAlive }">{{ player.name }}</span>
                <v-icon 
                  class="icon-crown ml-1"
                  v-if="player.uid === state.room.ownerId"
                  size="16">
                  mdi-crown
                </v-icon>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <DialogPlayerKickOut
                v-if="!hasGameStarted && isMyselfOwner && !isMyself(player.uid)"
                :player="player"
                :room="state.room" />
            </v-list-item-action>
            <v-list-item-action>
              <v-btn
                v-if="isGameOngoing && state.isJoiningThisGame && state.myself.isAlive && player.isAlive && !isMyself(player.uid)"
                icon
                @click="vote(player)">
                <v-icon :color="state.myself.votedPlayer !== null && player.uid === state.myself.votedPlayer.uid ? '#FFFFFF' : '#757575'">mdi-vote</v-icon>
              </v-btn>
              <v-btn
                v-if="isGameOngoing && state.isJoiningThisGame && isWerewolf && state.myself.isAlive && player.isAlive && !isMyself(player.uid)"
                icon
                @click="bite(player)">
                <v-icon :color="state.myself.bittenPlayer !== null && player.uid === state.myself.bittenPlayer.uid ? '#FF5252' : '#757575'">mdi-vote</v-icon>
              </v-btn>
              <v-btn
                v-if="isGameOngoing && state.isJoiningThisGame && isKnight && state.myself.isAlive && player.isAlive && !isMyself(player.uid)"
                icon
                @click="protect(player)">
                <v-icon :color="state.myself.protectedPlayer !== null && player.uid === state.myself.protectedPlayer.uid ? '#FFFFFF' : '#757575'">mdi-shield-cross-outline</v-icon>
              </v-btn>
              <v-btn
                v-if="isGameOngoing && state.isJoiningThisGame && isSeer && state.myself.isAlive && player.isAlive && !isMyself(player.uid)"
                icon
                @click="checkRole(player)">
                <v-icon :color="state.myself.divinedPlayer !== null && player.uid === state.myself.divinedPlayer.uid ? '#FFFFFF' : '#757575'">mdi-eye</v-icon>
              </v-btn>            
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="isWerewolf || isSeer || isMedium" />
          <v-list-item v-if="isWerewolf || isSeer || isMedium">
            <v-list-item-icon>
              <v-icon class="icon-pound">mdi-pound</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <span 
                  class="player-name"
                  v-if="isWerewolf">Werewolf Chat</span>
                <span 
                  class="player-name"
                  v-if="isSeer || isMedium">Result</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <div 
      class="chat-container"
      :style="{ 
        height: isFormVisible ? $viewport.height - 193 + 'px' : $viewport.height - 64 + 'px', 
        width: $viewport.width >= 450 ? $viewport.width - 337 + 'px' : 100 + '%' }">
      <ul>
        <li v-for="message in selectedMessages">
          <div class="message">
            <v-img 
              class="message-avatar" 
              :src="message.avatar ? message.avatar : 'https://source.unsplash.com/random'"></v-img>
            <small 
              class="message-from"
              :style="{ color: '#FFFFFF' }">{{ message.gameName }}</small>
            <div class="message-timestamp">
              <span>{{ message.timestamp.toDate().toLocaleString() }}</span>
            </div>
            <div></div>
            <div class="message-body">{{ message.body }}</div>
          </div>
          <v-divider class="message-divider" />
        </li>
      </ul>
    </div>
    <form 
      v-if="isFormVisible"
      @submit.prevent="validate">
      <textarea 
        :style="{ width: $viewport.width >= 450 ? $viewport.width - 337 + 'px' : 100 + '%' }"
        class="message-input"
        maxlength="500"
        rows="4"
        placeholder="Enter a message"
        v-model="state.message"></textarea>
      <v-btn
        class="send-btn"
        type="submit"
        icon
        depressed
        small>
        <v-icon class="icon-send">mdi-send</v-icon>
      </v-btn>
    </form>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, computed, watch, onMounted } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import { User as FirebaseUser } from 'firebase'

  import { Room, Player, Message } from '@/types/index'
  import DialogPlayerKickOut from '@/components/dialog/DialogPlayerKickOut.vue'

  export default defineComponent({
    components: {
      DialogPlayerKickOut,
    },

    setup(props, context) {
      const route = context.root.$route
      const router = context.root.$router
      const store = context.root.$store

      const state = reactive<{
        room: Room | null,
        myself: Player | null,
        selectedPlayerIndex: number,
        players: Player[],
        message: string,
        messages: Message[],
        werewolfMessages: Message[],
        resultsSeer: Message[],
        resultsMedium: Message[],
        isJoiningThisGame: boolean,
        isChatAllOpened: boolean,
        isWerewolfChatOpened: boolean,
        isResultsSeerOpened: boolean,
        isResultsMediumOpened: boolean,
        isInitialTriggerDone: boolean,
        isInitialWerewolfgTriggerDone: boolean,
        isInitialSeerTriggerDone: boolean,
        isInitialMediumTriggerDone: boolean,
        sidebar: boolean,
      }>({
        room: null,
        myself: null,
        selectedPlayerIndex: 0,
        players: [],
        message: '',
        messages: [],
        werewolfMessages: [],
        resultsSeer: [],
        resultsMedium: [],
        isJoiningThisGame: false,
        isChatAllOpened: true,
        isWerewolfChatOpened: false,
        isResultsSeerOpened: false,
        isResultsMediumOpened: false,
        isInitialTriggerDone: false,
        isInitialWerewolfgTriggerDone: false,
        isInitialSeerTriggerDone: false,
        isInitialMediumTriggerDone: false,
        sidebar: false,
      })

      const user = computed<FirebaseUser | null>(() => {
        return store.getters.user
      })

      const isMyselfOwner = computed<boolean>(() => {
        return user?.value?.uid === state.room?.ownerId
      })

      const hasGameStarted = computed<boolean>(() => {
        return state.room?.status !== 'new'
      })

      const isGameOngoing = computed<boolean>(() => {
        return state.room?.status === 'ongoing'
      })

      const hasGameDone = computed<boolean>(() => {
        return state.room?.status === 'closed'
      })

      const isWerewolf = computed<boolean>(() => {
        return state.myself?.role === 'werewolf'
      })

      const isSeer = computed<boolean>(() => {
        return state.myself?.role === 'seer'
      })

      const isMedium = computed<boolean>(() => {
        return state.myself?.role === 'medium'
      })

      const isKnight = computed<boolean>(() => {
        return state.myself?.role === 'knight'
      })

      const isAlive = computed<boolean>(() => {
        if (state.myself !== null) {
          return state.myself!.isAlive
        } else {
          return false
        }
      })

      const isFormVisible = computed<boolean>(() => {
        return state.isJoiningThisGame && (state.isChatAllOpened && !state.room?.isNight) || state.isWerewolfChatOpened
      })

      // Get the messages that shows on chat
      const selectedMessages = computed<Message[]>(() => {
        if (state.isChatAllOpened) {
          if (isAlive && isGameOngoing) {
            return state.messages.filter((message) => {
              return !message.isFromGrave
            })
          } else {
            return state.messages
          }
        } else if (state.isWerewolfChatOpened) {
          if (isAlive) {
            return state.werewolfMessages.filter((werewolfMessage: Message) => {
              return !werewolfMessage.isFromGrave
            })
          } else {
            return state.werewolfMessages
          }
        } else if (state.isResultsSeerOpened) {
          return state.resultsSeer
        } else if (state.isResultsMediumOpened) {
          return state.resultsMedium
        } else {
          const individualMessages = []

          try {
            for (let i = 0; i < state.messages.length; i++) {
              if (state.messages[i].from === state.players[state.selectedPlayerIndex - 1].uid) {
                // Players can not see the messages from the grave while the game is ongoing and the player is alive
                if (!isAlive || !isGameOngoing || !state.messages[i].isFromGrave) {
                  individualMessages.push(state.messages[i])
                }
              }
            }
          } catch (err) {
            // Switch to all chat when the selected player has been kicked out or left
            state.selectedPlayerIndex = 0
          }
          return individualMessages
        }
      })

      function isMyself(uid: string) {
        // Check if the selected player is myself
        if (user.value) {
          return user!.value!.uid === uid
        } else {
          return false
        }
      }

      function validate(): void {
        if (state.message !== '' && 
            state.message.length <= 500 &&
            state.message.replace(/\s/g, '').length) {
          sendMessage()
        }
      }

      function sendMessage(): void {
        const db = firebase.firestore()

        if (state.isWerewolfChatOpened) {
          db.collection('rooms').doc(route.params.id).collection('werewolfMessages').add({
            from: state!.myself!.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            body: state.message,
            gameName: state!.myself!.name,
            avatar: state!.myself!.avatar,
            isFromGrave: !isAlive,
          })
          .then((docRef) => {
            state.message = ''
          })
        } else {
          db.collection('rooms').doc(route.params.id).collection('messages').add({
            from: state!.myself!.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            body: state.message,
            gameName: state!.myself!.name,
            avatar: state!.myself!.avatar,
            isFromGrave: !isAlive,
          })
          .then((docRef) => {
            state.message = ''
          })          
        }
      }

      function vote(player: Player): void {
        const db = firebase.firestore()
        const docRef = db.collection('rooms').doc(route.params.id).collection('players').doc(state!.myself!.uid)

        docRef.update({
          votedPlayer: player,
        })
      }

      function bite(player: Player): void {
        const db = firebase.firestore()
        const docRef = db.collection('rooms').doc(route.params.id).collection('players').doc(state!.myself!.uid)

        docRef.update({
          bittenPlayer: player,
        })
      }

      function protect(player: Player): void {
        const db = firebase.firestore()
        const docRef = db.collection('rooms').doc(route.params.id).collection('players').doc(state!.myself!.uid)

        docRef.update({
          protectedPlayer: player,
        })        
      }

      function checkRole(player: Player): void {
        const db = firebase.firestore()
        const docRef = db.collection('rooms').doc(route.params.id).collection('players').doc(state!.myself!.uid)

        docRef.update({
          divinedPlayer: player,
        })         
      }

      watch(
        () => state.selectedPlayerIndex,
        (newVal: number | undefined, oldVal: number) => {
          if (newVal === 0 || newVal === undefined) {
            state.isChatAllOpened = true
            state.isWerewolfChatOpened = false
            state.isResultsSeerOpened = false
            state.isResultsMediumOpened = false
          } else if (newVal === state.players.length + 1) {
            // When an extra chat is opened
            state.isChatAllOpened = false

            if (state.myself?.role === 'werewolf') {
              state.isWerewolfChatOpened = true
            } else if (state.myself?.role === 'seer') {
              state.isResultsSeerOpened = true
            } else if (state.myself?.role === 'medium') {
              state.isResultsMediumOpened = true
            }
          } else {
            // When an individual chat log is opened
            state.isChatAllOpened = false
            state.isWerewolfChatOpened = false
            state.isResultsSeerOpened = false
            state.isResultsMediumOpened = false
          }
        }
      )

      watch(
        () => state?.myself?.role,
        (newVal: string | null, oldVal: string | null) => {
          // Trigger listener for extra messages when the role has been decided
          if (newVal !== null) {
            const db = firebase.firestore()
            const docRef = db.collection('rooms').doc(route.params.id)

            // Get werewolf messages if the player's role is werewolf
            if (isWerewolf.value) {
              docRef.collection('werewolfMessages').orderBy('timestamp', 'asc').get()
                .then((querySnapshot) => {
                  Promise.all(querySnapshot.docs.map((doc) => {
                    state.werewolfMessages.push(doc.data() as Message)
                  }))
                  .then(() => {
                    docRef.collection('werewolfMessages').orderBy('timestamp', 'desc').limit(1)
                      .onSnapshot((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                          if (!doc.metadata.hasPendingWrites && state.isInitialWerewolfgTriggerDone) {
                            state.werewolfMessages.push(doc.data() as Message)
                          }
                          state.isInitialWerewolfgTriggerDone = true
                        })
                      })
                  })
                })
            }

            // Get the results messages if the player's role is seer
            if (isSeer.value) {
              docRef.collection('resultsSeer').orderBy('timestamp', 'asc').get()
                .then((querySnapshot) => {
                  Promise.all(querySnapshot.docs.map((doc) => {
                    state.resultsSeer.push(doc.data() as Message)
                  }))
                  .then(() => {
                    docRef.collection('resultsSeer').orderBy('timestamp', 'desc').limit(1)
                      .onSnapshot((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                          if (!doc.metadata.hasPendingWrites && state.isInitialSeerTriggerDone) {
                            state.resultsSeer.push(doc.data() as Message)
                          }
                          state.isInitialSeerTriggerDone = true
                        })
                      })
                  })
                })              
            }

            // Get the results messages if the player's role is medium
            if (isMedium.value) {
              docRef.collection('resultsMedium').orderBy('timestamp', 'asc').get()
                .then((querySnapshot) => {
                  Promise.all(querySnapshot.docs.map((doc) => {
                    state.resultsMedium.push(doc.data() as Message)
                  }))
                  .then(() => {
                    docRef.collection('resultsMedium').orderBy('timestamp', 'desc').limit(1)
                      .onSnapshot((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                          if (!doc.metadata.hasPendingWrites && state.isInitialMediumTriggerDone) {
                            state.resultsMedium.push(doc.data() as Message)
                          }
                          state.isInitialMediumTriggerDone = true
                        })
                      })
                  })
                })
            }
          }
        }
      )

      onMounted(() => {
        const db = firebase.firestore()
        const docRef = db.collection('rooms').doc(route.params.id)

        docRef.onSnapshot((doc) => {
          if (!doc.exists) {
            // Force the players to exit the game if the room has been deleted
            router.push({
              name: 'room-list',
            })
          } else {
            state.room = doc.data() as Room
            store.commit('onRoomUpdated', state.room)
          }
        })

        docRef.collection('players').onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            const playerData = change.doc.data() as Player
            if (change.type === 'added') {
              state.players.push(playerData)
            }

            if (change.type === 'modified') {
              for (let i = 0; i < state.players.length; i++) {
                if (state.players[i].uid === playerData.uid) {
                  state.players[i] = playerData
                }
              }
            }

            if (change.type === 'removed') {
              for (let i = 0; i < state.players.length; i++) {
                if (state.players[i].uid === playerData.uid) {
                  state.players.splice(i, 1)
                }
              }
            }

            if (user.value) {
              if (user.value.uid === playerData.uid) {
                state.isJoiningThisGame = true
                store.commit('isJoiningUpdated', true)

                if (change.type === 'added' || change.type === 'modified') {
                  state.myself = playerData
                  store.commit('onMyselfUpdated', state.myself)
                } else {
                  // Force the player to exit the game when the player doc has been removed
                  router.push({
                    name: 'room-list',
                  })
                }
              }
            }
          })
        })

        docRef.collection('messages').orderBy('timestamp', 'asc').get()
          .then((querySnapshot) => {
            Promise.all(querySnapshot.docs.map((doc) => {
              state.messages.push(doc.data() as Message)
            }))
            .then(() => {
              // Set the listener for messages and retrieve the latest message every time it is added
              docRef.collection('messages').orderBy('timestamp', 'desc').limit(1).onSnapshot((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  if (!doc.metadata.hasPendingWrites && state.isInitialTriggerDone) {
                    state.messages.push(doc.data() as Message)
                  }
                  state.isInitialTriggerDone = true
                })
              })
            })
          })
      })

      return {
        state,
        hasGameStarted,
        isGameOngoing,
        isMyselfOwner,
        isWerewolf,
        isSeer,
        isMedium,
        isKnight,
        isFormVisible,
        selectedMessages,
        isMyself,
        vote,
        bite,
        protect,
        checkRole,
        validate,
      }
    },
  })
</script>

<style lang="scss" scoped>
  ul {
    list-style: none;
  }

  li {
    margin: 5px 0 15px 0;
  }

  #page {
    position: relative;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background-color: $black2;
  }

  .nav-player-list {
    background-color: $black2;
    border-right: 0.2px solid $gray21;
  }

  .player-list-wrapper, .player-item {
    background-color: $black2;
  }

  .player-name {
    color: $white;
  }

  .icon-pound {
    color: $gray2 !important;
    font-size: 18px;
  }

  .icon-action {
    color: $gray2 !important;
  }

  .icon-bite {
    color: $red1 !important;
  }

  .icon-crown {
    color: $yellow1 !important;
  }

  .chat-container {
    position: absolute;
    right: 0px;
    padding-top: 20px;
    overflow-y: scroll;
    background-color: $black2;
  }

  .message-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin: 5px 14px 0 0;
    float: left;
  }

  .message-from {
    display: inline-block;
    font-weight: 500;
  }

  .message-timestamp {
    display: inline-block;
    padding-left: 6px;
    font-size: 12px;
    color: $gray3;
  }

  .message-body {
    display: inline-block;
    max-width: calc(100% - 100px);
    padding-top: 4px;
    font-size: 15px;
    word-break: break-all;
    white-space: pre-wrap;
    color: $gray4;
  }

  .message-divider {
    margin: 10px 30px 0 0;
    opacity: 0.06;
    background-color: $white;
  }

  .message-input {
    position: fixed;
    right: 0px;
    bottom: 28px;
    padding: 5px 10px 0 10px;
    border-top: 0.2px solid $gray21;
    color: $white;
    background-color: $black2;
    resize: none;
  }

  .message-input:focus {
    outline: none;
  }

  .send-btn {
    position: fixed;
    right: 20px;
    bottom: 0px;
  }

  .icon-send {
    color: $gray4 !important;
  }

  .text-danger {
    color: $red1 !important;
  }
</style>
