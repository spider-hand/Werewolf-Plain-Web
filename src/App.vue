<template>
  <v-app>
    <component :is="headerComponent" />
    <router-view />
    <component :is="footerComponent" />
  </v-app>
</template>

<script lang="ts">
  import { defineComponent, computed, onMounted, } from '@vue/composition-api'

  import Header from '@/components/bar/Header.vue'
  import HeaderMobile from '@/components/bar/HeaderMobile.vue'
  import HeaderGame from '@/components/bar/HeaderGame.vue'
  import Footer from '@/components/footer/Footer.vue'
  
  export default defineComponent({
    name: 'App',

    components: {
      'headerDefault': Header,
      'headerMobile': HeaderMobile,
      'headerGame': HeaderGame,
      'footerDefault': Footer,
    },

    setup(props, context) {
      const store = context.root.$store
      const viewport = context.root.$viewport

      const headerComponent = computed<string | null>(() => {
        const route = context.root.$route
        switch (route.name) {
          case 'sign-in':
          case 'sign-up':
          case 'password-reset':
          case 'password-confirm':
          case 'email-verify':
          case 'auth-action':
          case 'account-delete':
            return null
          case 'game':
            return 'headerGame'
          default:
            if (viewport.width >= 450) {
              return 'headerDefault'
            } else {
              return 'headerMobile'
            }
        }
      })

      const footerComponent = computed<string | null>(() => {
        const route = context.root.$route
        switch (route.name) {
          case 'about':
            return 'footerDefault'
          default:
            return null
        }
      })

      return {
        headerComponent,
        footerComponent,
      }
    }
  })
</script>

<style lang="scss">
  .page {
    position: relative;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background-color: $black1;
  }
</style>