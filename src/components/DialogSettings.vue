<template>
  <v-dialog
    persistent
    :fullscreen="$viewport.width < 450"
    v-model="dialog"
    max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn
        text
        v-on="on">Settings</v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span>Settings</span>
        <div class="flex-grow-1"></div>
        <v-btn
          icon
          v-if="isEditing == false"
          @click="editSettings">
            <v-icon>mdi-account-edit</v-icon>
          </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container v-if="isEditing == true">
          <v-row>
            <v-text-field
              v-model="newGameName"
              label="Game Name"
              :value="newGameName"
              outlined></v-text-field>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-btn 
                depressed
                @click="onClickAvatarInput">UPLOAD AVATAR</v-btn>
              <input 
                type="file"
                accept="image/*"
                class="avatarInput" 
                ref="avatarInput"
                @change="getFile">
            </v-col>
            <v-col 
              v-if="avatarErrorMessage != ''"
              cols="12"
              class="pt-0">
              <span class="avatarErrorMessage">{{ avatarErrorMessage }}</span>
            </v-col>
          </v-row>
          <v-row v-if="newAvatarUrl != ''">
            <v-col 
              cols="12"
              class="pb-0">
              <small>Preview</small>
            </v-col>
            <v-col cols="8">
              <v-img 
                class="avatar"
                :src="newAvatarUrl"></v-img>
            </v-col>
          </v-row>
        </v-container>
        <v-container
          class="pt-0"
          v-else>
          <v-row>
            <v-col 
              class="pt-0 pb-0" 
              cols="12">
              <small>Game Name</small>
            </v-col>
            <v-col 
              class="pt-0" 
              cols="12">
              <h2>{{ gameName }}</h2>
            </v-col>
          </v-row>
          <v-row>
            <v-col 
              cols="12"
              class="pb-0">
              <small>Avatar</small>
            </v-col>
            <v-col 
              cols="12"
              class="pt-0">
              <v-img 
                class="avatar"
                :src="avatarUrl"></v-img>              
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          text
          v-if="isEditing == true"
          @click="updateSettings">SAVE</v-btn>
        <v-btn
          text
          v-if="isEditing == true"
          @click="cancel">CANCEL</v-btn>
        <v-btn
          text
          v-else
          @click="close">CLOSE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'
  import 'firebase/storage'

  export default {
    data() {
      return {
        dialog: false,
        isEditing: false,
        gameName: '',
        avatarUrl: '',
        avatarErrorMessage: '',
        newGameName: '',
        newAvatarUrl: '',
        newAvatar: null,
      }
    },
    methods: {
      editSettings() {
        this.isEditing = true
      },
      updateSettings() {
        this.isEditing = false
        if (this.newAvatar != null) {
          var storage = firebase.storage()
          var storageRef = storage.ref('avatars/' + firebase.auth().currentUser.uid)
          storageRef.put(this.newAvatar).then((snapshot) => {
            storageRef.getDownloadURL().then((url) => {
              this.avatarUrl = url
              this.newAvatarUrl = ''
              this.newAvatar = null

              var db = firebase.firestore()
              var docRef = db.collection('users').doc(firebase.auth().currentUser.uid)
              docRef.update({
                gameName: this.newGameName,
                avatar: url,
              })
              .then(() => {
                docRef.get().then((doc) => {
                  this.gameName = doc.data().gameName
                  this.newGameName = doc.data().gameName
                })
              })
            })
          })
        } else {
          var db = firebase.firestore()
          var docRef = db.collection('users').doc(firebase.auth().currentUser.uid)
          docRef.update({
            gameName: this.newGameName,
          })
          .then(() => {
            docRef.get().then((doc) => {
              this.gameName = doc.data().gameName
              this.newGameName = doc.data().gameName
            })
          })          
        }
      },
      onClickAvatarInput() {
        this.$refs.avatarInput.click()
      },
      getFile(event) {
        const files = event.target.files
        const fileReader = new FileReader()
        if (files[0].size > 200000) {
          this.avatarErrorMessage = 'Avatar size should be less than 2MB'          
        } else {
          fileReader.addEventListener('load', () => {
            this.newAvatarUrl = fileReader.result
          })
          fileReader.readAsDataURL(files[0])
          this.newAvatar = files[0]
          this.avatarErrorMessage = ''
        }
      },
      cancel() {
        this.isEditing = false
        this.avatarErrorMessage = ''
      },
      close() {
        this.dialog = false
      },
    },
    mounted() {
      firebase.auth().onAuthStateChanged((user) => {
        var db = firebase.firestore()
        db.collection('users').doc(user.uid).get().then((doc) => {
          this.gameName = doc.data().gameName
          this.newGameName = doc.data().gameName
          this.avatarUrl = doc.data().avatar
        })
      })
    },
  }
</script>

<style scoped>
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .avatarInput {
    display: none;
  }

  .avatarErrorMessage {
    font-size: 12px;
    color: #FF5252;
  }
</style>
