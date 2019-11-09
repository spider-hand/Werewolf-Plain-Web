<template>
  <div>
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
            @click="updateRoomList">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-layout>
      </v-container>

      <v-container>
        <v-simple-table v-if="currentRoom != null">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left"></th>
                <th class="text-left">Name</th>
                <th class="text-left">Participants</th>
                <th class="text-left"></th>
              </tr>
            </thead>
            <tbody>
              <tr 
                :style="{ backgroundColor: isCurrentRoomClicked == true ? '#BBDEFB' : '#FFFFFF' }"
                @click="onClickCurrentRoom">
                <td width="3%">
                  <v-icon 
                    v-if="currentRoom.isPrivate == true"
                    :small="$viewport.width < 450"
                    >mdi-lock
                  </v-icon>
                </td>
                <td width="60%">{{ currentRoom.name }}</td>
                <td>{{ currentRoom.numberOfParticipants }} / {{ currentRoom.capacity }}</td>
                <td>
                  <v-btn 
                    text
                    :small="$viewport.width < 450">
                    Details
                  </v-btn>
                </td>
              </tr>
              <tr 
                v-if="isCurrentRoomClicked"
                style="background-color: #FFFFFF;">
                <td></td>
                <td></td>
                <td></td>
                <td>
                  <v-btn 
                    depressed
                    @click="reenterRoom">
                    Enter
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>

      <v-container>
        <v-tabs v-model="tabs">
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
                    <th class="text-left">Name</th>
                    <th class="text-left">Participants</th>
                    <th class="text-left"></th>
                  </tr>
                </thead>
                <tbody v-for="(room, index) in newRooms">
                  <tr
                    :style="{ backgroundColor: clickedTableRow == index ? '#BBDEFB' : '#FFFFFF' }" 
                    @click="onClickTableRow(index, room.accessCode)">
                    <td width="3%">
                      <v-icon 
                        v-if="room.isPrivate == true"
                        :small="$viewport.width < 450"
                        >mdi-lock
                      </v-icon>
                    </td>
                    <td width="60%">{{ room.name }}</td>
                    <td>{{ room.numberOfParticipants }} / {{ room.capacity }}</td>
                    <td>
                      <v-btn 
                        text
                        :small="$viewport.width < 450">
                        Details
                      </v-btn>
                    </td>
                  </tr>
                  <tr 
                    v-if="tabs == 0 && clickedTableRow == index"
                    style="background-color: #FFFFFF;">
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <v-btn 
                        depressed
                        @click="room.isPrivate != true ? enterRoom() : beforeEnterRoom()">
                        Enter
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
                    <th class="text-left">Name</th>
                    <th class="text-left">Participants</th>
                    <th class="text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="room in ongoingRooms">
                    <td width="3%">
                      <v-icon 
                        v-if="room.isPrivate == true"
                        :small="$viewport.width < 450"
                        >mdi-lock
                      </v-icon>
                    </td>
                    <td width="60%">{{ room.name }}</td>
                    <td>{{ room.numberOfParticipants }}</td>
                    <td>
                      <v-btn 
                        text
                        :small="$viewport.width < 450">
                        Details
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
                    <th class="text-left">Name</th>
                    <th class="text-left">Participants</th>
                    <th class="text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="room in closedRooms">
                    <td width="3%">
                      <v-icon 
                        v-if="room.isPrivate == true"
                        :small="$viewport.width < 450">
                        mdi-lock
                      </v-icon>
                    </td>
                    <td width="60%">{{ room.name }}</td>
                    <td>{{ room.numberOfParticipants }}</td>
                    <td>
                      <v-btn 
                        text
                        :small="$viewport.width < 450">
                        Details
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
  import { mapGetters, mapActions } from 'vuex'

  import DialogRoomCreate from '@/components/DialogRoomCreate'
  import DialogAccessCode from '@/components/DialogAccessCode'

  export default {
    components: {
      DialogRoomCreate,
      DialogAccessCode,
    },
    data() {
      return {
        tabs: 0,
        clickedTableRow: null,
        validAccessCode: '',
        currentRoom: null,
        isCurrentRoomClicked: false,
        newRooms: [],
        ongoingRooms: [],
        closedRooms: [],
        newRoomIds: [],
        ongoingRoomIds: [],
        closedRoomIds: [],
        gameName: '',
        avatar: '',
      }
    },
    computed: {
      ...mapGetters(['isInGame']),
    },
    methods: {
      ...mapActions([
        'joinGame',
        'leaveGame',
      ]),
      onClickTableRow(index, accessCode) {
        this.clickedTableRow = index
        this.validAccessCode = accessCode
      },
      onClickCurrentRoom() {
        this.isCurrentRoomClicked = true
      },
      beforeEnterRoom() {
        this.$refs.dialogAccessCode.open()
      },
      enterRoom() {
        var db = firebase.firestore()
        var roomId = this.newRoomIds[this.clickedTableRow]
        var room = db.collection('rooms').doc(roomId)
        var isBanned = false
        var i

        room.get().then((doc) => {
          if (doc.exists) {
            for (i = 0; i < doc.data().banList.length; i++) {
              if (doc.data().banList[i] == firebase.auth().currentUser.uid) {
                isBanned = true
                break
              }
            }

            if (isBanned == false) {
              room.update({
                numberOfParticipants: firebase.firestore.FieldValue.increment(1),
              })

              room.collection('players').doc(firebase.auth().currentUser.uid).set({
                id: firebase.auth().currentUser.uid,
                role: '',
                name: this.gameName,
                avatar: this.avatar,
              })
              .then(() => {
                this.joinGame(roomId)
                this.$router.push({
                  name: 'game',
                })
              })                
            } else {
              console.log("You are banned from this room..")
            }         
          } else {
            console.log("Can't find this room..")
          }
        })


      },
      reenterRoom() {
        this.$router.push({
          name: 'game',
        })
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
                this.newRoomIds.push(doc.id)
              }
              else if (doc.data().status == 'ongoing') {
                this.ongoingRooms.push(doc.data())
                this.ongoingRoomIds.push(doc.id)
              }
              else {
                this.closedRooms.push(doc.data())
                this.closedRoomIds.push(doc.id)
              }
            })
          })        
      },
      getCurrentRoom() {
        var db = firebase.firestore()
        var docRef = db.collection('rooms').doc(this.$store.state.game.roomId)

        docRef.get().then((doc) => {
          if (doc.exists) {
            this.currentRoom = doc.data()
          } else {
            this.leaveGame()
          }
        })
      },
    },
    mounted() {
      this.updateRoomList()

      if (this.isInGame == true) {
        this.getCurrentRoom()
      }

      firebase.auth().onAuthStateChanged((user) => {
        var db = firebase.firestore()
        db.collection('users').doc(user.uid).get().then((doc) => {
          this.gameName = doc.data().gameName
          this.avatar = doc.data().avatar
        })
      })
    },
  }
</script>

<style scoped>
  @media (max-width: 450px) {
    td {
      font-size: 12px;
    }
  }
</style>
