<template>
  <v-dialog
    :fullscreen="$viewport.width < 450"
    v-model="dialog"
    v-if="room != null"
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
            <v-col cols="3">
              <strong>Day: {{ room.dayLength }} minutes</strong>
            </v-col>
            <v-col cols="3">
              <strong>Night: {{ room.nightLength }} minutes</strong>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0 pb-0">
              <strong>Capacity: {{ room.capacity }}</strong>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0 pb-0">
              <span v-if="room.capacity == 5">
                (Villager: 3 / Wolf: 1 / Seer: 1)
              </span>
              <span v-if="room.capacity == 9">
               (Villager: 4 / Wolf: 2 / Seer: 1 / Doctor: 1 / Minion: 1)
              </span>
              <span v-if="room.capacity == 11">
                (Villager: 5 / Wolf: 2 / Seer: 1 / Medium: 1 / Doctor: 1 / Minion: 1)
              </span>
              <span v-if="room.capacity == 15">
                (Villager: 8 / Wolf: 3 / Seer: 1 / Medium: 1 / Doctor: 1 / Minion: 1)
              </span>
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
    props: [
      'room',
    ],
    data() {
      return {
        dialog: false,
      }
    },
    methods: {
      close() {
        this.dialog = false
      }
    },
  }
</script>

<style scoped>
  .room-description {
    white-space: pre-wrap;
  }
</style>
