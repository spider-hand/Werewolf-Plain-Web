<template>
  <div>
    <v-btn
      class="bg-purple"
      depressed>
      <span class="color-white">Host Game</span>
    </v-btn>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'

  declare interface Item {
    text: string,
    value: number,
  }

  export default defineComponent({
    setup() {
      const state = reactive<{
        dialog: boolean,
        roomName: string,
        roomDescription: string,
        capacity: number,
        capacityItems: Item[],
        dayLength: number,
        dayLengthItems: Item[],
        nightLength: number,
        nightLengthItems: Item[],
        isPrivate: boolean,
        accessCode: string,
      }>({
        dialog: false,
        roomName: '',
        roomDescription: '',
        capacity: 15,
        capacityItems: [
          {
            text: '5',
            value: 5,
          },
          {
            text: '9',
            value: 9,
          },
          {
            text: '11',
            value: 11,
          },
          {
            text: '15',
            value: 15,
          }
        ],
        dayLength: 10,
        dayLengthItems: [
          {
            text: '3',
            value: 3,
          },
          {
            text: '4',
            value: 4,
          },
          {
            text: '5',
            value: 5,
          },
          {
            text: '6',
            value: 6,
          },
          {
            text: '7',
            value: 7,
          },
          {
            text: '8',
            value: 8,
          },
          {
            text: '9',
            value: 9,
          },
          {
            text: '10',
            value: 10,
          },
          {
            text: '1440',
            value: 1440,
          }
        ],
        nightLength: 5,
        nightLengthItems: [
          {
            text: '1',
            value: 1,
          },
          {
            text: '2',
            value: 2,
          },
          {
            text: '3',
            value: 3,
          },
          {
            text: '4',
            value: 4,
          },
          {
            text: '5',
            value: 5,
          }, 
        ],
        isPrivate: false,
        accessCode: '',
      })

      function createRoom(): void {
        const db = firebase.firestore()
        const promises = [] as Promise<void | firebase.firestore.DocumentReference>[]

        db.collection('rooms').add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          name: state.roomName,
          description: state.roomDescription,
          capacity: state.capacity,
          dayLength: state.dayLength,
          nightLength: state.nightLength,
          // language
          isPrivate: state.isPrivate,
          accessCode: state.accessCode,
          numberOfParticipants: 1,
          status: 'new',
          isNight: false,
          ownerId: firebase.auth().currentUser!.uid,
          banList: [],
        })
        .then((docRef) => {
          const putPlayer =
            db.collection('rooms')
              .doc(docRef.id)
              .collection('players')
              .doc(firebase.auth().currentUser!.uid)
              .set({
                id: firebase.auth().currentUser!.uid,
                name: '',  // TODO: Set a name
                avatar: '',  // TODO: Set an avatar
                isAlive: true,
                votedPlayer: null,
                bittenPlayer: null,
                protectedPlayer: null,
                divinedPlayer: null,
              })
          const sendMessage = 
            db.collection('rooms')
              .doc(docRef.id)
              .collection('messages')
              .add({
                from: 'GM',
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                body: 'A room has been created.', // TODO: Set a message
                gameName: 'GM',
                avatar: '',
                isFromGrave: false,
              })

          promises.push(putPlayer)
          promises.push(sendMessage)

          Promise.all(promises)
            .then(() => {
              // $route
            }) 
        })
      }

      function cancel(): void {
        state.dialog = false
      }

      return {
        state,
        createRoom,
        cancel,
      }
    }
  })
</script>

<style lang="scss" scoped>
  .color-white {
    color: $white !important;
  }

  .bg-purple {
    background-color: $purple1 !important;
  }
</style>