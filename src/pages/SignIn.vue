<template>
  <div id="page">
    <v-container 
      class="sign-in-form-container"
      fill-height
      fluid>
      <v-row>
        <div class="sign-in-form-wrapper">
          <form 
            class="sign-in-form-group"
            @submit.prevent="validate">
            <div class="input-wrapper">
              <label 
                class="input-label"
                :class="{ 'text-error': hasEmailError }">EMAIL</label>
              <label 
                class="input-label ml-2"
                :class="{ 'text-error': hasEmailError }">{{ state.emailErrorMessage }}</label>
              <input 
                class="sign-in-input"
                :class="{ 'input-error': hasEmailError }"
                type="email" 
                name="email"
                v-model="state.email">
            </div>
            <div class="input-wrapper">
              <label 
                class="input-label"
                :class="{ 'text-error': hasPasswordError }">PASSWORD</label>
              <label 
                class="input-label ml-2"
                :class="{ 'text-error': hasPasswordError }">{{ state.passwordErrorMessage }}</label>
              <input 
                class="sign-in-input"
                :class="{ 'input-error': hasPasswordError }"
                type="password" 
                name="password"
                v-model="state.password">
              <router-link
                class="password-reset-link" 
                to="/password/reset">
                Forgot your password?
              </router-link>
            </div>
            <div class="btn-wrapper">
              <button 
                class="sign-in-btn"
                type="submit">SIGN IN</button>
            </div>
          </form>
        </div>
        <v-col cols="12">
          <div 
            class="sign-up-link-wrapper"
            align="center"
            justify="center">
            <span>Don't have an account? </span>
            <router-link
              class="sign-up-link"
              to="/sign-up">
              Sign up
            </router-link>
          </div>
        </v-col>
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

      const required = "This field is required."
      const emailDoesNotMatch = "Email does not match."
      const passwordDoesNotMatch = "Password does not match."

      const state = reactive<{
        email: string,
        password: string,
        emailErrorMessage: string,
        passwordErrorMessage: string,
      }>({
        email: '',
        password: '',
        emailErrorMessage: '',
        passwordErrorMessage: '',
      })

      const hasEmailError = computed<boolean>(() => {
        return state.emailErrorMessage !== ''
      })

      const hasPasswordError = computed<boolean>(() => {
        return state.passwordErrorMessage !== ''
      })

      function validate(): void {
        if (state.email === '' || state.password === '') {
          if (state.email === '') {
            state.emailErrorMessage = required
          }
          if (state.password === '') {
            state.passwordErrorMessage = required
          }
        } else {
          signInWithEmailAndPassword()
        }
      }

      function signInWithEmailAndPassword(): void {
        firebase.auth().signInWithEmailAndPassword(state.email, state.password)
          .then(() => {
            router.push({
              name: 'room-list',
            })
          })
          .catch((err) => {
            console.log(err)

            state.emailErrorMessage = emailDoesNotMatch
            state.passwordErrorMessage = passwordDoesNotMatch
          })
      }

      return {
        state,
        hasEmailError,
        hasPasswordError,
        validate,
        signInWithEmailAndPassword,
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

  .sign-in-form-wrapper {
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

  .sign-in-input {
    font-size: 16px;
    width: 100%;
    height: 45px;
    color: $white;
    background-color: $black4;
    border-radius: 3px;
    border: 1.5px solid $black5;
    padding: 0 10px 0 10px;
  }

  .sign-in-input:focus {
    outline: none;
  }

  .sign-in-btn {
    font-size: 16px;
    width: 100%;
    height: 50px;
    background-color: $red1;
    color: $white;
    border-radius: 3px;
  }

  .sign-up-link {
    font-size: 14px;
    font-weight: 500;
    color: $white;
    text-decoration: none;
  }

  .sign-up-link-wrapper {
    margin: 0 0 5px 30px;
  }

  .sign-up-link-wrapper span {
    font-size: 14px;
    color: $gray1;
  }

  .password-reset-link {
    font-size: 14px;
    font-weight: 400;
    color: $gray3;
    text-decoration: none;
  }

  .text-error {
    color: $red1;
  }

  .input-error {
    border: 1.5px solid $red1;
  }
</style>