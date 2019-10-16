<template>
  <div>
    <v-container>
      <v-container fill-height>
        <v-layout>
          <DialogVillage />
          <div class="flex-grow-1"></div>
          <v-btn 
            depressed
            @click="updateVillageList">
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
              <tbody v-for="(village, index) in newVillages">
                <tr
                  :style="{ backgroundColor: clickedTableRow == index ? '#BBDEFB' : '#FFFFFF' }" 
                  @click="onClickTableRow(index)">
                  <td width="3%">
                    <v-icon 
                      v-if="village.isPrivate == true"
                      :small="$viewport.width < 450"
                      >mdi-lock
                    </v-icon>
                  </td>
                  <td width="60%">{{ village.roomName }}</td>
                  <td>{{ village.numberOfParticipants }} / {{ village.roomCapacity }}</td>
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
                      @click="enterVillage(index)">
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
                <tr v-for="village in ongoingVillages">
                  <td width="3%">
                    <v-icon 
                      v-if="village.isPrivate == true"
                      :small="$viewport.width < 450"
                      >mdi-lock
                    </v-icon>
                  </td>
                  <td width="60%">{{ village.roomName }}</td>
                  <td>{{ village.numberOfParticipants }}</td>
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
                <tr v-for="village in closedVillages">
                  <td width="3%">
                    <v-icon 
                      v-if="village.isPrivate == true"
                      :small="$viewport.width < 450">
                      mdi-lock
                    </v-icon>
                  </td>
                  <td width="60%">{{ village.roomName }}</td>
                  <td>{{ village.numberOfParticipants }}</td>
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

  import DialogVillage from '@/components/DialogVillage'

  export default {
    components: {
      DialogVillage,
    },
    data() {
      return {
        tabs: 0,
        clickedTableRow: null,
        newVillages: [],
        ongoingVillages: [],
        closedVillages: [],
        newVillageIds: [],
        ongoingVillageIds: [],
        closedVillageIds: [],
      }
    },
    methods: {
      ...mapActions([
        'enterRoom',
      ]),
      onClickTableRow(index) {
        this.clickedTableRow = index
      },
      enterVillage(index) {
        var db = firebase.firestore()
        var roomId = this.newVillageIds[index]
        var room = db.collection('rooms').doc(roomId)

        room.update({
          numberOfParticipants: firebase.firestore.FieldValue.increment(1),
        })

        room.collection('players').doc(firebase.auth().currentUser.uid).set({
          playerId: firebase.auth().currentUser.uid,
          role: '',
          name: 'Test Player2',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        })
        .then(() => {
          this.enterRoom(roomId)
          this.$router.push({
            name: 'game',
          })
        })
      },
      updateVillageList() {
        this.newVillages = []
        this.ongoingVillages = []
        this.closedVillages = []

        const that = this
        var db = firebase.firestore()

        // Get rooms
        db.collection('rooms').get()
          .then(function(querySnapShot) {
            querySnapShot.forEach(function(doc) {
              if (doc.data().status == 'new') {
                that.newVillages.push(doc.data())
                that.newVillageIds.push(doc.id)
              }
              else if (doc.data().status == 'ongoing') {
                that.ongoingVillages.push(doc.data())
                that.ongoingVillageIds.push(doc.id)
              }
              else {
                that.closedVillages.push(doc.data())
                that.closedVillageIds.push(doc.id)
              }
            })
          })        
      },
    },
    mounted() {
      this.updateVillageList()
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
