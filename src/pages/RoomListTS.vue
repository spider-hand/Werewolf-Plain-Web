<template>
  <div id="page">
    <v-container class="mt-4">
      <DialogRoomCreate />
    </v-container>
    <v-container>
      <v-tabs
        background-color="#2F3136"
        color="#FF5252"
        dark>
        <v-tab>New</v-tab>
        <v-tab>Ongoing</v-tab>
        <v-tab>Closed</v-tab>

        <!-- New -->
        <v-tab-item
          transition="false"
          reverse-transition="false">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left"></th>
                  <th class="text-left">
                    <span>Name</span>
                  </th>
                  <th class="text-left">
                    <span>Participants</span>
                  </th>
                  <th class="text-left"></th>
                </tr>
              </thead>
              <tbody 
                v-for="(room, index) in state.newRooms"
                :key="room.id">
                <tr
                  :style="{ backgroundColor: state.selectedTableRow === index ? '#393C43' : '#2F3136' }"
                  @click="onClickTableRow(index)">
                  <td>
                    <v-icon 
                      class="icon-private"
                      v-if="room.isPrivate">mdi-lock</v-icon>
                  </td>
                  <td>
                    <span>{{ room.name }}</span>
                  </td>
                  <td>
                    <span>{{ room.numberOfParticipants }} / {{ room.capacity }}</span>
                  </td>
                  <td>
                    <span>Details</span>
                  </td>
                </tr>
                <tr
                  v-if="state.selectedTab === 0 && state.selectedTableRow === index"
                  style="background-color: #2F3136;">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <v-btn
                      class="enter-btn" 
                      text>
                      <span>Enter</span>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-tab-item>

        <!-- Ongoing -->
        <v-tab-item
          transition="false"
          reverse-transition="false">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left"></th>
                  <th class="text-left">
                    <span>Name</span>
                  </th>
                  <th class="text-left">
                    <span>Participants</span>
                  </th>
                  <th class="text-left"></th>
                </tr>
              </thead>
              <tbody 
                v-for="(room, index) in state.ongoingRooms"
                :key="room.id">
                <tr
                  :style="{ backgroundColor: state.selectedTableRow === index ? '#393C43' : '#2F3136' }"
                  @click="onClickTableRow(index)">
                  <td>
                    <v-icon 
                      class="icon-private"
                      v-if="room.isPrivate">mdi-lock</v-icon>
                  </td>
                  <td>
                    <span>{{ room.name }}</span>
                  </td>
                  <td>
                    <span>{{ room.numberOfParticipants }}</span>
                  </td>
                  <td>
                    <span>Details</span>
                  </td>
                </tr>
                <tr
                  v-if="state.selectedTab === 1 && state.selectedTableRow === index"
                  style="background-color: #2F3136;">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <v-btn
                      class="enter-btn" 
                      text>
                      <span>Enter</span>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-tab-item>

        <!-- Closed -->
        <v-tab-item
          transition="false"
          reverse-transition="false">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left"></th>
                  <th class="text-left">
                    <span>Name</span>
                  </th>
                  <th class="text-left">
                    <span>Participants</span>
                  </th>
                  <th class="text-left"></th>
                </tr>
              </thead>
              <tbody 
                v-for="(room, index) in state.closedRooms"
                :key="room.id">
                <tr
                  :style="{ backgroundColor: state.selectedTableRow === index ? '#393C43' : '#2F3136' }"
                  @click="onClickTableRow(index)">
                  <td>
                    <v-icon 
                      class="icon-private"
                      v-if="room.isPrivate">mdi-lock</v-icon>
                  </td>
                  <td>
                    <span>{{ room.name }}</span>
                  </td>
                  <td>
                    <span>{{ room.numberOfParticipants }}</span>
                  </td>
                  <td>
                    <span>Details</span>
                  </td>
                </tr>
                <tr
                  v-if="state.selectedTab === 2 && state.selectedTableRow === index"
                  style="background-color: #2F3136;">
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <v-btn 
                      class="enter-btn"
                      text>
                      <span>Enter</span>
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-tab-item>
      </v-tabs>
    </v-container>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, onMounted, watch } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'

  import { Room, Player } from '@/types/index'
  import DialogRoomCreate from '@/components/dialog/DialogRoomCreateTS.vue'

  export default defineComponent({
    components: {
      DialogRoomCreate,
    },

    setup(props, context) {
      const router = context.root.$router

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

      function openAccessCodeDialog(status: string): void {
        // TODO: Open AccessCodeDialog
      }

      function enterRoom(status: string): void {
        let roomId: string
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
          default:
            roomId = state.newRooms[state.selectedTableRow!].id
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
                      router.push({
                        name: 'game',
                        params: { id: roomId },
                      })
                    })
                })
              } else {
                // When player has been blocked
              }
            } else {
              // When the room has been deleted
            }
          })
        }  else {
          // User who didn't sign in can see the game as a viewer
          router.push({
            name: 'game',
            params: { id: roomId },
          })
        }
      }

      function updateRoomList(): void {
        state.newRooms = []
        state.ongoingRooms = []
        state.closedRooms = []

        const db = firebase.firestore()

        db.collection('rooms').orderBy('timestamp', 'desc').get()
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

<style lang="scss" scoped>
  tr {
    background-color: $black2;
  }

  th span {
    color: $gray1;
  }

  td span {
    color: $white;
  }

  #page {
    position: relative;
    height: 100%;
    background-color: $black1;
  }

  .icon-private {
    color: $gray2;
  }

  .enter-btn span {
    font-size: 14px;
    text-transform: none;
  }
</style>