<template>
  <v-app>
    <Header 
      :room="room"
      :isJoiningThisGame="isJoining"
      @updateSettings="updateSettings" />
    <router-view 
      :gameName="gameName"
      :avatar="avatar"
      @updateRoom="updateRoom"
      @isJoiningThisGame="isJoiningThisGame" />
  </v-app>
</template>

<script>
  import Header from '@/components/Header'

  export default {
    components: {
      Header,
    },
    data() {
      return {
        room: null,
        isJoining: false,
        gameName: '',
        avatar: '',
      }
    },
    methods: {
      updateRoom(room) {
        this.room = room
      },
      updateSettings(gameName, avatar) {
        this.gameName = gameName
        this.avatar = avatar
      },
      isJoiningThisGame(isJoining) {
        this.isJoining = isJoining
      },
    }
  }
</script>

<style>
  * {
    text-transform: none !important;
  }
</style>