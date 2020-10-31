<template>
  <v-dialog
    persistent
    max-width="400"
    v-model="state.dialog">
    <v-card class="dialog-wrapper">
      <v-card-title class="dialog-title">
      </v-card-title>
      <v-card-text class="dialog-text">
        <v-container>
          <span>Your email hasn't verified yet. Please verify it to join a game.</span>
        </v-container>
      </v-card-text>
      <v-card-actions class="dialog-actions">
        <div class="flex-grow-1"></div>
        <v-btn 
          class="confirm-btn" 
          depressed
          @click="sendVerificationEmail">
          <span>SEND EMAIL</span>
        </v-btn>
        <v-btn
          class="cancel-btn"
          text
          @click="close">
          <span>CLOSE</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { defineComponent, reactive, computed, } from '@vue/composition-api'

  import { User as FirebaseUser } from '@/types/index'

  export default defineComponent({
    setup(props, context) {
      const store = context.root.$store

      const state = reactive<{
        dialog: boolean,
      }>({
        dialog: false,
      })

      const user = computed<FirebaseUser | null>(() => {
        return store.getters.user
      })

      function sendVerificationEmail(): void {
        if (user.value && !user.value.emailVerified) {
          user.value.sendEmailVerification()
            .then(() => {
              state.dialog = false
            })
            .catch((err) => {
              console.log(err)
            })
        }
      }

      function open(): void {
        state.dialog = true
      }

      function close(): void {
        state.dialog = false
      }

      return {
        state,
        sendVerificationEmail,
        open,
        close,
      }
    }
  })
</script>

<style lang="scss" scoped>
 .dialog-wrapper {
    background-color: $black3;
  }

  .dialog-text span {
    color: $gray4;
  }

  .confirm-btn {
    background-color: $red1 !important;
  }

  .dialog-title, .confirm-btn, .cancel-btn span {
    color: $white !important;
  }

  .confirm-btn, .cancel-btn span {
    font-size: 12px;
  }

</style>