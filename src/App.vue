<template>
  <v-app>
    <Header :room="room" />
    <router-view @updateRoom="updateRoom" />
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
      }
    },
    methods: {
      updateRoom(room) {
        this.room = room
      }
    }
  }
</script>

<style>
  * {
    text-transform: none !important;
  }
</style>