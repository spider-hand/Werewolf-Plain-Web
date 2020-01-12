<template>
  <v-dialog
    :fullscreen="$viewport.width < 450"
    v-model="dialog"
    v-if="room != null"
    max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn
        v-if="$parent.$options.name == 'v-app-bar'"
        icon
        v-on="on">
        <v-icon color="#757575">mdi-information</v-icon>
      </v-btn>
      <v-btn 
        v-if="$parent.$options.name == 'v-simple-table'"
        text
        :small="$viewport.width < 450"
        v-on="on">
        <span>{{ $t('DialogRoomDetails.details') }}</span>
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
                <strong>{{ $t('DialogRoomDetails.daytime') }}: {{ room.dayLength }} {{ $t('DialogRoomDetails.minutes') }}</strong>
              </span>
            </v-col>
            <v-col cols="4">
              <span>
                <strong>{{ $t('DialogRoomDetails.night') }}: {{ room.nightLength }} {{ $t('DialogRoomDetails.minutes')}}</strong>
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0 pb-0">
              <span>
                <strong>{{ $t('DialogRoomDetails.capacity') }}: {{ room.capacity }}</strong>
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col class="pt-0 pb-0">
              <span v-if="room.capacity == 5">{{ $t('DialogRoomDetails.fivePlayerVillage') }}</span>
              <span v-if="room.capacity == 9">{{ $t('DialogRoomDetails.ninePlayerVillage') }}</span>
              <span v-if="room.capacity == 11">{{ $t('DialogRoomDetails.elevenPlayerVillage') }}</span>
              <span v-if="room.capacity == 15">{{ $t('DialogRoomDetails.fifteenPlayerVillage') }}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <span>
                <strong>{{ $t('DialogRoomDetails.language') }}: {{ convertLanguageCode(room.language) }}</strong>
              </span>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          text
          @click="close">
          <span>{{ $t('DialogRoomDetails.close') }}</span>
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
      convertLanguageCode(code) {
        if (code == 'ja') {
          return this.$t('DialogRoomDetails.japanese')
        } else {
          return this.$t('DialogRoomDetails.english')
        }
      },
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
