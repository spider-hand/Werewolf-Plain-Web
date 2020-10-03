<template>
  <v-dialog
    persistent
    max-width="400"
    v-model="state.dialog">
    <template v-slot:activator="{ on }">
      <v-btn
        class="settings-btn"
        text
        v-on="on">
        <span>Settings</span>
      </v-btn>
    </template>
    <v-card class="dialog-wrapper">
      <v-card-title class="dialog-title">
        <span>Settings</span>
      </v-card-title>
      <v-card-text class="dialog-text">
        <v-container v-if="!state.isEditing">
          <v-row>
            <v-col 
              cols="12"
              class="pt-0 pb-0">
              <span class="in-game-name-text">In game name</span>
            </v-col>
            <v-col 
              cols="12"
              class="pt-0">
              <span class="in-game-name-value">{{ user ? user.displayName : '' }}</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col 
              cols="12"
              class="pt-0 pb-0">
              <span class="avatar-text">Avatar</span>
            </v-col>
            <v-col cols="12">
              <v-img
                class="avatar"
                :src="user.photoURL ? user.photoURL : require(`@/assets/logo.png`)">
              </v-img>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-else>
          <form>
            <div class="input-wrapper">
              <label 
                class="input-label"
                :class="{ 'text-error': hasInGameNameError }">In game name</label>
              <label 
                class="input-label ml-2"
                :class="{ 'text-error': hasInGameNameError }">{{ state.inGameNameErrorMessage }}</label>
              <input 
                class="settings-input"
                :class="{ 'input-error': hasInGameNameError }"
                type="text" 
                name="in-game-name"
                maxlength="16"
                v-model="state.newGameName">
            </div>
            <v-row 
              class="pt-0"
              v-if="state.newAvatarUrl !== ''">
              <v-col
                class="input-label pt-0 pb-0"
                cols="12">
                <span>Preview</span>
              </v-col>
              <v-col cols="8">
                <v-img
                  class="avatar"
                  :src="state.newAvatarUrl">
                </v-img>
              </v-col>
            </v-row>
            <v-btn
              class="upload-avatar-btn"
              depressed
              @click="onClickAvatarInput">
              <v-icon 
                class="upload-icon"
                left>mdi-upload</v-icon>
              <span>UPLOAD AVATAR</span>
            </v-btn>
            <input 
              type="file" 
              name="avatar"
              hidden 
              accept="image/*"
              ref="avatarInput"
              @change="getFile">
          </form>
        </v-container>
      </v-card-text>
      <v-card-actions class="dialog-actions">
        <div class="flex-grow-1"></div>
        <v-btn
          class="edit-btn"
          depressed
          v-if="!state.isEditing"
          @click="edit">
          <span>EDIT</span>
        </v-btn>
        <v-btn
          class="save-btn"
          depressed
          v-else
          @click="validate">
          <span>SAVE</span>
        </v-btn>
        <v-btn
          class="close-btn"
          text
          v-if="!state.isEditing"
          @click="close">
          <span>CLOSE</span>
        </v-btn>              
        <v-btn
          class="cancel-btn"
          text
          v-else
          @click="cancel">
          <span>CANCEl</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { defineComponent, reactive, ref, computed, onMounted, } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/firestore'
  import 'firebase/storage'

  export default defineComponent({

    setup(props, context) {
      const store = context.root.$store
      const user = store.getters.user

      const avatarInput = ref(null)

      const state = reactive<{
        dialog: boolean,
        isEditing: boolean,
        newGameName: string,
        newAvatarUrl: string | ArrayBuffer | null,
        newAvatar: Blob | Uint8Array | ArrayBuffer | null,
        inGameNameErrorMessage: string,
        avatarErrorMessage: string,
      }>({
        dialog: false,
        isEditing: false,
        newGameName: '',
        newAvatarUrl: '',
        newAvatar: null,
        inGameNameErrorMessage: '',
        avatarErrorMessage: '',
      })

      const hasInGameNameError = computed<boolean>(() => {
        return state.inGameNameErrorMessage !== ''
      })

      const hasAvatarError = computed<boolean>(() => {
        return state.avatarErrorMessage !== ''
      })

      function edit(): void {
        state.isEditing = true
      }

      function validate(): void {
        if (state.newGameName.length > 16) {
          state.inGameNameErrorMessage = "Name is too long."
        } else if (state.newGameName === '') {
          state.inGameNameErrorMessage = "Name can not be empty."
        } else {
          update()
        }
      }

      function update(): void {
        const promises0 = [] as Promise<void>[]
        // TODO: Make sure the user is logged in
        // TODO: Update to the new in game name and avatar
        if (state.newAvatar) {
          const storage = firebase.storage()
          const storageRef = storage.ref('avatars/' + user.uid)
          storageRef.put(state.newAvatar).then((snapShot) => {
            storageRef.getDownloadURL().then((url) => {
              const db = firebase.firestore()
              const docRef = db.collection('users').doc(user.uid)

              const updateUserdoc = 
                docRef.update({
                  inGameName: state.newGameName,
                  avatar: url,
                })

              const updateProfile = 
                user.updateProfile({
                  displayName: state.newGameName,
                  photoURL: url
                })

              promises0.push(updateUserdoc)
              promises0.push(updateProfile)

              Promise.all(promises0).then(() => {
                state.isEditing = false
              })
            })
          })
        } else {
          const db = firebase.firestore()
          const docRef = db.collection('users').doc(user.uid)

          const updateInGameName = 
            docRef.update({
              inGameName: state.newGameName,
            })
          const updateDisplayName =
            user.updateProfile({
              displayName: state.newGameName,
            })

          promises0.push(updateInGameName)
          promises0.push(updateDisplayName)

          Promise.all(promises0).then(() => {
            state.isEditing = false
          })
        }
      }

      function onClickAvatarInput(): void {
        avatarInput.value.click()
      }

      function getFile(event: Event): void {
        const files = (event.target as HTMLInputElement).files
        const fileReader = new FileReader()
        if (files[0].size > 2000000) {
          state.avatarErrorMessage = 'Image size cannot exceed 2MB.'
        } else {
          fileReader.addEventListener('load', () => {
            state.newAvatarUrl = fileReader.result
          })
          fileReader.readAsDataURL(files[0])
          state.newAvatar = files[0]
          state.avatarErrorMessage = ''
        }
      }

      function cancel(): void {
        state.isEditing = false
        state.newGameName = user.displayName
        state.newAvatarUrl = ''
        state.newAvatar = null
        state.inGameNameErrorMessage = ''
        state.avatarErrorMessage = ''
      }

      function close(): void {
        state.dialog = false
        state.newGameName = user.displayName
        state.newAvatarUrl = ''
        state.newAvatar = null
        state.inGameNameErrorMessage = ''
        state.avatarErrorMessage = ''
      }

      onMounted(() => {
        state.newGameName = user.displayName
      })

      return {
        store,
        user,
        avatarInput,
        state,
        hasInGameNameError,
        hasAvatarError,
        edit,
        validate,
        update,
        onClickAvatarInput,
        getFile,
        cancel,
        close,
      }
    }
  })
