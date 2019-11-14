<template>
  <v-app>
    <Header 
      :room="room"
      :isJoiningThisGame="isJoining" />
    <router-view 
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
      }
    },
    methods: {
      updateRoom(room) {
        this.room = room
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