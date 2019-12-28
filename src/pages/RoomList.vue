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
          <v-btn 
            depressed
            color="#2F3136"
            @click="updateRoomList">
            <v-icon color="#FFFFFF">mdi-refresh</v-icon>
          </v-btn>
        </v-layout>
      </v-container>

      <v-container>
        <v-tabs
          background-color="#2F3136"
          color="#F44336"
          dark
          v-model="tabs">
          <v-tab>New</v-tab>
          <v-tab>Ongoing</v-tab>
          <v-tab>Closed</v-tab>

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
                      <v-btn 
                        text
                        :small="$viewport.width < 450">
                        <span>Details</span>
                      </v-btn>
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
                        <span>Enter</span>
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
                      <span>Name</span>
                    </th>
                    <th class="text-left">
                      <span>Participants</span>
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
                      <v-btn 
                        text
                        :small="$viewport.width < 450">
                        <span>Details</span>
                      </v-btn>
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
                        <span>Enter</span>
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
                      <span>Name</span>
                    </th>
                    <th class="text-left">
                      <span>Participants</span>
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
                      <v-btn 
                        text
                        :small="$viewport.width < 450">
                        <span>Details</span>
                      </v-btn>
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
    </v-container>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'

  import DialogRoomCreate from '@/components/DialogRoomCreate'
  import DialogAccessCode from '@/components/DialogAccessCode'

  export default {
    props: [
      'gameName',
      'avatar',
    ],
    components: {
      DialogRoomCreate,
      DialogAccessCode,
    },
    data() {
      return {
        tabs: 0,
        clickedTableRow: null,
        validAccessCode: '',
        newRooms: [],
        ongoingRooms: [],
        closedRooms: [],
      }
    },
    methods: {
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

          room.get().then((roomDoc) => {
            if (roomDoc.exists) {
              for (var i = 0; i < roomDoc.data().banList.length; i++) {
                if (roomDoc.data().banList[i] == firebase.auth().currentUser.uid) {
                  isBanned = true
                  break
                }
              }

              if (!isBanned) {
                room.collection('players').doc(firebase.auth().currentUser.uid).get().then((playerDoc) => {
                  if (!playerDoc.exists  && roomDoc.data().status == 'new' && roomDoc.data().numberOfParticipants < roomDoc.data().capacity) {
                    room.update({
                      numberOfParticipants: firebase.firestore.FieldValue.increment(1),
                    })

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
                    .then(() => {
                      this.$router.push({
                        name: 'game',
                        params:{ id: roomId },
                      })
                    }) 
                  } else {
                    this.$router.push({
                      name: 'game',
                      params:{ id: roomId },
                    })
                  }
                })
              } else {
                console.log("You are banned from this room..")
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
        db.collection('rooms').get()
          .then((querySnapShot) => {
            querySnapShot.forEach((doc) => {
              if (doc.data().status == 'new' && doc.data().numberOfParticipants > 0) {
                this.newRooms.push(doc.data())
                this.newRooms[this.newRooms.length - 1].id = doc.id
              }
              else if (doc.data().status == 'ongoing') {
                this.ongoingRooms.push(doc.data())
                this.ongoingRooms[this.ongoingRooms.length - 1].id = doc.id
              }
              else {
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
    background-color: #36393F;
  }

  @media (max-width: 450px) {
    td {
      font-size: 12px;
    }
  }
</style>
