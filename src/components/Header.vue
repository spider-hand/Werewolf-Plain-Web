<template>
  <div>
    <v-app-bar>
      <div class="flex-grow-1"></div>
      <v-btn 
        text
        @click="signIn">Login</v-btn>
    </v-app-bar>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'

  export default {
    methods: {
      signIn() {
        var provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithRedirect(provider)
        firebase.auth().getRedirectResult().then(function(result) {
          if(result.credential) {
            var token = result.credential.accessToken
          }
          var user = result.user
        }).catch(function(error) {
          var errorCode = error.code
          var errorMessage = error.message
          var email = error.email
          var credential = error.credential
        })
      }
    }
  }
</script>

<style scoped>

</style>
