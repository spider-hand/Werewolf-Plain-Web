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
              <span class="in-game-name-value">Anonymous</span>
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
                src="@/assets/logo.png">
              </v-img>
            </v-col>
          </v-row>
        </v-container>
        <v-container v-else>
          <form>
            <div class="input-wrapper">
              <label class="input-label">In game name</label>
              <input 
                class="settings-input" 
                type="text" 
                name="in-game-name">
            </div>
            <v-btn
              class="upload-avatar-btn"
              depressed>
              <v-icon 
                class="upload-icon"
                left>mdi-upload</v-icon>
              <span>UPLOAD AVATAR</span>
            </v-btn>
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
          @click="update">
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
          <span>CANCel</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { defineComponent, reactive, } from '@vue/composition-api'

  export default defineComponent({

    setup(props, context) {

      const state = reactive<{
        dialog: boolean,
        isEditing: boolean,
      }>({
        dialog: false,
        isEditing: false,
      })

      function edit(): void {
        state.isEditing = true
      }

      function update(): void {

      }

      function cancel(): void {
        state.isEditing = false
      }

      function close(): void {
        state.dialog = false
      }

      return {
        state,
        edit,
        update,
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
    font-size: 12px;
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
</style>