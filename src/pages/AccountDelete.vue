<template>
  <div id="page">
    <v-container 
      class="delete-account-form-container"
      fill-height
      fluid>
      <v-row>
        <div class="delete-account-form-wrapper">
          <form 
            class="delete-account-form-group"
            @submit.prevent="validate">
            <div class="input-wrapper">
              <label 
                class="input-label"
                :class="{ 'text-error': hasEmailError }">EMAIL</label>
              <label 
                class="input-label ml-2"
                :class="{ 'text-error': hasEmailError }">{{ state.emailErrorMessage }}</label>
              <input 
                class="delete-account-input"
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
                class="delete-account-input"
                :class="{ 'input-error': hasPasswordError }"
                type="password" 
                name="password"
                v-model="state.password">
            </div>
            <div class="btn-wrapper">
              <button 
                class="delete-account-btn"
                type="submit">DELETE ACCOUNT</button>
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
  import 'firebase/firestore'
  import 'firebase/storage'
  import { User as FirebaseUser } from 'firebase'

  export default defineComponent({

    setup(props, context) {
      const router = context.root.$router
      const store = context.root.$store

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

      const user = computed<FirebaseUser | null>(() => {
        return store.getters.user
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
          deleteAccount()
        }
      }

      function deleteAccount(): void {
        const credentials = firebase.auth.EmailAuthProvider.credential(state.email, state.password)

        if (user.value) {
          user!.value!.reauthenticateWithCredential(credentials)
            .then((credential) => {
              // Delete the account if the email and the password are correct
              const db = firebase.firestore()
              const docRef = db.collection('users').doc(credential!.user!.uid)

              docRef.delete().then(() => {
                // Delete an avatar associated with the user
                const storage = firebase.storage()
                const storageRef = storage.ref('avatars/' + user!.value!.uid)

                // Log the error when the image doesn't exist and move on
                storageRef.delete().catch((err) => console.log(err))

                user!.value!.delete().then(() => {
                  router.push({
                    name: 'room-list',
                    params: {
                      snackbarText: 'Your account has been deleted.',
                    }
                  })
                })
                .catch((err) => {
                  console.log(err)
                })
              })
              .catch((err) => {
                console.log(err)
              })
            })
            .catch((err) => {
              state.emailErrorMessage = emailDoesNotMatch
              state.passwordErrorMessage = passwordDoesNotMatch
            })
        }
      }

      return {
        state,
        hasEmailError,
        hasPasswordError,
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

  .delete-account-form-wrapper {
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

  .delete-account-input {
    font-size: 16px;
    width: 100%;
    height: 45px;
    color: $white;
    background-color: $black4;
    border-radius: 3px;
    border: 1.5px solid $black5;
    padding: 0 10px 0 10px;
  }

  .delete-account-input:focus {
    outline: none;
  }

  .delete-account-btn {
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

  @media(max-width: 450px) {
    .delete-account-form-wrapper {
      width: 100%;
      margin: 0 10px 0 10px;
    }

    .input-wrapper, .btn-wrapper {
      padding: 0 15px 0 15px;
      margin: 15px 0 20px 0; 
    }   
  }
</style>