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
      </v-card-text>
      <v-card-actions class="dialog-actions">
        <div class="flex-grow-1"></div>
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

  export default defineComponent({

    setup(props, context) {

      const state = reactive<{
        dialog: boolean,
      }>({
        dialog: false,
      })

      function cancel(): void {
        state.dialog = false
      }

      return {
        state,
        cancel,
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

  .dialog-text span {
    color: $gray4;
  }

  .dialog-actions {
    background-color: $black2;
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