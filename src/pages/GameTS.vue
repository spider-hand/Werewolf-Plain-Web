<template>
  <div>
    
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, computed, watch, onMounted } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'

  import { Room, Player, Message } from '@/types/index'

  export default defineComponent({
    setup(props, context) {
      const state = reactive<{
        room: Room | null,
        myself: Player | null,
        playerIndex: number,
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
      }>({
        room: null,
        myself: null,
        playerIndex: 0,
        players: [],
        message: '',
        messages: [],
        werewolfMessages: [],
        resultsSeer: [],
        resultsMedium: [],
        isJoiningThisGame: false,
        isChatAllOpened: false,
        isWerewolfChatOpened: false,
        isResultsSeerOpened: false,
        isResultsMediumOpened: false,
        isInitialTriggerDone: false,
        isInitialWerewolfgTriggerDone: false,
        isInitialSeerTriggerDone: false,
        isInitialMediumTriggerDone: false,
      })

      const hasGameStarted = computed<boolean>(() => {
        return state.room?.status === 'new'
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
          let individualMessages = []

          for (let i = 0; i < state.messages.length; i++) {
            if (state.messages[i].from === state.players[state.playerIndex - 1].uid) {
              if (!isAlive && !isGameOngoing && !state.messages[i].isFromGrave) {
                individualMessages.push(state.messages[i])
              }
            }
          }
          return individualMessages
        }
      })

      function isOwner(uid: string) {
        return uid === state.room!.ownerId
      }

      function sendMessage(): void {
        const db = firebase.firestore()

        if (state.isWerewolfChatOpened) {
          db.collection('rooms').doc(/** $route */).collection('werewolfMessages').add({
            from: firebase.auth().currentUser!.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            body: state.message,
            gameName: state.myself!.name,
            avatar: state.myself!.avatar,
            isFromGrave: !isAlive,
          })
          .then((docRef) => {
            state.message = ''
          })
        } else {
          db.collection('rooms').doc(/** $route */).collection('messages').add({
            from: firebase.auth().currentUser!.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            body: state.message,
            gameName: state.myself!.name,
            avatar: state.myself!.avatar,
            isFromGrave: !isAlive,
          })
          .then((docRef) => {
            state.message = ''
          })          
        }
      }

      function vote(player: Player): void {
        const db = firebase.firestore()
        const docRef = db.collection('rooms').doc(/** $route **/).collection('players').doc(firebase.auth().currentUser!.uid)

        docRef.update({
          votedPlayer: player,
        })
      }

      function bite(player: Player): void {
        const db = firebase.firestore()
        const docRef = db.collection('rooms').doc(/** $route **/).collection('players').doc(firebase.auth().currentUser!.uid)

        docRef.update({
          bittenPlayer: player,
        })
      }

      function protect(player: Player): void {
        const db = firebase.firestore()
        const docRef = db.collection('rooms').doc(/** $route **/).collection('players').doc(firebase.auth().currentUser!.uid)

        docRef.update({
          protectedPlayer: player,
        })        
      }

      function checkRole(player: Player): void {
        const db = firebase.firestore()
        const docRef = db.collection('rooms').doc(/** $route **/).collection('players').doc(firebase.auth().currentUser!.uid)

        docRef.update({
          divinedPlayer: player,
        })         
      }

      watch(
        () => state.playerIndex,
        (newVal: number, oldVal: number) => {
          if (newVal === 0) {
            state.isChatAllOpened = true
            state.isWerewolfChatOpened = false
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
        () => state.myself as Player,
        (newVal: Player, oldVal: Player) => {
          if (oldVal === null || oldVal.role === null && newVal.role !== null) {
            const db = firebase.firestore()
            const docRef = db.collection('rooms').doc(/** $route */)

            if (isWerewolf) {
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

            if (isSeer) {
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

            if (isMedium) {
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
        // emit

        const db = firebase.firestore()
        const docRef = db.collection('rooms').doc(/** $route */)

        docRef.onSnapshot((doc) => {
          if (!doc.exists) {
            // Force the players to exit the game if the room has been deleted
            // $route
          } else {
            state.room = doc.data() as Room
            // emit
          }
        })

        docRef.collection('players').onSnapshot((querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              state.players.push(change.doc.data() as Player)
            }

            if (change.type === 'modified') {
              for (let i = 0; i < state.players.length; i++) {
                if (state.players[i].uid === change.doc.data().id) {
                  state.players[i] = change.doc.data() as Player
                }
              }
            }

            if (change.type === 'removed') {
              for (let i = 0; i < state.players.length; i++) {
                if (state.players[i].uid === change.doc.data().id) {
                  state.players.splice(i, 1)
                }
              }
            }

            firebase.auth().onAuthStateChanged((user) => {
              if (user) {
                if (user.uid === change.doc.data().id) {
                  state.isJoiningThisGame = true
                  // emit

                  if (change.type === 'added' || change.type === 'modified') {
                    state.myself = change.doc.data() as Player
                    // emit
                  }
                } else {
                  // Force the player to exit the game when the player doc has been removed
                  // $route
                }
              }
            })
          })
        })
      })

      return {
        state,
        isOwner,
        hasGameStarted,
        isGameOngoing,
        hasGameDone,
        isWerewolf,
        isSeer,
        isMedium,
        isKnight,
        isAlive,
        isFormVisible,
        selectedMessages,
        sendMessage,
        vote,
        bite,
        protect,
        checkRole
      }
    },
  })
</script>

<style scoped>
  
</style>
