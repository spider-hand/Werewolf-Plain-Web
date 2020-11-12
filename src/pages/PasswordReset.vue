<template>
  <div id="page">
    <v-container
      class="form-container"
      fill-height
      fluid>
      <v-row>
        <div class="form-wrapper">
          <form 
            class="form-group"
            @submit.prevent="validate">
            <TextField
              :label="'EMAIL'" 
              :type="'email'"
              :errorMessage="state.emailErrorMessage"
              :eventName="'onEmailChanged'"
              @onEmailChanged="onEmailChanged" />
            <FormButton :text="'SEND RESET LINK'" />
          </form>
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, computed, } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth'

  import TextField from '@/components/forms/TextField.vue'
  import FormButton from '@/components/forms/FormButton.vue'

  export default defineComponent({
    components: {
      TextField,
      FormButton,
    },

    setup(props, context) {
      const router = context.root.$router

      const state = reactive<{
        email: string,
        emailErrorMessage: string,
      }>({
        email: '',
        emailErrorMessage: '',
      })

      function onEmailChanged(val: string): void {
        state.email = val
      }

      function validate(): void {
        if (state.email === '') {
          state.emailErrorMessage = "This field is required."
        } else {
          sendPasswordResetEmail()
        }
      }

      function sendPasswordResetEmail(): void {
        const auth = firebase.auth()

        auth.sendPasswordResetEmail(state.email)
          .then(() => {
            router.push({
              name: 'room-list',
              params: {
                snackbarText: 'Password reset email has been sent.',
              }
            })
          })
          .catch((err) => {
            if (err.code === 'auth/user-not-found') {
              state.emailErrorMessage = "This email address can not be found."
            } else if (err.code === 'auth/invalid-email') {
              state.emailErrorMessage = "This email is invalid."
            }
          })
      }

      return {
        state,
        onEmailChanged,
        validate,
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

  .form-wrapper {
    width: 500px;
    border-radius: 3px;
    background-color: $black3;
    margin: auto;
  }

  @media(max-width: 450px) {
    .form-wrapper {
      width: 100%;
      margin: 0 10px 0 10px;
    }
  }
</style>
