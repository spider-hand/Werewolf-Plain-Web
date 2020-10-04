<template>
  <div id="page">
    <v-container
      fill-height
      fluid>
      <v-card 
        class="message-wrapper"
        flat>
        <v-card-title class="message-title">
          <span>{{ state.title }}</span>
        </v-card-title>
        <v-card-text class="message-text">
          <span>{{ state.text }}</span>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, onMounted, } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth' 

  export default defineComponent({

    setup(props, context) {

      const state = reactive<{
        title: string,
        text: string,
      }>({
        title: '',
        text: '',
      })

      function handleVerifyEmail(auth: firebase.auth.Auth, actionCode: string, lang: string): void {
        auth.applyActionCode(actionCode)
          .then((resp) => {
            showSuccessMessage()
          })
          .catch((err) => {
            showFailedMessage()
          })
      }

      function showSuccessMessage(): void {
        state.title = "Your email has been verified"
        state.text = "You can now join a game!"
      }

      function showFailedMessage(): void {
        state.title = "Something went wrong"
        state.text = "The credential is invalid or the verification link has been expired."     
      }

      onMounted(() => {
        const auth = firebase.auth()

        const urlParams = new URLSearchParams(window.location.search)
        const mode = urlParams.get('mode') || ''
        const actionCode = urlParams.get('oobCode') || ''
        const lang = urlParams.get('lang') || 'en'

        if (mode === 'verifyEmail') {
          handleVerifyEmail(auth, actionCode, lang)
        } else {
          showFailedMessage()
        }
      })

      return {
        state,
        handleVerifyEmail,
      }
    }
  })
</script>

<style lang="scss" scoped>
  #page {
    position: relative;
    height: 100%;
    background-color: $black1;
  } 

  .message-wrapper {
    background-color: $black3;
    min-height: 150px;
    min-width: 400px;
    margin: auto;
  }

  .message-title span {
    color: $white;
    font-size: 18px;
    font-weight: 500;
  }

  .message-text span {
    color: $gray4;
  }
</style>
