<template>
  <div>
    <v-app-bar 
      v-if="$route.name != 'game' && $viewport.width > 450"
      color="#2C2F33">
      <v-btn
        text
        color="#757575"
        @click="$router.push({ name: 'room-list' })">
        <span>Room List</span>
      </v-btn>
      <v-btn
        text
        color="#757575"
        @click="$router.push({ name: 'about' })">
        <span>About</span>
      </v-btn>
      <v-btn 
        text
        color="#757575"
        @click="$router.push({ name: 'rules' })">
        <span>Rules</span>
      </v-btn>
      <div class="flex-grow-1"></div>
      <div v-if="isSignedIn">
        <v-btn 
          icon
          color="#757575"
          @click="$router.push({ name:'profile', params:{ uid: getUserId }})">
          <v-icon>mdi-account</v-icon>
        </v-btn>
        <DialogSettings 
          :gameName="gameName"
          :avatar="avatar"
          @updateSettings="updateSettings" />
        <v-btn
          icon
          color="#757575"
          @click="signOutOfGoogle">
          <v-icon>mdi-logout</v-icon>  
        </v-btn>
      </div>
      <v-btn 
        v-else
        icon
        color="#757575"
        @click="signInWithGoogle">
        <v-icon>mdi-login</v-icon>
      </v-btn>
    </v-app-bar>
    <v-app-bar
      v-if="$route.name != 'game' && $viewport.width < 450"
      color="#2C2F33">
      <div class="flex-grow-1"></div>
      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn
            icon 
            color="#757575"
            v-on="on"
            >
            <v-icon>mdi-menu</v-icon>    
          </v-btn>
        </template>
        <v-list color="#23272A">
          <v-list-item @click="$router.push({ name: 'room-list' })">
            <v-list-item-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Room list</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$router.push({ name: 'about' })">
            <v-list-item-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>About</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$router.push({ name: 'rules' })">
            <v-list-item-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Rules</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item 
            v-if="isSignedIn"
            @click="$router.push({ name:'profile', params:{ uid: getUserId }})">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item 
            v-if="isSignedIn"
            @click="signOutOfGoogle">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Log out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item 
            v-if="!isSignedIn"
            @click="signInWithGoogle">
            <v-list-item-icon>
              <v-icon>mdi-login</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Log in</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>          
      </v-menu>
    </v-app-bar>
    <v-app-bar
      v-if="$route.name == 'game'"
      color="#2C2F33">
      <div class="flex-grow-1"></div>
      <v-btn 
        v-if="isOwner() && !hasGameStarted"
        text
        :color="isGameReady ? '#F44336' : '#757575'"
        @click="startGame">Start</v-btn>
      <DialogRoomLeave 
        v-if="isJoiningThisGame && !hasGameStarted"
        :myself="myself" />
      <DialogRole
        v-if="myself != null && myself.role != null" 
        :myself="myself" />
      <DialogRoomDetails :room="room" />
    </v-app-bar>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'
  import 'firebase/functions'
  import { mapGetters, mapActions } from 'vuex'

  import DialogRole from '@/components/DialogRole'
  import DialogRoomDetails from '@/components/DialogRoomDetails'
  import DialogRoomLeave from '@/components/DialogRoomLeave'
  import DialogSettings from '@/components/DialogSettings'
  
  export default {
    props: [
      'room',
      'myself',
      'isJoiningThisGame',
    ],
    components: {
      DialogRole,
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
      isGameReady() {
        if (this.room.numberOfParticipants == this.room.capacity) {
          return true
        } else {
          return false
        }
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
                knightWin: 0,
                knightLose: 0,
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
          var docRef = db.collection('rooms').doc(this.$route.params.id)

          docRef.update({
            status: 'ongoing',
          }).then(() => {
            docRef.collection('messages').add({
              from: 'host',
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              body: "Game starts now. Please check your role. It's first day's daytime.",
              gameName: '',
              avatar: '',
              isFromGrave: false,
            })
          })

          // Decide the roles randomly
          this.decideRoles(this.room.capacity)

          // Add a scheduled task to trigger cloud functions
          this.callCloudFunction()

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
            'wolf', 'wolf', 'seer', 'knight', 'minion']
            break
          case 11:
            roles = ['villager', 'villager', 'villager', 'villager', 
            'villager', 'wolf', 'wolf', 'seer', 'medium', 'knight', 'minion']
            break
          case 15:
            roles = ['villager', 'villager', 'villager', 'villager', 
            'villager', 'villager', 'villager', 'villager', 'wolf', 
            'wolf', 'wolf', 'seer', 'medium', 'knight', 'minion']
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
      callCloudFunction() {
        var functions = firebase.functions()
        var addTasks = functions.httpsCallable('addTasks')
        
        addTasks({
          roomId: this.$route.params.id,
          dayLength: this.room.dayLength,
          nightLength: this.room.nightLength,
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
  .v-list-item__title {
    color: #DCDDDE;
  }

  .v-list-item__icon .v-icon {
    color: #DCDDDE;
  }
</style>
