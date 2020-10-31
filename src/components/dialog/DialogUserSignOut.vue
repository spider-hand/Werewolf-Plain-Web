<template>
  <v-dialog
    persistent
    max-width="400"
    v-model="state.dialog">
    <template v-slot:activator="{ on }">
      <v-btn
        class="sign-out-btn"
        text
        v-on="on">
        <span>Sign Out</span>
      </v-btn>
    </template>
    <v-card class="dialog-wrapper">
      <v-card-title class="dialog-title">
        <span>Sign Out</span>
      </v-card-title>
      <v-card-text class="dialog-text">
        <v-container>
          <span>Are you sure you want to sign out?</span>
        </v-container>
      </v-card-text>
      <v-card-actions class="dialog-actions">
        <div class="flex-grow-1"></div>
        <v-btn 
          class="confirm-btn"
          depressed
          @click="signOut"
          >
          <span>SIGN OUT</span>
        </v-btn>
        <v-btn
          class="cancel-btn"
          text
          @click="cancel">
          <span>CLOSE</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { defineComponent, reactive, } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth'

  export default defineComponent({

    setup(props, context) {

      const state = reactive<{
        dialog: boolean,
      }>({
        dialog: false,
      })

      function signOut(): void {
        firebase.auth().signOut().then(() => {
          state.dialog = false
        })
        .catch((err) => {
          console.log(err)
        })
      }

      function cancel(): void {
        state.dialog = false
      }

      return {
        state,
        signOut,
        cancel,
      }
    }
  })
</script>

<style lang="scss" scoped>
  .sign-out-btn {
  color: $red1 !important;
  text-transform: none;
  }

  .dialog-wrapper {
    background-color: $black3 !important;
  }

  .dialog-text span {
    color: $gray4;
  }

  .dialog-actions {
    background-color: $black2;
  }

  .dialog-title, .confirm-btn, .cancel-btn span {
    color: $white;
  }

  .dialog-title span {
    font-size: 16px;
  }

  .confirm-btn {
    background-color: $red1 !important;
  }

  .confirm-btn, .cancel-btn span {
    font-size: 12px;
  }
</style>