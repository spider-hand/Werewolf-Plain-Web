<template>
  <div id="room-list-page">
    <v-container>
      <v-container fill-height>
        <v-layout>
          <DialogRoomCreate
            :gameName="gameName"
            :avatar="avatar" />
          <DialogAccessCode 
            ref="dialogAccessCode"
            :validAccessCode="validAccessCode"
            @validateAccessCode="enterRoom" />
          <div class="flex-grow-1"></div>
        </v-layout>
      </v-container>

      <v-container>
        <v-tabs
          background-color="#2F3136"
          color="#F44336"
          dark
          v-model="tabs">
          <v-tab>{{ $t('RoomList.new') }}</v-tab>
          <v-tab>{{ $t('RoomList.ongoing') }}</v-tab>
          <v-tab>{{ $t('RoomList.closed') }}</v-tab>

          <v-tab-item 
            transition="false"
            reverse-transition="false">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left"></th>
                    <th class="text-left">
                      <span>{{ $t('RoomList.name') }}</span>
                    </th>
                    <th class="text-left">
                      <span>{{ $t('RoomList.participants') }}</span>
                    </th>
                    <th class="text-left"></th>
                  </tr>
                </thead>
                <tbody v-for="(room, index) in newRooms">
                  <tr
                    :style="{ backgroundColor: clickedTableRow == index ? '#393C43' : '#2F3136' }" 
                    @click="onClickTableRow(index, room.accessCode)">
                    <td width="3%">
                      <v-icon 
                        v-if="room.isPrivate == true"
                        color="#757575"
                        :small="$viewport.width < 450"
                        >mdi-lock
                      </v-icon>
                    </td>
                    <td width="60%">
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
                    v-if="tabs == 0 && clickedTableRow == index"
                    style="background-color: #2F3136;">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <v-btn 
                        text
                        @click="room.isPrivate != true ? enterRoom('new') : beforeEnterRoom()">
                        <span>{{ $t('RoomList.enter') }}</span>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
          <v-tab-item 
            transition="false"
            reverse-transition="false">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left"></th>
                    <th class="text-left">
                      <span>{{ $t('RoomList.name') }}</span>
                    </th>
                    <th class="text-left">
                      <span>{{ $t('RoomList.participants') }}</span>
                    </th>
                    <th class="text-left"></th>
                  </tr>
                </thead>
                <tbody v-for="(room, index) in ongoingRooms">
                  <tr 
                    :style="{ backgroundColor: clickedTableRow == index ? '#393C43' : '#2F3136' }" 
                    @click="onClickTableRow(index, room.accessCode)">
                    <td width="3%">
                      <v-icon 
                        v-if="room.isPrivate == true"
                        :small="$viewport.width < 450"
                        >mdi-lock
                      </v-icon>
                    </td>
                    <td width="60%">
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
                    v-if="tabs == 1 && clickedTableRow == index"
                    style="background-color: #2F3136;">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <v-btn 
                        text
                        @click="room.isPrivate != true ? enterRoom('ongoing') : beforeEnterRoom()">
                        <span>{{ $t('RoomList.enter') }}</span>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
          <v-tab-item 
            transition="false"
            reverse-transition="false">
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left"></th>
                    <th class="text-left">
                      <span>{{ $t('RoomList.name') }}</span>
                    </th>
                    <th class="text-left">
                      <span>{{ $t('RoomList.participants') }}</span>
                    </th>
                    <th class="text-left"></th>
                  </tr>
                </thead>
                <tbody v-for="(room, index) in closedRooms">
                  <tr
                    :style="{ backgroundColor: clickedTableRow == index ? '#393C43' : '#2F3136' }" 
                    @click="onClickTableRow(index, room.accessCode)">
                    <td width="3%">
                      <v-icon 
                        v-if="room.isPrivate == true"
                        :small="$viewport.width < 450">
                        mdi-lock
                      </v-icon>
                    </td>
                    <td width="60%">
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
                    v-if="tabs == 2 && clickedTableRow == index"
                    style="background-color: #2F3136;">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <v-btn 
                        text
                        @click="room.isPrivate != true ? enterRoom('closed') : beforeEnterRoom()">
                        <span>{{ $t('RoomList.enter') }}</span>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-tab-item>
        </v-tabs>
      </v-container>
    </v-container>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'

  import DialogRoomCreate from '@/components/DialogRoomCreate'
  import DialogAccessCode from '@/components/DialogAccessCode'
  import DialogRoomDetails from '@/components/DialogRoomDetails'

  export default {
    props: [
      'gameName',
      'avatar',
    ],
    components: {
      DialogRoomCreate,
      DialogAccessCode,
      DialogRoomDetails,
    },
    data() {
      return {
        ip: null,
        tabs: 0,
        clickedTableRow: null,
        validAccessCode: '',
        newRooms: [],
        ongoingRooms: [],
        closedRooms: [],
      }
    },
    methods: {
      getIP() {
        this.$axios.get("https://api.ipify.org?format=json").then((resp) => {
          this.ip = resp.data.ip
        })
      },
      onClickTableRow(index, accessCode) {
        this.clickedTableRow = index
        this.validAccessCode = accessCode
      },
      beforeEnterRoom() {
        this.$refs.dialogAccessCode.open()
      },
      enterRoom(status) {
        var roomId
        switch (status) {
          case 'new':
            roomId = this.newRooms[this.clickedTableRow].id
            break
          case 'ongoing':
            roomId = this.ongoingRooms[this.clickedTableRow].id
            break
          case 'closed':
            roomId = this.closedRooms[this.clickedTableRow].id
            break
        }

        if (firebase.auth().currentUser) {
          var db = firebase.firestore()
          var room = db.collection('rooms').doc(roomId)
          var isBanned = false
          var isThisIPBlocked = false
          var promises = []

          room.get().then((roomDoc) => {
            if (roomDoc.exists) {
              for (var i = 0; i < roomDoc.data().banList.length; i++) {
                if (roomDoc.data().banList[i] == firebase.auth().currentUser.uid) {
                  isBanned = true
                  break
                }
              }

              for (var i = 0; i < roomDoc.data().ipList.length; i++) {
                if (roomDoc.data().ipList[i].ip == this.ip && roomDoc.data().ipList[i].uid != firebase.auth().currentUser.uid) {
                  isThisIPBlocked = true
                }
              }

              if (!isBanned && !isThisIPBlocked) {
                room.collection('players').doc(firebase.auth().currentUser.uid).get().then((playerDoc) => {
                  if (!playerDoc.exists  && roomDoc.data().status == 'new' && roomDoc.data().numberOfParticipants < roomDoc.data().capacity) {
                    var updateRoom = 
                      room.update({
                        numberOfParticipants: firebase.firestore.FieldValue.increment(1),
                        ipList: firebase.firestore.FieldValue.arrayUnion({
                          ip: this.ip,
                          uid: firebase.auth().currentUser.uid,
                        }),
                      })

                    var putPlayer = 
                      room.collection('players').doc(firebase.auth().currentUser.uid).set({
                        id: firebase.auth().currentUser.uid,
                        role: null,
                        name: this.gameName,
                        avatar: this.avatar,
                        isAlive: true,
                        votedPlayer: null,
                        bittenPlayer: null,
                        protectedPlayer: null,
                        divinedPlayer: null,
                      })

                    var sendMessage = 
                      room.collection('messages').add({
                        from: 'GM',
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        body: this.$t('RoomList.playerJoined', [this.gameName]),
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
                      // Enter the room as a viewer if the room has already started or got full
                      this.$router.push({
                        name: 'game',
                        params:{ id: roomId },
                      })
                  })
                })
              } else {
                if (isBanned) {
                  console.log("You are banned from this room..")
                } else if (isThisIPBlocked) {
                  console.log("Seems like you already entered this room using another account..")
                }
              }         
            } else {
              console.log("Can't find this room..")
            }
          })
        } else {
          // User who doesn't log in can see the game as a viewer
          this.$router.push({
            name: 'game',
            params: { id: roomId },
          })
        }
      },
      updateRoomList() {
        this.newRooms = []
        this.ongoingRooms = []
        this.closedRooms = []

        var db = firebase.firestore()

        // Get rooms
        db.collection('rooms').orderBy('timestamp', 'desc').get()
          .then((querySnapShot) => {
            querySnapShot.forEach((doc) => {
              if (doc.data().status == 'new') {
                this.newRooms.push(doc.data())
                this.newRooms[this.newRooms.length - 1].id = doc.id
              } else if (doc.data().status == 'ongoing') {
                this.ongoingRooms.push(doc.data())
                this.ongoingRooms[this.ongoingRooms.length - 1].id = doc.id
              } else {
                this.closedRooms.push(doc.data())
                this.closedRooms[this.closedRooms.length - 1].id = doc.id
              }
            })
          })        
      },
    },
    watch: {
      tabs: function(newVal, oldVal) {
        this.clickedTableRow = null
      }
    },
    mounted() {
      this.updateRoomList()
      this.getIP()
    },
  }
</script>

<style scoped>
  tr {
    background-color: #2F3136;
  }

  th span {
    color: #8E9297;
  }

  td span {
    color: #FFFFFF;
  }

  #room-list-page {
    position: relative;
    height: 100%;
    background-color: #23272A;
  }

  @media (max-width: 450px) {
    td {
      font-size: 12px;
    }
  }
</style>
