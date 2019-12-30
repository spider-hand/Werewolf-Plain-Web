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
        <v-icon color="#757575">mdi-cancel</v-icon>
      </v-btn>
    </template>
    <v-card color="#36393F">
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
          text
          @click="kickOut">
          <span>OK</span>
        </v-btn>
        <v-btn
          text
          @click="cancel">
          <span>CANCEL</span>
        </v-btn>
      </v-card-actions>
    </v-card> 
  </v-dialog>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/firestore'

  export default {
    props: [
      'player',
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

        docRef.collection('messages').add({
          from: 'host',
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          body: ` ${this.player.name} was kicked out.`,
          gameName: '',
          avatar: '',
        })
        .then(() => {
          docRef.collection('players').doc(this.player.id).delete()
            .then(() => {
              docRef.update({
                numberOfParticipants: firebase.firestore.FieldValue.increment(-1),
                banList: firebase.firestore.FieldValue.arrayUnion(this.player.id),
              })
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
  span {
    color: #FFFFFF;
  }

  .v-card__text span {
    color: #DEDDDE;
  }
</style>
