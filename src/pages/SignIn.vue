<template>
  <div class="page">
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
            <FormButton :text="'SIGN IN'" />
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
      <Snackbar :text="props.snackbarText" />
    </v-container>
  </div>
</template>

<script lang="ts">
  import { defineComponent, reactive, computed, } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth'

  import Snackbar from '@/components/snackbar/Snackbar.vue'
  import TextField from '@/components/forms/TextField.vue'
  import FormButton from '@/components/forms/FormButton.vue'

  export default defineComponent({
    props: {
      snackbarText: {
        type: String,
        required: false,
      }
    },

    components: {
      Snackbar,
      TextField,
      FormButton,
    },

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

      const hasPasswordError = computed<boolean>(() => {
        return state.passwordErrorMessage !== ''
      })

      function onEmailChanged(val: string): void {
        state.email = val
      }

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
            state.emailErrorMessage = emailDoesNotMatch
            state.passwordErrorMessage = passwordDoesNotMatch
          })
      }

      return {
        props,
        state,
        hasPasswordError,
        onEmailChanged,
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

  .input-wrapper {
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

  .text-error {
    color: $red1;
  }

  .input-error {
    border: 1.5px solid $red1;
  }

  .sign-up-link {
    font-size: 14px;
    font-weight: 500;
    color: $white;
    text-decoration: none;
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

  @media(max-width: 450px) {
    .form-wrapper {
      width: 100%;
      margin: 0 10px 0 10px;
    }

    .input-wrapper {
      padding: 0 15px 0 15px; 
    }
  }
</style>