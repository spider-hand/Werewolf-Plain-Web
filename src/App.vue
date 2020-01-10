<template>
  <v-app>
    <Title :title="$t('Title.title')" />
    <Header 
      v-if="$route.name != 'game'"
      @updateSettings="updateSettings" />
    <HeaderGame
      v-else
      :room="room"
      :myself="myself"
      :isJoiningThisGame="isJoining" />
    <router-view 
      :gameName="gameName"
      :avatar="avatar"
      @updateRoom="updateRoom"
      @updateMyself="updateMyself"
      @isJoiningThisGame="isJoiningThisGame" />
  </v-app>
</template>

<script>
  import Title from '@/components/Title'
  import Header from '@/components/Header'
  import HeaderGame from '@/components/HeaderGame'

  export default {
    components: {
      Title,
      Header,
      HeaderGame,
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