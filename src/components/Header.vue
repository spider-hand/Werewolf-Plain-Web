<template>
  <div>
    <v-app-bar>
      <div class="flex-grow-1"></div>
      <div v-if="$route.name == 'game'">
        <v-btn 
          text
          v-if="isOwner() && !hasGameStarted"
          @click="startGame">Start</v-btn>
        <DialogRoomDetails :room="room" />
        <DialogRoomLeave v-if="isJoiningThisGame  && !hasGameStarted" />
      </div>
      <div v-else>
        <div v-if="isSignedIn">
          <v-btn 
            text
            @click="$router.push({ name:'profile', params:{ uid: getUserId }})">Profile</v-btn>
          <DialogSettings 
            :gameName="gameName"
            :avatar="avatar"
            @updateSettings="updateSettings" />
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
    props: [
      'room',
      'isJoiningThisGame',
    ],
    components: {
      DialogRoomDetails,
      DialogRoomLeave,
      DialogSettings,
    },
    data() {
      return {
        gameName: '',
        avatar: '',
      }
    },
    computed: {
      ...mapGetters(['isSignedIn']),
      getUserId() {
        return firebase.auth().currentUser.uid
      },
      hasGameStarted() {
        if (this.room.status != 'new') {
          return true
        } else {
          return false
        }
      },
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
                avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
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
              }).then(() => {
                this.gameName = ''
                this.avatar = 'https://cdn.vuetifyjs.com/images/lists/1.jpg'

                this.$emit('updateSettings', this.gameName, this.avatar)
              })
            } else {
              this.gameName = doc.data().gameName
              this.avatar = doc.data().avatar

              this.$emit('updateSettings', this.gameName, this.avatar)
            }

            // Store the token into local storage
            this.signIn(token)
          })
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
      startGame() {
        if (this.room.numberOfParticipants == this.room.capacity) {
          var db = firebase.firestore()
          var docRef = db.collection('rooms').doc(this.$store.state.game.roomId)

          docRef.update({
            status: 'ongoing',
          })

          // Decide the roles randomly
          this.decideRoles(this.room.capacity)

          // Deploy scheduled cloud functions

        } else {
          console.log('This room is not ready.')
        }
      },
      decideRoles(capacity) {
        var roles
        switch (capacity) {
          case 5:
            roles = ['villager', 'villager', 'villager', 'wolf', 'seer']
            break
          case 9:
            roles = ['villager', 'villager', 'villager', 'villager', 
            'wolf', 'wolf', 'seer', 'doctor', 'minion']
            break
          case 11:
            roles = ['villager', 'villager', 'villager', 'villager', 
            'villager', 'wolf', 'wolf', 'seer', 'medium', 'doctor', 'minion']
            break
          case 15:
            roles = ['villager', 'villager', 'villager', 'villager', 
            'villager', 'villager', 'villager', 'villager', 'wolf', 
            'wolf', 'wolf', 'seer', 'medium', 'doctor', 'minion']
            break
        }

        // Shuffle roles
        for (var i = roles.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1))
          var temp = roles[i]
          roles[i] = roles[j]
          roles[j] = temp
        }

        var db = firebase.firestore()
        var collectionRef = db.collection('rooms').doc(this.$route.params.id).collection('players')

        var k = 0
        collectionRef.get()
          .then((querySnapShot) => {
            querySnapShot.forEach((doc) => {
              var docRef = collectionRef.doc(doc.id)

              docRef.update({
                role: roles[k]
              })

              k++
            })
          })
      },
      isOwner() {
        try {
          if (firebase.auth().currentUser) {
            if (this.room.ownerId == firebase.auth().currentUser.uid) {
              return true
            } else {
              return false
            }          
          } else {
            return false
          }
        } catch (err) {
          return false
        }
      },
      updateSettings(gameName, avatar) {
        this.gameName = gameName
        this.avatar = avatar
        this.$emit('updateSettings', gameName, avatar)
      },
    },
    mounted() {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          var db = firebase.firestore()
          db.collection('users').doc(user.uid).get().then((doc) => {
            if (doc.exists) {
              this.gameName = doc.data().gameName
              this.avatar = doc.data().avatar

              this.$emit('updateSettings', this.gameName, this.avatar)
            }
          })
        }
      })
    },
  }
</script>

<style scoped>

</style>
