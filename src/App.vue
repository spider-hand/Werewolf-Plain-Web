<template>
  <v-app>
    <Header />
    <Home />
  </v-app>
</template>

<script>
  import Home from '@/components/Home'
  import Header from '@/components/Header'

  export default {
    components: {
      Header,
      Home,
    }
  }
</script>

<style>
  * {
    text-transform: none !important;
  }
</style>