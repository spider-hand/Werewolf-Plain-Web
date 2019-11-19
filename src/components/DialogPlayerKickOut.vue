<template>
  <v-dialog
    persistent
    :fullscreen="$viewport.width < 450"
    v-model="dialog"
    max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn 
        icon
        v-on="on">
        <v-icon>mdi-cancel</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span>Kick this player out</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <span>Are you sure you want to kick this player out?</span>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          depressed
          @click="kickOut">OK</v-btn>
        <v-btn
          depressed
          @click="cancel">CANCEL</v-btn>
      </v-card-actions>
    </v-card> 
  </v-dialog>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/firestore'

  export default {
    props: [
      'uid',
    ],
    data() {
      return {
        dialog: false,
      }
    },
    methods: {
      kickOut() {
        // Remove the selected player's document from the collection
        var db = firebase.firestore()
        var docRef = db.collection('rooms').doc(this.$route.params.id)

        docRef.collection('players').doc(this.uid).delete()
          .then(() => {
            docRef.update({
              numberOfParticipants: firebase.firestore.FieldValue.increment(-1),
              banList: firebase.firestore.FieldValue.arrayUnion(this.uid),
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
