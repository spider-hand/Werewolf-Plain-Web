<template>
  <v-app-bar class="header-game">
    <v-btn icon>
      <v-icon class="icon-exit">mdi-arrow-left-bold</v-icon>
    </v-btn>
    <div class="flex-grow-1"></div>
    <v-btn
      class="start-btn" 
      text>
      <span>Start</span>
    </v-btn>
    <DialogRoomLeave />
  </v-app-bar>
</template>

<script lang="ts">
  import { defineComponent, computed, PropType } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'
  import 'firebase/functions'

  import { Room, Player } from '@/types/index'
  import DialogRoomLeave from '@/components/dialog/DialogRoomLeaveTS.vue'

  export default defineComponent({
    /**
    props: {
      room: {
        type: Object as PropType<Room>,
        required: true,
      },
      myself: {
        type:Object as PropType<Player>,
        required: true,
      },
    },
    */
    components: {
      DialogRoomLeave,
    },

    setup(props, context) {
      const route = context.root.$route

      const isOwner = computed<boolean>(() => {
        return props.room.ownerId === firebase.auth().currentUser?.uid
      })

      function startGame(): void {
        if (props.room.numberOfParticipants === props.room.capacity) {
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
              body: 'Game has started.',  // TODO: Set a message
              gameName: 'GM',
              avatar: '',
              isFromGrave: false,
            })

          promises.push(updateRoom)
          promises.push(sendMessage)

          Promise.all(promises)
            .then(() => {
              decideRoles(props.room.capacity)

              callCloudFunction()
            })
        } else {
          // TODO: Open error dialog
        }
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
          dayLength: props.room.dayLength,
          nightLength: props.room.nightLength,
        })
      }

      return {
        startGame,
        decideRoles,
        callCloudFunction,
      }
    }
  })
</script>

<style lang="scss" scoped>
  .header-game {
    background-color: $black1 !important;
  }

  .start-btn span {
    color: $red1 !important;
  }

  .icon-exit {
    color: $gray2 !important;
  }
</style>