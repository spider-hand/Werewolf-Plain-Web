<template>
  <div id="page">
    <v-container class="mt-4">
      <DialogRoomCreate />
      <DialogAccessCode 
        ref="dialogAccessCode"
        :validAccessCode="state.validAccessCode"
        @validateAccessCode="enterRoom" />
      <DialogMessage 
        ref="dialogMessage"
        :message="state.errorMessage" />
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
                  @click="onClickTableRow(index, room.accessCode)">
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
                    <DialogRoomDetails :room="room" />
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
                      text
                      @click="room.isPrivate ? validateAccessCode() : enterRoom()">
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
                    <DialogRoomDetails :room="room" />
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
                      text
                      @click="room.isPrivate ? validateAccessCode() : enterRoom()">
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
                    <DialogRoomDetails :room="room" />
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
                      text
                      @click="room.isPrivate ? validateAccessCode() : enterRoom()">
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
  import { defineComponent, reactive, computed, onMounted, watch, ref, } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import { User as FirebaseUser } from 'firebase'

  import { Room, Player } from '@/types/index'
  import DialogRoomCreate from '@/components/dialog/DialogRoomCreate.vue'
  import DialogAccessCode from '@/components/dialog/DialogAccessCode.vue'
  import DialogMessage from '@/components/dialog/DialogMessage.vue'
  import DialogRoomDetails from '@/components/dialog/DialogRoomDetails.vue'

  export default defineComponent({
    components: {
      DialogRoomCreate,
      DialogAccessCode,
      DialogMessage,
      DialogRoomDetails,
    },

    setup(props, context) {
      const router = context.root.$router
      const store = context.root.$store

      const dialogAccessCode = ref(null)
      const dialogMessage = ref(null)

      const state = reactive<{
        selectedTab: number,
        selectedTableRow: number | null,
        newRooms: Room[],
        ongoingRooms: Room[],
        closedRooms: Room[],
        validAccessCode: string,
        errorMessage: string,
      }>({
        selectedTab: 0,
        selectedTableRow: null,
        newRooms: [],
        ongoingRooms: [],
        closedRooms: [],
        validAccessCode: '',
        errorMessage: '',
      })

      const user = computed<FirebaseUser | null>(() => {
        return store.getters.user
      })

      const selectedStatus = computed<string>(() => {
        switch (state.selectedTab) {
          case 0:
            return 'new'
          case 1:
            return 'ongoing'
          case 2:
            return 'closed'
          default:
            return 'new'
        }
      })

      function onClickTableRow(index: number, accessCode: string) {
        state.selectedTableRow = index
        state.validAccessCode = accessCode
      }

      function validateAccessCode(): void {
        dialogAccessCode.value.open()
      }

      function enterRoom(): void {
        let roomId: string
        switch (selectedStatus.value) {
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

        if (user.value) {
          const db = firebase.firestore()
          const room = db.collection('rooms').doc(roomId)
          const promises: Promise<void | firebase.firestore.DocumentReference>[] = [] 
          let isBanned = false

          room.get().then((roomDoc) => {
            if (roomDoc.exists) {
              if (roomDoc.data()!.banList!.length) {
                for (let i = 0; i < roomDoc.data()!.banList!.length; i++) {
                  if (roomDoc.data()!.banList[i]! === user!.value!.uid) {
                    isBanned = true
                    break
                  }
                }
              }

              if (!isBanned) {
                room.collection('players').doc(user!.value!.uid).get().then((playerDoc) => {
                  if (!playerDoc.exists && roomDoc.data()!.status === 'new' && roomDoc.data()!.numberOfParticipants < roomDoc.data()!.capacity) {
                    const updateRoom = 
                      room.update({
                        numberOfParticipants: firebase.firestore.FieldValue.increment(1),
                      })

                    const putPlayer = 
                      room.collection('players').doc(user!.value!.uid).set({
                        uid: user!.value!.uid,
                        name: user!.value!.displayName,
                        avatar: user!.value!.photoURL,
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
                        body: `${user!.value!.displayName} has entered.`, 
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
                state.errorMessage = "You have been blocked by the owner of this room."
                showErrorDialog()
              }
            } else {
              // When the room has been deleted
              state.errorMessage = "Can not find this room. Looks like this room has been deleted."
              showErrorDialog()
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

      function showErrorDialog(): void {
        dialogMessage.value.open()
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
        store,
        user,
        state,
        selectedStatus,
        dialogAccessCode,
        dialogMessage,
        onClickTableRow,
        validateAccessCode,
        enterRoom,
        showErrorDialog,
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
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
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