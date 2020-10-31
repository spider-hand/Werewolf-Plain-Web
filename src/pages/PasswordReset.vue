<template>
  <div id="page">
    <v-container
      class="password-reset-form-container"
      fill-height
      fluid>
      <v-row>
        <div class="password-reset-form-wrapper">
          <form 
            class="password-reset-form-group"
            @submit.prevent="validate">
            <div class="input-wrapper">
              <label 
                class="input-label"
                :class="{ 'text-error': hasEmailError }">EMAIL</label>
              <label 
                class="input-label ml-2"
                :class="{ 'text-error': hasEmailError }">{{ state.emailErrorMessage }}</label>              
              <input 
                class="password-reset-input"
                :class="{ 'input-error': hasEmailError }"
                type="email" 
                name="email"
                v-model="state.email">
            </div>
            <div class="btn-wrapper">
              <button class="password-reset-btn">SEND RESET LINK</button>
            </div>
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

  export default defineComponent({
    setup(props, context) {
      const router = context.root.$router

      const state = reactive<{
        email: string,
        emailErrorMessage: string,
      }>({
        email: '',
        emailErrorMessage: '',
      })

      const hasEmailError = computed<boolean>(() => {
        return state.emailErrorMessage !== ''
      })

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
        hasEmailError,
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

  .password-reset-form-wrapper {
    width: 500px;
    border-radius: 3px;
    background-color: $black3;
    margin: auto;
  }
  .form-title {
    font-size: 20px;
    font-weight: 700;
    color: $white;
  }

  .input-wrapper, .btn-wrapper {
    width: 100%;
    position: relative;
    padding: 0 25px 0 25px;
    margin: 30px 0 30px 0;
  }

  .input-label {
    color: $gray3;
    font-size: 12px;
    font-weight: 500;
  }

  .password-reset-input {
    font-size: 16px;
    width: 100%;
    height: 45px;
    color: $white;
    background-color: $black4;
    border-radius: 3px;
    border: 1.5px solid $black5;
    padding: 0 10px 0 10px;
  }

  .password-reset-input:focus {
    outline: none;
  }

  .password-reset-btn {
    font-size: 16px;
    width: 100%;
    height: 50px;
    background-color: $red1;
    color: $white;
    border-radius: 3px;
  }

  .text-error {
    color: $red1;
  }

  .input-error {
    border: 1.5px solid $red1;
  }

  @media(max-width: 450px) {
    .password-reset-form-wrapper {
      width: 100%;
      margin: 0 10px 0 10px;
    }

    .input-wrapper, .btn-wrapper {
      padding: 0 15px 0 15px;
      margin: 15px 0 20px 0;
    }
  }
</style>