</script>

<style lang="scss" scoped>
  .settings-btn {
    color: $white !important;
    text-transform: none;
  }

  .dialog-wrapper {
    background-color: $black3 !important;
  }

  .dialog-actions {
    background-color: $black2;
  }

  .dialog-title span {
    color: $white;
    font-size: 16px;
  }

  .in-game-name-text, .avatar-text {
    color: $gray4;
    font-size: 12px;
  }

  .in-game-name-value {
    color: $white;
    font-size: 18px;
    font-weight: 500;
  }

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .edit-btn, .save-btn, .upload-avatar-btn {
    background-color: $red1 !important;
  }

  .edit-btn, .save-btn, .close-btn, .cancel-btn, .upload-avatar-btn span {
    color: $white !important;
    font-size: 12px !important;
  }

  .input-wrapper {
    width: 100%;
    position: relative;
    margin: 20px 0 20px 0;
  }

  .input-label {
    color: $gray3;
    font-size: 12px;
    font-weight: 500;
  }

  .settings-input {
    font-size: 16px;
    width: 100%;
    height: 45px;
    color: $white;
    background-color: $black4;
    border-radius: 3px;
    border: 1.5px solid $black5;
    padding: 0 10px 0 10px;
  }

  .settings-input:focus {
    outline: none;
  }

  .upload-icon {
    color: $white !important;
  }

  .text-error {
    color: $red1;
  }

  .input-error {
    border: 1.5px solid $red1;
  }
</style>