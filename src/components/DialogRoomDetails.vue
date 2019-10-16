<template>
  <v-dialog
    :fullscreen="$viewport.width < 450"
    v-model="dialogRoomDetails"
    max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn 
        text
        v-on="on">Details</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <v-icon v-if="room.isPrivate == true">mdi-lock</v-icon>
        <span>{{ room.name }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <div class="room-description">{{ room.description }}</div>
          <v-divider></v-divider>
          <v-row>
            <v-col>
              <strong>Day: {{ room.dayLength }} minutes</strong>
            </v-col>
            <v-col>
              <strong>Night: {{ room.nightLength }} minutes</strong>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0 pb-0">
              <strong>Capacity: {{ room.capacity }}</strong>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          depressed
          @click="close">CLOSE</v-btn>
      </v-card-actions>
    </v-card> 
  </v-dialog>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/firestore'

  export default {
    data() {
      return {
        dialogRoomDetails: false,
        room: null,
      }
    },
    methods: {
      close() {
        this.dialogRoomDetails = false
      }
    },
    mounted() {
      const that = this
      var db = firebase.firestore()
      var room = db.collection('rooms').doc(this.$store.state.game.roomId)

      room.get().then(function(doc) {
        that.room = doc.data()
      })
    }
  }
</script>

<style scoped>
  .room-description {
    white-space: pre-wrap;
  }
</style>
