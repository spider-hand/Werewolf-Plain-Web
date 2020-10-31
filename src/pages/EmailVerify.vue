<template>
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
</template>

<script lang="ts">
  import { defineComponent, reactive, onMounted, } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth' 

  export default defineComponent({

    props: {
      mode: {
        type: String,
        required: true,
      },
      actionCode: {
        type: String,
        required: true,
      },
      lang: {
        type: String,
        required: true,
      }
    },

    setup(props, context) {
      const auth = firebase.auth()

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
        handleVerifyEmail(auth, props.actionCode, props.lang)
      })

      return {
        state,
      }
    }
  })
</script>

<style lang="scss" scoped>
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
