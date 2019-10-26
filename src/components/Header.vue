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
          <v-btn 
            text
            @click="$router.push({ name:'profile', params:{ uid: getUserId }})">Profile</v-btn>
          <DialogSettings />
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
  import DialogSettings from '@/components/DialogSettings'
  
  export default {
    components: {
      DialogRoomDetails,
      DialogRoomLeave,
      DialogSettings,
    },
    computed: {
      ...mapGetters(['isSignedIn']),
      getUserId() {
        return firebase.auth().currentUser.uid
      }
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
          var docRef = db.collection('users').doc(user.uid)

          docRef.get().then((doc) => {
            if (!doc.exists) {
              docRef.set({
                userName: '',
                lastTimeUsernameEdited: null,
                gameName: '',
                bio: '',
                villagerWin: 0,
                villagerLose: 0,
                wolfWin: 0,
                wolfLose: 0,
                seerWin: 0,
                seerLose: 0,
                mediumWin: 0,
                mediumLose: 0,
                doctorWin: 0,
                doctorLose: 0,
                minionWin: 0,
                minionLose: 0,
              })
            }
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
    },
  }
</script>

<style scoped>

</style>
