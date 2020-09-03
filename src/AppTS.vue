<template>
  <v-app>
  	<Header v-if="$route.name != 'game'" />
  	<HeaderGame v-else />

    <router-view />
  </v-app>
</template>

<script lang="ts">
  import { defineComponent } from '@vue/composition-api'

  import Header from '@/components/bar/HeaderTS.vue'
  import HeaderGame from '@/components/bar/HeaderGameTS.vue'

  export default defineComponent({
    name: 'App',
    components: {
    	Header,
    	HeaderGame,
    }
  })
</script>

<style scoped>
  
</style>