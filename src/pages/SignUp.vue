<template>
  <div id="page">
  	<v-container 
  		class="sign-up-form-container"
  		fill-height
  		fluid>
  		<v-row>
	  		<div class="sign-up-form-wrapper">
	  			<form 
            class="sign-up-form-group"
            @submit.prevent="validate">
	  				<div class="input-wrapper">
	  					<label 
                class="input-label"
                :class="{ 'text-error': hasEmailError }">EMAIL</label>
              <label 
                class="input-label ml-2"
                :class="{ 'text-error': hasEmailError }">{{ state.emailErrorMessage }}</label>
	  					<input 
                class="sign-up-input" 
                :class="{ 'input-error': hasEmailError }"
                type="email" 
                name="email"
                v-model="state.email">
	  				</div>
	  				<div class="input-wrapper">
	  					<label 
                class="input-label"
                :class="{ 'text-error': hasUsernameError }">USERNAME</label>
              <label 
                class="input-label ml-2"
                :class="{ 'text-error': hasUsernameError }">{{ state.usernameErrorMessage }}</label>
	  					<input 
                class="sign-up-input"
                :class="{ 'input-error': hasUsernameError }"
                type="text" 
                name="username"
                v-model="state.username">
	  				</div>
	  				<div class="input-wrapper">
	  					<label 
                class="input-label"
                :class="{ 'text-error': hasPasswordError }">PASSWORD</label>
              <label 
                class="input-label ml-2"
                :class="{ 'text-error': hasPasswordError }">{{ state.passwordErrorMessage }}</label>
	  					<input 
                class="sign-up-input"
                :class="{ 'input-error': hasPasswordError }"
                type="password" 
                name="password"
                v-model="state.password">
	  				</div>
	  				<div class="btn-wrapper">
	  					<button class="sign-up-btn">SIGN UP</button>
	  				</div>
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
  import 'firebase/firestore'

  export default defineComponent({

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

      const hasEmailError = computed<boolean>(() => {
        return state.emailErrorMessage !== ''
      })

      const hasUsernameError = computed<boolean>(() => {
        return state.usernameErrorMessage !== ''
      })

      const hasPasswordError = computed<boolean>(() => {
        return state.passwordErrorMessage !== ''
      })

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
        const db = firebase.firestore()
        const userCollectionRef = db.collection('users')

        userCollectionRef.where('username', '==', state.username).limit(1).get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              firebase.auth().createUserWithEmailAndPassword(state.email, state.password)
                .then((data) => {
                  // Sign up and create the user document
                  userCollectionRef.doc(data.user!.uid).set({
                    username: state.username,
                    inGameName: 'Anonymous',
                    avatar: '',
                  })
                  .then(() => {
                    // TODO: Send a verification email

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
        hasEmailError,
        hasUsernameError,
        hasPasswordError,
        validate,
        signUpWithEmailAndPassword,
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

  .sign-up-form-wrapper {
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

  .sign-up-input {
  	font-size: 16px;
  	width: 100%;
  	height: 45px;
  	color: $white;
  	background-color: $black4;
  	border-radius: 3px;
  	border: 1.5px solid $black5;
  	padding: 0 10px 0 10px;
  }

  .sign-up-input:focus {
  	outline: none;
  }

  .sign-up-btn {
  	font-size: 16px;
  	width: 100%;
  	height: 50px;
  	background-color: $red1;
  	color: $white;
  	border-radius: 3px;
  }

  .sign-in-link {
  	font-size: 14px;
  	font-weight: 500;
  	color: $white;
  	text-decoration: none;
  }

  .link-wrapper {
  	margin: 0 0 5px 30px;
  }

 .link-wrapper span {
  	font-size: 14px;
  	color: $gray1;
  }

  .text-error {
    color: $red1;
  }

  .input-error {
    border: 1.5px solid $red1;
  }
</style>