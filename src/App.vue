<template>
  <v-app>
    <Header 
      :room="room"
      :isJoiningThisGame="flag" />
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
        flag: false,
      }
    },
    methods: {
      updateRoom(room) {
        this.room = room
      },
      isJoiningThisGame(flag) {
        this.flag = flag
      },
    }
  }
</script>

<style>
  * {
    text-transform: none !important;
  }
</style>