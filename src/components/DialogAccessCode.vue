<template>
  <v-dialog
    persist
    :fullscreen="$viewport.width < 450"
    v-model="dialog"
    max-width="600">
    <v-card color="#36393F">
      <v-card-title>
        <span>{{ $t('DialogAccessCode.title') }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-text-field 
            :error-messages="errorMessage"
            v-model="accessCode"
            outlined
            color="#8E9297"
            background-color="#2F3136"
            dark
            prepend-icon="mdi-lock" />
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          text
          @click="validate">
          <span>OK</span>
        </v-btn>
        <v-btn
          text
          @click="close">
          <span>{{ $t('DialogAccessCode.close') }}</span>
        </v-btn>
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
          this.errorMessage = this.$t('DialogAccessCode.invalidAccessCode')
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
  span {
    color: #FFFFFF;
  }
</style>
