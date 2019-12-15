<template>
  <v-dialog
    :fullscreen="$viewport.width < 450"
    v-model="dialog"
    v-if="room != null"
    max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn 
        icon
        v-on="on">
        <v-icon color="#757575">mdi-information</v-icon>
      </v-btn>
    </template>
    <v-card color="#36393F">
      <v-card-title>
        <v-icon v-if="room.isPrivate == true">mdi-lock</v-icon>
        <span>{{ room.name }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <div class="room-description">
            <span>{{ room.description }}</span>
          </div>
          <v-divider></v-divider>
          <v-row>
            <v-col cols="3">
              <span>
                <strong>Day: {{ room.dayLength }} minutes</strong>
              </span>
            </v-col>
            <v-col cols="3">
              <span>
                <strong>Night: {{ room.nightLength }} minutes</strong>
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0 pb-0">
              <span>
                <strong>Capacity: {{ room.capacity }}</strong>
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0 pb-0">
              <span>{{ getCastDetails }}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          depressed
          color="#2F3136"
          @click="close">
          <span>CLOSE</span>
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
      'room',
    ],
    data() {
      return {
        dialog: false,
      }
    },
    computed: {
      getCastDetails() {
        switch (this.room.capacity) {
          case 5:
            return '(Villager: 3 / Wolf: 1 / Seer: 1)'
          case 9:
            return '(Villager: 4 / Wolf: 2 / Seer: 1 / Knight: 1 / Minion: 1)'
          case 11:
            return '(Villager: 5 / Wolf: 2 / Seer: 1 / Medium: 1 / Knight: 1 / Minion: 1)'
          case 15:
            return '(Villager: 8 / Wolf: 3 / Seer: 1 / Medium: 1 / Knight: 1 / Minion: 1)'
        }
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
  span {
    color: #FFFFFF;
  }

  .room-description {
    white-space: pre-wrap;
  }
</style>
