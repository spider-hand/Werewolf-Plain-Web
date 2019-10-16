<template>
  <div>
    <v-app-bar>
      <div class="flex-grow-1"></div>
      <div v-if="$route.name == 'game'">
        <DialogRoomDetails />
        <DialogRoomLeave />
      </div>
      <div v-else>
        <div v-if="isSignedIn">
          <v-btn text>Profile</v-btn>
          <v-btn text>Settings</v-btn>
          <v-btn
            text
            @click="signOutOfGoogle">Logout</v-btn>
        </div>
        <v-btn 
          text
          v-else
          @click="signInWithGoogle">Login</v-btn>
      </div>
    </v-app-bar>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'
  import { mapGetters, mapActions } from 'vuex'

  import DialogRoomDetails from '@/components/DialogRoomDetails'
  import DialogRoomLeave from '@/components/DialogRoomLeave'

  export default {
    components: {
      DialogRoomDetails,
      DialogRoomLeave,
    },
    computed: {
      ...mapGetters(['isSignedIn']),
    },
    methods: {
      ...mapActions([
        'signIn', 
        'signOut',
      ]),
      signInWithGoogle() {
        var provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider).then((result) => {
          var token = result.credential.accessToken
          var user = result.user

          // Create the user's document
          var db = firebase.firestore()
          db.collection('users').doc(user.uid).set({
            userName: '',
            gameName: '',
            win: 0,
            lose: 0,
          })

          // Store the token into local storage
          this.signIn(token)
        }).catch((error) => {
          var errorCode = error.code
          var errorMessage = error.message
          var email = error.email
          var credential = error.credential
        })
      },
      signOutOfGoogle() {
        firebase.auth().signOut().then(() => {
          this.signOut()
        }).catch((error) => {

        })
      },
    }
  }
</script>

<style scoped>

</style>
