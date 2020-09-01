<template>
  <v-app>
  	<Header />
    <router-view />
  </v-app>
</template>

<script lang="ts">
  import { defineComponent } from '@vue/composition-api'

  import Header from '@/components/bar/HeaderTS.vue'

  export default defineComponent({
    name: 'App',
    components: {
    	Header,
    }
  })
</script>

<style scoped>
  
</style>