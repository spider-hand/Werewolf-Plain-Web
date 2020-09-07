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
            @submit.prevent="signInWithEmailAndPassword">
            <div class="input-wrapper">
              <label class="input-label">EMAIL</label>
              <input 
                class="sign-in-input" 
                type="email" 
                name="email"
                v-model="state.email">
            </div>
            <div class="input-wrapper">
              <label class="input-label">PASSWORD</label>
              <input 
                class="sign-in-input" 
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
  import { defineComponent, reactive, } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth'

  export default defineComponent({

    setup(props, context) {
      const router = context.root.$router

      const state = reactive<{
        email: string,
        password: string,
      }>({
        email: '',
        password: '',
      })

      function signInWithEmailAndPassword(): void {
        firebase.auth().signInWithEmailAndPassword(state.email, state.password)
          .then(() => {
            router.push({
              name: 'room-list',
            })
          })
          .catch((err) => {
            console.log(err)
            // TODO: Show an error (Username and password do not match.)
          })
      }

      return {
        state,
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
</style>