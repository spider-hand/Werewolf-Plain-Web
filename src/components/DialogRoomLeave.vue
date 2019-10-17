<template>
  <v-dialog
    persistent
    :fullscreen="$viewport.width < 450"
    v-model="dialog"
    max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn 
        text
        v-on="on">Leave</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span>Leave Room</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <span>Are you sure you want to leave this room?</span>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          depressed
          @click="leaveRoom">OK</v-btn>
        <v-btn
          depressed
          @click="cancel">CANCEL</v-btn>
      </v-card-actions>
    </v-card> 
  </v-dialog>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'
  import { mapActions } from 'vuex'

  export default {
    data() {
      return {
        dialog: false,
      }
    },
    methods: {
      ...mapActions([
        'leaveGame',
      ]),
      leaveRoom() {
        // Remove the player's document from the collection
        var db = firebase.firestore()
        var docRef = db.collection('rooms').doc(this.$store.state.game.roomId)

        docRef.update({
          numberOfParticipants: firebase.firestore.FieldValue.increment(-1),
        })

        docRef.collection('players').doc(firebase.auth().currentUser.uid).delete()
            .then(() => {
              // Remove the roomId from local storage
              this.leaveGame()
              this.$router.push({
                name: 'room-list',
              })
            })
      },
      cancel() {
        this.dialog = false
      }
    }
  }
</script>

<style scoped>
  
</style>
