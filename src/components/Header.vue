<template>
  <div>
    <v-app-bar 
      v-if="$viewport.width > 450"
      color="#23272A">
      <div>
        <v-img 
          src="../assets/logo1.png"
          width="120" />
      </div>
      <v-btn
        text
        color="#757575"
        @click="$router.push({ name: 'room-list' })">
        <span>{{ $t('Header.roomList') }}</span>
      </v-btn>
      <v-btn
        text
        color="#757575"
        @click="$router.push({ name: 'about' })">
        <span>{{ $t('Header.about') }}</span>
      </v-btn>
      <v-btn 
        text
        color="#757575"
        @click="$router.push({ name: 'rules' })">
        <span>{{ $t('Header.rules') }}</span>
      </v-btn>
      <div class="flex-grow-1"></div>
      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn
            icon
            color="#757575"
            v-on="on">
            <v-icon>mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list color="#23272A">
          <v-list-item
            v-for="(language, index) in languages"
            :key="index"
            @click="changeLanguage(language.value)">
            <v-list-item-title>{{ language.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
      v-else
      color="#23272A">
      <div>
        <v-img
          src="../assets/logo.png"
          width="72" />
      </div>
      <div class="flex-grow-1"></div>
      <DialogSettings
        ref="dialogSettings"
        :gameName="gameName"
        :avatar="avatar"
        @updateSettings="updateSettings" />
      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn
            icon 
            color="#757575"
            v-on="on">
            <v-icon>mdi-menu</v-icon>    
          </v-btn>
        </template>
        <v-list color="#23272A">
          <v-list-item @click="$router.push({ name: 'room-list' })">
            <v-list-item-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('Header.roomList') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$router.push({ name: 'about' })">
            <v-list-item-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('Header.about') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="$router.push({ name: 'rules' })">
            <v-list-item-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('Header.rules') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item 
            v-if="isSignedIn"
            @click="$router.push({ name:'profile', params:{ uid: getUserId }})">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('Header.profile') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item 
            v-if="isSignedIn"
            @click="$refs.dialogSettings.open()">
            <v-list-item-icon>
              <v-icon>mdi-settings</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('Header.settings') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item 
            v-if="isSignedIn"
            @click="signOutOfGoogle">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('Header.logout') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item 
            v-if="!isSignedIn"
            @click="signInWithGoogle">
            <v-list-item-icon>
              <v-icon>mdi-login</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t('Header.login') }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>          
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'
  import 'firebase/functions'
  import { mapGetters, mapActions } from 'vuex'

  import DialogSettings from '@/components/DialogSettings'

  export default {
    components: {
      DialogSettings,
    },
    data() {
      return {
        gameName: null,
        avatar: null,
        languages: [
          { 
            name: 'English',
            value: 'en', 
          },
          { name: '日本語',
            value:'ja', 
          },
          { 
            name: 'Español',
            value: 'es',
          },
          { 
            name: 'Portugues',
            value:'pt',
          },
        ],
      }
    },
    computed: {
      ...mapGetters(['isSignedIn']),
      getUserId() {
        return firebase.auth().currentUser.uid
      },
    },
    methods: {
      ...mapActions([
        'signIn', 
        'signOut',
        'saveLanguage',
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
                username: user.displayName,
                lastTimeUsernameEdited: null,
                gameName: this.$t('Header.anonymous'),
                avatar: null,
                bio: '',
                villagerWin: 0,
                villagerLose: 0,
                werewolfWin: 0,
                werewolfLose: 0,
                seerWin: 0,
                seerLose: 0,
                mediumWin: 0,
                mediumLose: 0,
                knightWin: 0,
                knightLose: 0,
                minionWin: 0,
                minionLose: 0,
              }).then(() => {
                this.gameName = this.$t('Header.anonymous')
                this.avatar = null

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
        })
      },
      signOutOfGoogle() {
        firebase.auth().signOut().then(() => {
          this.signOut()
        })
      },
      updateSettings(gameName, avatar) {
        this.gameName = gameName
        this.avatar = avatar
        this.$emit('updateSettings', gameName, avatar)
      },
      changeLanguage(language) {
        this.$i18n.locale = language
        this.saveLanguage(language)
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
