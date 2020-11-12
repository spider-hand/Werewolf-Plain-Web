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
            <TextField
              :label="'USERNAME'" 
              :type="'text'"
              :errorMessage="state.usernameErrorMessage"
              :eventName="'onUsernameChanged'"
              @onUsernameChanged="onUsernameChanged" />
            <TextField
              :label="'PASSWORD'" 
              :type="'password'"
              :errorMessage="state.passwordErrorMessage"
              :eventName="'onPasswordChanged'"
              @onPasswordChanged="onPasswordChanged" />            
            <FormButton :text="'SIGN UP'" />
          </form>
        </div>
        <v-col cols="12">
          <div 
            class="link-wrapper"
            align="center"
            justify="center">
            <span>Already have an account? </span>
            <router-link
              class="sign-in-link"
              to="/sign-in">
              Sign in
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

  import { userCollection } from '@/firebase'
  import TextField from '@/components/forms/TextField.vue'
  import FormButton from '@/components/forms/FormButton.vue'

  export default defineComponent({

    components: {
      TextField,
      FormButton,
    },

    setup(props, context) {
      const router = context.root.$router

       const required = "This field is required."
       const emailInUse = "This email has already been registered."
       const invalidEmail = "This email is invalid."
       const weakPassword = "This password is too weak."
       const usernameInUse = "This username is already taken."

      const state = reactive<{
        email: string,
        username: string,
        password: string,
        emailErrorMessage: string,
        usernameErrorMessage: string,
        passwordErrorMessage: string,        
      }>({
        email: '',
        username: '',
        password: '',
        emailErrorMessage: '',
        usernameErrorMessage: '',
        passwordErrorMessage: '',
      })

      function onUsernameChanged(val: string): void {
        state.username = val
      }

      function onPasswordChanged(val: string): void {
        state.password = val
      }

      function onEmailChanged(val: string): void {
        state.email = val
      }

      function validate(): void {
        if (state.email === '' || state.username === '' || state.password === '') {
          if (state.email === '') {
            state.emailErrorMessage = required
          }
          if (state.username === '') {
            state.usernameErrorMessage = required
          }
          if (state.password === '') {
            state.passwordErrorMessage = required
          }
        } else {
          signUpWithEmailAndPassword()
        }        
      }

      function signUpWithEmailAndPassword(): void {
        // Check if the username is alreay taken
        const promises0: Promise<void>[] = [] 

        userCollection.where('username', '==', state.username).limit(1).get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              firebase.auth().createUserWithEmailAndPassword(state.email, state.password)
                .then((data) => {
                  // Sign up and create the user document
                  const createUserDoc = 
                    userCollection.doc(data.user!.uid).set({
                      username: state.username,
                      inGameName: 'Anonymous',
                      avatar: '',
                    })

                  // Set a default in game name
                  const updateProfile = 
                    data.user!.updateProfile({
                      displayName: 'Anonymous',
                    })

                  // Send a verification email
                  const sendEmail = 
                    data.user!.sendEmailVerification()

                  promises0.push(createUserDoc)
                  promises0.push(updateProfile)
                  promises0.push(sendEmail)

                  Promise.all(promises0).then(() => {
                    // Redirect to home page
                    router.push({
                      name: 'room-list',
                    })
                  })             
                })
                .catch((err) => {
                  console.log(err)
                  // When the validation for email and password failed
                  if (err.code === 'auth/email-already-in-use') {
                    state.emailErrorMessage = emailInUse
                  } else if (err.code === 'auth/invalid-email') {
                    state.emailErrorMessage = invalidEmail
                  } else if (err.code === 'auth/weak-password') {
                    state.passwordErrorMessage = weakPassword
                  }  
                })
            } else {
              state.usernameErrorMessage = usernameInUse
            }
          })
      }

      return {
        state,
        onUsernameChanged,
        onEmailChanged,
        onPasswordChanged,
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

  .sign-in-link {
    font-size: 14px;
    font-weight: 500;
    color: $white;
    text-decoration: none;
  }

 .link-wrapper span {
    font-size: 14px;
    color: $gray1;
  }

  @media(max-width: 450px) {
    .form-wrapper {
      width: 100%;
      margin: 0 10px 0 10px;
    } 
  }
</style>