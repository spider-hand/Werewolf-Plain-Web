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
          <span>{{ props.message }}</span>
        </v-container>
      </v-card-text>
      <v-card-actions class="dialog-actions">
        <div class="flex-grow-1"></div>
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
  import { defineComponent, reactive } from '@vue/composition-api'

  export default defineComponent({
    props: {
      message: {
        type: String,
        required: true,
      }
    },
    
    setup(props, context) {
      const state = reactive<{
        dialog: boolean,
      }>({
        dialog: false,
      })

      function open(): void {
        state.dialog = true
      }

      function close(): void {
        state.dialog = false
      }

      return {
        props,
        state,
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

  .dialog-title, .cancel-btn span {
    color: $white;
  }

  .dialog-title span {
    font-size: 16px;
  }

  .cancel-btn span {
    font-size: 12px;
  }
</style>