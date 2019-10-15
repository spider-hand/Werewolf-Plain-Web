<template>
  <v-dialog
    persistent
    :fullscreen="$viewport.width < 450"
    v-model="dialogVillageLeave"
    max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn 
        text
        v-on="on">Leave</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span>Leave Village</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <span>Are you sure you want to leave this village?</span>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          depressed
          @click="leaveVillage">OK</v-btn>
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

  export default {
    data() {
      return {
        dialogVillageLeave: false,
      }
    },
    methods: {
      leaveVillage() {
        // Remove the player's document from the collection
        var db = firebase.firestore()
        var room = db.collection('rooms').doc(this.$route.params.roomId)

        room.update({
          numberOfParticipants: firebase.firestore.FieldValue.increment(-1),
        })

        room.collection('players').doc(firebase.auth().currentUser.uid).delete()
            .then(() => {
              this.$router.push({
                name: 'village-list',
              })
            })
      },
      cancel() {
        this.dialogVillageLeave = false
      }
    }
  }
</script>

<style scoped>
  
</style>
