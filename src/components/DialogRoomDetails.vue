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
        <v-icon 
          v-if="room.isPrivate == true"
          color="#757575">mdi-lock</v-icon>
        <span>{{ room.name }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <div class="room-description">
            <span>{{ room.description }}</span>
          </div>
          <v-row>
            <v-col cols="4">
              <span>
                <strong>{{ $t('DialogDetails.daytime') }}: {{ room.dayLength }} {{ $t('DialogDetails.minutes') }}</strong>
              </span>
            </v-col>
            <v-col cols="4">
              <span>
                <strong>{{ $t('DialogDetails.night') }}: {{ room.nightLength }} {{ $t('DialogDetails.minutes')}}</strong>
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0 pb-0">
              <span>
                <strong>{{ $t('DialogDetails.capacity') }}: {{ room.capacity }}</strong>
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0 pb-0">
              <span v-if="room.capacity == 5">{{ $t('DialogDetails.fivePlayerVillage') }}</span>
              <span v-if="room.capacity == 9">{{ $t('DialogDetails.ninePlayerVillage') }}</span>
              <span v-if="room.capacity == 11">{{ $t('DialogDetails.elevenPlayerVillage') }}</span>
              <span v-if="room.capacity == 15">{{ $t('DialogDetails.fifteenPlayerVillage') }}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          text
          @click="close">
          <span>{{ $t('DialogDetails.close') }}</span>
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

  .v-card__text span {
    color: #DCDDDE;
  }

  .room-description {
    white-space: pre-wrap;
  }
</style>
