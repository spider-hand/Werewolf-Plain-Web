<template>
  <div>
    <v-container>
      <v-container fill-height>
        <v-layout>
          <DialogRoomCreate />
          <div class="flex-grow-1"></div>
          <v-btn 
            depressed
            @click="updateRoomList">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-layout>
      </v-container>

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
                  @click="onClickTableRow(index)">
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
                      @click="enterRoom(index)">
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
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'
  import { mapActions } from 'vuex'

  import DialogRoomCreate from '@/components/DialogRoomCreate'

  export default {
    components: {
      DialogRoomCreate,
    },
    data() {
      return {
        tabs: 0,
        clickedTableRow: null,
        newRooms: [],
        ongoingRooms: [],
        closedRooms: [],
        newRoomIds: [],
        ongoingRoomIds: [],
        closedRoomIds: [],
      }
    },
    methods: {
      ...mapActions([
        'joinGame',
      ]),
      onClickTableRow(index) {
        this.clickedTableRow = index
      },
      enterRoom(index) {
        var db = firebase.firestore()
        var roomId = this.newRoomIds[index]
        var room = db.collection('rooms').doc(roomId)

        room.update({
          numberOfParticipants: firebase.firestore.FieldValue.increment(1),
        })

        room.collection('players').doc(firebase.auth().currentUser.uid).set({
          id: firebase.auth().currentUser.uid,
          role: '',
          name: 'Test Player2',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        })
        .then(() => {
          this.joinGame(roomId)
          this.$router.push({
            name: 'game',
          })
        })
      },
      updateRoomList() {
        this.newRooms = []
        this.ongoingRooms = []
        this.closedRooms = []

        const that = this
        var db = firebase.firestore()

        // Get rooms
        db.collection('rooms').get()
          .then(function(querySnapShot) {
            querySnapShot.forEach(function(doc) {
              if (doc.data().status == 'new') {
                that.newRooms.push(doc.data())
                that.newRoomIds.push(doc.id)
              }
              else if (doc.data().status == 'ongoing') {
                that.ongoingRooms.push(doc.data())
                that.ongoingRoomIds.push(doc.id)
              }
              else {
                that.closedRooms.push(doc.data())
                that.closedRoomIds.push(doc.id)
              }
            })
          })        
      },
    },
    mounted() {
      this.updateRoomList()
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
