<template>
  <div id="page">
    <v-container
      class="password-confirm-form-container"
      fill-height
      fluid>
      <v-row>
        <div class="password-confirm-form-wrapper">
          <form 
            class="password-confirm-form-group"
            @submit.prevent="validate">
            <div class="input-wrapper">
              <label 
                class="input-label"
                :class="{ 'text-error': hasPasswordError }">NEW PASSWORD</label>
              <label 
                class="input-label ml-2"
                :class="{ 'text-error': hasPasswordError }">{{ state.passwordErrorMessage }}</label>
              <input 
                class="password-confirm-input"
                :class="{ 'input-error': hasPasswordError }"
                type="password" 
                name="new-password"
                v-model="state.newPassword">
            </div>
            <div class="input-wrapper">
              <label 
                class="input-label"
                :class="{ 'text-error': hasPasswordError }">CONFIRM PASSWORD</label>
              <label 
                class="input-label ml-2"
                :class="{ 'text-error': hasPasswordError }">{{ state.passwordErrorMessage }}</label>
              <input 
                class="password-confirm-input" 
                :class="{ 'input-error': hasPasswordError }"
                type="password" 
                name="confirm-password"
                v-model="state.confirmPassword">
            </div>
            <div class="btn-wrapper">
              <button class="password-confirm-btn">RESET PASSWORD</button>
            </div>
          </form>
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, computed, onMounted, } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth'

  export default defineComponent({

    setup(props, context) {
      const auth = firebase.auth()
      const urlParams = new URLSearchParams(window.location.search)

      const state = reactive<{
        newPassword: string,
        confirmPassword: string,
        passwordErrorMessage: string,
      }>({
        newPassword: '',
        confirmPassword: '',
        passwordErrorMessage: '',
      })

      const mode = computed<string>(() => {
        return urlParams.get('mode') || ''
      })

      const actionCode = computed<string>(() => {
        return urlParams.get('oobCode') || ''
      })

      const lang = computed<string>(() => {
        return urlParams.get('lang') || 'en'
      })

      const hasPasswordError = computed<boolean>(() => {
        return state.passwordErrorMessage !== ''
      })

      function handleResetPassword(auth: firebase.auth.Auth, actionCode: string, lang: string): void {
        auth.verifyPasswordResetCode(actionCode).then((email) => {

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
        auth.confirmPasswordReset(actionCode, state.newPassword).then((resp) => {

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
        if (mode === 'resetPassword') {
          handleResetPassword(auth, actionCode, lang)
        } else {
          state.passwordErrorMessage = "This credential is invalid or has been expired."
        }        
      })

      return {
        auth,
        urlParams,
        state,
        mode,
        actionCode,
        lang,
        hasPasswordError,
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

  .password-confirm-form-wrapper {
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

  .password-confirm-input {
    font-size: 16px;
    width: 100%;
    height: 45px;
    color: $white;
    background-color: $black4;
    border-radius: 3px;
    border: 1.5px solid $black5;
    padding: 0 10px 0 10px;
  }

  .password-confirm-input:focus {
    outline: none;
  }

  .password-confirm-btn {
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
</style>
