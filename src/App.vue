<template>
  <v-app>
    <Header 
      :room="room"
      :myself="myself"
      :isJoiningThisGame="isJoining"
      @updateSettings="updateSettings" />
    <router-view 
      :gameName="gameName"
      :avatar="avatar"
      @updateRoom="updateRoom"
      @updateMyself="updateMyself"
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
        myself: null,
        isJoining: false,
        gameName: '',
        avatar: '',
      }
    },
    methods: {
      updateRoom(room) {
        this.room = room
      },
      updateMyself(myself) {
        this.myself = myself
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