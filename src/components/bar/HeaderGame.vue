<template>
  <v-app-bar class="header-game">
    <v-btn 
      icon
      @click="$router.push({ name: 'room-list' })">
      <v-icon class="icon-exit">mdi-arrow-left-bold</v-icon>
    </v-btn>
    <div class="flex-grow-1"></div>
    <v-btn
      class="start-btn"
      :class="{ 'text-danger': isGameReady }"
      v-if="isOwner && !hasGameStarted"
      text
      @click="startGame">
      <span>START</span>
    </v-btn>
    <DialogRoomLeave v-if="isJoiningThisGame && !hasGameStarted" />
    <DialogMessage 
      ref="dialogMessage"
      :message="state.errorMessage" />
  </v-app-bar>
</template>

<script lang="ts">
  import { defineComponent, reactive, computed, ref, } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import { User as FirebaseUser } from 'firebase'
  import 'firebase/firestore'
  import 'firebase/functions'

  import { Room, Player, DialogComponent, } from '@/types/index'
  import DialogRoomLeave from '@/components/dialog/DialogRoomLeave.vue'
  import DialogMessage from '@/components/dialog/DialogMessage.vue'

  export default defineComponent({
    components: {
      DialogRoomLeave,
      DialogMessage,
    },

    setup(props, context) {
      const route = context.root.$route
      const store = context.root.$store

      const dialogMessage = ref<DialogComponent | null>(null)

      const state = reactive<{
        errorMessage: string,
      }>({
        errorMessage: '',
      })

      const isJoiningThisGame = computed<boolean>(() => {
        return store.getters.isJoiningThisGame
      })

      const user = computed<FirebaseUser | null>(() => {
        return store.getters.user
      })

      const room = computed<Room | null>(() => {
        return store.getters.room
      })

      const myself = computed<Player | null>(() => {
        return store.getters.myself
      })

      const isOwner = computed<boolean>(() => {
        return room?.value?.ownerId === user?.value?.uid
      })

      const hasGameStarted = computed<boolean>(() => {
        return room?.value?.status !== 'new'
      })

      const isGameReady = computed<boolean>(() => {
        if (room?.value === null) {
          return false
        } else {
          return room!.value!.numberOfParticipants === room!.value!.capacity
        }
      })

      function startGame(): void {
        if (isGameReady.value) {
          const db = firebase.firestore()
          const docRef = db.collection('rooms').doc(route.params.id)
          const promises = [] as Promise<void | firebase.firestore.DocumentReference>[]

          const updateRoom =
            docRef.update({
              status: 'ongoing',
            })

          const sendMessage = 
            docRef.collection('messages').add({
              from: 'GM',
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              body: 'Game has started.', 
              gameName: 'GM',
              avatar: '',
              isFromGrave: false,
            })

          promises.push(updateRoom)
          promises.push(sendMessage)

          Promise.all(promises)
            .then(() => {
              decideRoles(room!.value!.capacity)

              callCloudFunction()
            })
        } else {
          state.errorMessage = "This room is not ready."
          showErrorDialog()
        }
      }

      function showErrorDialog(): void {
        dialogMessage!.value!.open()
      }

      function decideRoles(capacity: number): void {
        let roles: string[]
        switch (capacity) {
          case 5:
            roles = ['villager', 'villager', 'villager', 'werewolf', 'seer']
            break
          case 9:
            roles = ['villager', 'villager', 'villager', 'villager', 
            'werewolf', 'werewolf', 'seer', 'knight', 'minion']
            break
          case 11:
            roles = ['villager', 'villager', 'villager', 'villager', 
            'villager', 'werewolf', 'werewolf', 'seer', 'medium', 'knight', 'minion']
            break
          case 15:
            roles = ['villager', 'villager', 'villager', 'villager', 
            'villager', 'villager', 'villager', 'villager', 'werewolf', 
            'werewolf', 'werewolf', 'seer', 'medium', 'knight', 'minion']
            break
          default:
            roles = ['villager', 'villager', 'villager', 'villager', 
            'villager', 'villager', 'villager', 'villager', 'werewolf', 
            'werewolf', 'werewolf', 'seer', 'medium', 'knight', 'minion']
            break            
        }

        for (let i = roles.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1))
          let temp = roles[i]
          roles[i] = roles[j]
          roles[j] = temp
        }

        const db = firebase.firestore()
        const playersCollectionRef = db.collection('rooms').doc(route.params.id).collection('players')

        let k = 0
        playersCollectionRef.get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              let docRef = playersCollectionRef.doc(doc.id)

              docRef.update({
                role: roles[k]
              })

              k++
            })
          })
      }

      function callCloudFunction(): void {
        const functions = firebase.functions()
        const addTasks = functions.httpsCallable('addTasks')

        addTasks({
          roomId: route.params.id,
          dayLength: room!.value!.dayLength,
          nightLength: room!.value!.nightLength,
        })
      }

      return {
        state,
        isGameReady,
        isOwner,
        hasGameStarted,
        isJoiningThisGame,
        startGame,
      }
    }
  })
</script>

<style lang="scss" scoped>
  .header-game {
    background-color: $black1;
  }

  .start-btn span {
    color: $gray2;
  }

  .icon-exit {
    color: $gray2 !important;
  }

  .text-danger {
    color: $red1 !important;
  }
</style>