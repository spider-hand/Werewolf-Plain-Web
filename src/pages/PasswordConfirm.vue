<template>
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
            :label="'NEW PASSWORD'" 
            :type="'password'"
            :errorMessage="state.passwordErrorMessage"
            :eventName="'onNewPasswordChanged'"
            @onNewPasswordChanged="onNewPasswordChanged" />
          <TextField
            :label="'CONFIRM PASSWORD'" 
            :type="'password'"
            :errorMessage="state.passwordErrorMessage"
            :eventName="'onConfirmPasswordChanged'"
            @onConfirmPasswordChanged="onConfirmPasswordChanged" />
          <FormButton :text="'RESET PASSWORD'" />
        </form>
      </div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { defineComponent, reactive, computed, onMounted, } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth'

  import TextField from '@/components/forms/TextField.vue'
  import FormButton from '@/components/forms/FormButton.vue'

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

    components: {
      TextField,
      FormButton,
    },

    setup(props, context) {
      const router = context.root.$router
      const auth = firebase.auth()

      const state = reactive<{
        newPassword: string,
        confirmPassword: string,
        passwordErrorMessage: string,
      }>({
        newPassword: '',
        confirmPassword: '',
        passwordErrorMessage: '',
      })

      function onNewPasswordChanged(val: string): void {
        state.newPassword = val
      }

      function onConfirmPasswordChanged(val: string): void {
        state.confirmPassword = val
      }

      function handleResetPassword(auth: firebase.auth.Auth, actionCode: string, lang: string): void {
        auth.verifyPasswordResetCode(actionCode)
          .then((email) => {

          })
          .catch((err) => {
            // Invalid or expired action code.
            state.passwordErrorMessage = "This credential is invalid or has been expired."
          })
      }

      function validate(): void {
        // Check if the new passwords are the same
        if (state.newPassword !== state.confirmPassword) {
          state.passwordErrorMessage = "Password does not match."
        } else {
          confirmPasswordReset()
        }
      }

      function confirmPasswordReset(): void {
        auth.confirmPasswordReset(props.actionCode, state.newPassword)
          .then((resp) => {
            router.push({
              name: 'sign-in',
              params: {
                snackbarText: 'Your password has been reset.',
              }
            })
          })
          .catch((err) => {
            if (err.code === 'auth/expired-action-code' || err.code === 'auth/invalid-action-code') {
              state.passwordErrorMessage = "This credential is invalid or has been expired."
            } else if (err.code === 'auth/user-not-found' || err.code === 'auth/user-disabled') {
              state.passwordErrorMessage = "This user can not be found."
            } else if (err.code === 'auth/weak-password') {
              state.passwordErrorMessage = "This password is too weak."
            }
          })
      }

      onMounted(() => {
        handleResetPassword(auth, props.actionCode, props.lang)     
      })

      return {
        state,
        onNewPasswordChanged,
        onConfirmPasswordChanged,
        validate,
      }
    }
  })
</script>

<style lang="scss" scoped>
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
