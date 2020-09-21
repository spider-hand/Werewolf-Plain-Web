<template>
  <v-app>
    <component :is="headerComponent" />
    <router-view />
  </v-app>
</template>

<script lang="ts">
  import { defineComponent, computed, } from '@vue/composition-api'

  import Header from '@/components/bar/Header.vue'
  import HeaderGame from '@/components/bar/HeaderGame.vue'

  export default defineComponent({
    name: 'App',

    components: {
    	'headerDefault': Header,
    	'headerGame': HeaderGame,
    },

    setup(props, context) {
      const headerComponent = computed<string | null>(() => {
        const route = context.root.$route
        switch (route.name) {
          case 'sign-in':
          case 'sign-up':
          case 'password-reset':
          case 'password-confirm':
            return null
          case 'game':
            return 'headerGame'
          default:
            return 'headerDefault'
        }
      })

      return {
        headerComponent,
      }
    }
  })
</script>

<style scoped>
  
</style>