<template>
  <v-app>
    <Header />
    <router-view />
  </v-app>
</template>

<script>
  import Header from '@/components/Header'

  export default {
    components: {
      Header,
    }
  }
</script>

<style>
  * {
    text-transform: none !important;
  }
</style>