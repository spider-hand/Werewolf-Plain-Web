<template>
  <v-dialog
    persistent
    max-width="400"
    v-model="state.dialog">
    <v-card class="dialog-wrapper">
      <v-card-title class="dialog-title">
        <span>Input access code</span>
      </v-card-title>
      <v-card-text>
        <form>
          <div class="input-wrapper">
            <label 
              class="input-label"
              :class="{ 'text-error': hasAccessCodeError }">ACCESS CODE</label>
            <label 
              class="input-label ml-2"
              :class="{ 'text-error': hasAccessCodeError }">{{ state.accessCodeErrorMessage }}</label>
            <input
              class="access-code-input"
              :class="{ 'input-error': hasAccessCodeError }"
              type="text" 
              name="access-code"
              v-model="state.accessCode">
          </div>
        </form>
      </v-card-text>
      <v-card-actions class="dialog-actions">
        <div class="flex-grow-1"></div>
        <v-btn
          class="confirm-btn"
          text
          @click="validate">
          <span>ENTER</span>
        </v-btn>
        <v-btn
          class="cancel-btn"
          text
          @click="cancel">
          <span>CANCEL</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { defineComponent, reactive, computed, } from '@vue/composition-api'

  export default defineComponent({
    props: {
      validAccessCode: {
        type: String,
        required: true,
      }
    },

    setup(props, context) {
      const invalidAccessCode = "Access code does not match."

      const state = reactive<{
        dialog: boolean,
        accessCode: string,
        accessCodeErrorMessage: string,
      }>({
        dialog: false,
        accessCode: '',
        accessCodeErrorMessage: '',
      })

      const hasAccessCodeError = computed<boolean>(() => {
        return state.accessCodeErrorMessage !== ''
      })

      function validate(): void {
        if (state.accessCode !== props.validAccessCode) {
          state.accessCodeErrorMessage = invalidAccessCode
        } else {
          context.emit('validateAccessCode')
        }
      }

      function open(): void {
        state.dialog = true
      }

      function cancel(): void {
        state.dialog = false
        state.accessCode = ''
        state.accessCodeErrorMessage = ''
      }

      return {
        state,
        hasAccessCodeError,
        validate,
        open,
        cancel,
      }
    }
  })
</script>

<style lang="scss" scoped>
  .dialog-wrapper {
    background-color: $black3;
  }

  .dialog-actions {
    background-color: $black2;
  }

  .input-wrapper {
    width: 100%;
    position: relative;
    padding: 0 25px 0 25px;
    margin: 20px 0 20px 0;
  }

  .input-label {
    color: $gray3;
    font-size: 12px;
    font-weight: 500;
  }

  .access-code-input {
    font-size: 16px;
    width: 100%;
    height: 45px;
    color: $white;
    background-color: $black4;
    border-radius: 3px;
    border: 1.5px solid $black5;
    padding: 0 10px 0 10px;
  }

  .access-code-input:focus {
    outline: none;
  }

  .confirm-btn {
    background-color: $red1 !important;
  }

  .dialog-title, .confirm-btn, .cancel-btn span {
    color: $white;
  }

  .dialog-title span {
    font-size: 16px;
  }

  .confirm-btn, .cancel-btn span {
    font-size: 12px;
  }

  .text-error {
    color: $red1;
  }

  .input-error {
    border: 1.5px solid $red1;
  }
</style>