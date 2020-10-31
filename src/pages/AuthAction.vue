<template>
  <div id="page">
    <component 
      :is="authActionComponent"
      :mode="mode"
      :actionCode="actionCode"
      :lang="lang" />
  </div>
</template>

<script lang="ts">
  import { defineComponent, computed, } from '@vue/composition-api'

  import EmailVerify from '@/pages/EmailVerify.vue'
  import PasswordConfirm from '@/pages/PasswordConfirm.vue'

  export default defineComponent({

    components: {
      'emailVerify': EmailVerify,
      'passwordConfirm': PasswordConfirm,
    },

    setup(props, context) {
      const urlParams = new URLSearchParams(window.location.search)

      const mode = computed<string>(() => {
        return urlParams.get('mode') || ''
      })

      const actionCode = computed<string>(() => {
        return urlParams.get('oobCode') || ''
      })

      const lang = computed<string>(() => {
        return urlParams.get('lang') || 'en'
      })      

      const authActionComponent = computed<string | null>(() => {
        switch (mode.value) {
          case 'resetPassword':
            return 'passwordConfirm'
          case 'verifyEmail':
            return 'emailVerify'
          default:
            return null
        }
      })

      return {
        mode,
        actionCode,
        lang,
        authActionComponent,
      }
    }
  })
</script>

<style lang="scss" scoped>
  #page {
    position: relative;
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    background-color: $black1;
  }
</style>