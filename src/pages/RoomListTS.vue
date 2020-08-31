<template>
  <div>
    
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, onMounted, watch } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'

  import { Room, Player } from '@/types/index'

  export default defineComponent({
    setup() {
      const state = reactive<{
        selectedTab: number,
        selectedTableRow: number | null,
        newRooms: Room[],
        ongoingRooms: Room[],
        closedRooms: Room[],
      }>({
        selectedTab: 0,
        selectedTableRow: null,
        newRooms: [],
        ongoingRooms: [],
        closedRooms: [],
      })

      function onClickTableRow(index: number) {
        state.selectedTableRow = index
      }

      function enterRoom(status: string): void {
        let roomId
        switch (status) {
          case 'new':
            roomId = state.newRooms[state.selectedTableRow!].id
            break
          case 'ongoing':
            roomId = state.ongoingRooms[state.selectedTableRow!].id
            break
          case 'closed':
            roomId = state.closedRooms[state.selectedTableRow!].id
            break
        }

        if (firebase.auth().currentUser) {
          const db = firebase.firestore()
          const room = db.collection('rooms').doc(roomId)
          const promises = [] as Promise<void | firebase.firestore.DocumentReference>[]
          let isBanned = false

          room.get().then((roomDoc) => {
            if (roomDoc.exists) {
              if (roomDoc.data()!.banList!.length) {
                for (let i = 0; i < roomDoc.data()!.banList!.length; i++) {
                  if (roomDoc.data()!.banList[i]! === firebase.auth().currentUser?.uid) {
                    isBanned = true
                    break
                  }
                }
              }

              if (!isBanned) {
                room.collection('players').doc(firebase.auth().currentUser!.uid).get().then((playerDoc) => {
                  if (!playerDoc.exists && roomDoc.data()!.status! === 'new' && roomDoc.data()!.numberOfParticipants! < roomDoc.data()!.capacity!) {
                    const updateRoom = 
                      room.update({
                        numberOfParticipants: firebase.firestore.FieldValue.increment(1),
                      })

                    const putPlayer = 
                      room.collection('players').doc(firebase.auth().currentUser!.uid).set({
                        id: firebase.auth().currentUser!.uid,
                        name: 'test', // props
                        avatar: '', // props
                        isAlive: true,
                        votedPlayer: null,
                        bittenPlayer: null,
                        protectedPlayer: null,
                        divinedPlayer: null,
                      })

                    const sendMessage = 
                      room.collection('messages').add({
                        from: 'GM',
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        body: 'A player has entered.',  // TODO: Set a message
                        gameName: 'GM',
                        avatar: '',
                        isFromGrave: false,
                      })

                    promises.push(updateRoom)
                    promises.push(putPlayer)
                    promises.push(sendMessage)
                  }

                  Promise.all(promises)
                    .then(() => {
                      // $router
                    })
                })
              } else {
                // When player has been blocked
              }
            } else {
              // When the room has been deleted
            }
          })
        }  // When the user didn't sign in
      }

      function updateRoomList(): void {
        state.newRooms = []
        state.ongoingRooms = []
        state.closedRooms = []

        const db = firebase.firestore()

        db.collection('rooms').where('language', '==' ,'en').orderBy('timestamp', 'desc').get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              if (doc.data()!.status! === 'new') {
                state.newRooms.push(doc.data() as Room)
                state.newRooms[state.newRooms.length - 1].id = doc.id
              } else if (doc.data()!.status! === 'ongoing') {
                state.ongoingRooms.push(doc.data() as Room)
                state.ongoingRooms[state.ongoingRooms.length - 1].id = doc.id
              } else {
                state.closedRooms.push(doc.data() as Room)
                state.closedRooms[state.closedRooms.length - 1].id = doc.id
              }
            })
          })
      }

      watch(
        () => state.selectedTab,
        (newVal: number, oldVal: number) => {
          state.selectedTableRow = null
        }
      )

      onMounted(() => {
        updateRoomList()
      })

      return {
        state,
        onClickTableRow,
        enterRoom,
        updateRoomList
      }
    }
  })
</script>

<style scoped>
  
</style>