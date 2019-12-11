<template>
  <v-dialog
    persistent
    :fullscreen="$viewport.width < 450"
    v-model="dialog"
    max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn
        text
        color="#FFFFFF"
        v-on="on">Settings</v-btn>
    </template>
    <v-card color="#36393F">
      <v-card-title>
        <span>Settings</span>
        <div class="flex-grow-1"></div>
        <v-btn
          icon
          v-if="isEditing == false"
          @click="editSettings">
            <v-icon color="#8E9297">mdi-account-edit</v-icon>
          </v-btn>
      </v-card-title>
      <v-card-text>
        <v-container v-if="isEditing == true">
          <v-row>
            <v-text-field
              v-model="newGameName"
              label="Game Name"
              :value="newGameName"
              outlined
              color="#8E9297"
              background-color="#2F3136"
              dark></v-text-field>
          </v-row>
          <v-row>
            <v-col cols="8">
              <v-btn 
                depressed
                color="#2F3136"
                @click="onClickAvatarInput">
                <span>UPLOAD AVATAR</span>
              </v-btn>
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
              <span>
                <small>Game Name</small>
              </span>
            </v-col>
            <v-col 
              class="pt-0" 
              cols="12">
              <span>
                <h2>{{ gameName }}</h2>
              </span>
            </v-col>
          </v-row>
          <v-row>
            <v-col 
              cols="12"
              class="pb-0">
              <span>
                <small>Avatar</small>
              </span>
            </v-col>
            <v-col 
              cols="12"
              class="pt-0">
              <v-img 
                class="avatar"
                :src="avatar"></v-img>              
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          text
          v-if="isEditing == true"
          color="#2F3136"
          @click="updateSettings">
          <span>SAVE</span>
        </v-btn>
        <v-btn
          text
          v-if="isEditing == true"
          color="#2F3136"
          @click="cancel">
          <span>CANCEL</span>
        </v-btn>
        <v-btn
          text
          v-else
          @click="close">
          <span>CLOSE</span>
        </v-btn>
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
    props: [
      'gameName',
      'avatar',
    ],
    data() {
      return {
        dialog: false,
        isEditing: false,
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
                  this.newGameName = doc.data().gameName
                  this.$emit('updateSettings', doc.data().gameName, url)
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
              this.newGameName = doc.data().gameName
              this.$emit('updateSettings', doc.data().gameName, this.avatar)
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
  }
</script>

<style scoped>
  span {
    color: #FFFFFF;
  }

  small {
    color: #8E9297;
  }

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
