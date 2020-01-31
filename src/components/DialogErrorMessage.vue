<template>
  <v-dialog
    persist
    :fullscreen="$viewport.width < 450"
    v-model="dialog"
    max-width="600">
    <v-card color="#36393F">
      <v-card-title>
      </v-card-title>
      <v-card-text>
        <v-container>
          <span>{{ errorMessage }}</span>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          text
          @click="close">
          <span>{{ $t('DialogErrorMessage.close') }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data() {
      return {
        dialog: false,
        errorMessage: null,
      }
    },
    methods: {
      open(errorMessage) {
        this.dialog = true
        this.errorMessage = errorMessage
      },
      close() {
        this.dialog = false
      }
    }
  }
</script>