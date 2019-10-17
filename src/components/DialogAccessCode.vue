<template>
  <v-dialog
    persist
    :fullscreen="$viewport.width < 450"
    v-model="dialog"
    max-width="600">
    <v-card>
      <v-card-title>
        <span>Input Access Code</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-text-field 
            :error-messages="errorMessage"
            v-model="accessCode"
            outlined
            prepend-icon="mdi-lock" />
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          depressed
          @click="validate">OK</v-btn>
        <v-btn
          depressed
          @click="close">CLOSE</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: [
      'validAccessCode',
      'index',
    ],
    data() {
      return {
        dialog: false,
        accessCode: '',
        errorMessage: '',
      }
    },
    methods: {
      validate() {
        if (this.accessCode != this.validAccessCode) {
          this.errorMessage = 'Access code is invalid'
        } else {
          this.$emit('validateAccessCode')
        }
      },
      open() {
        this.dialog = true
      },
      close() {
        this.dialog = false
        this.accessCode = ''
        this.errorMessage = ''
      }
    }
  }
</script>

<style scoped>
  
</style>
