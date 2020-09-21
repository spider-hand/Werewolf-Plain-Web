<template>
  <v-dialog
    persistent
    max-width="600"
    v-model="state.dialog">
    <template v-slot:activator="{ on }">
      <v-btn
        class="details-btn"
        text
        v-on="on">
        <span>Details</span>
      </v-btn>
    </template>
    <v-card class="dialog-wrapper">
      <v-card-title class="dialog-title">
        <v-icon
          class="private-icon" 
          v-if="props.room.isPrivate">mdi-lock</v-icon>
        <span>{{ props.room.name }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <div class="description-wrapper">
            <div class="text-header">
              <span>Description</span>
            </div>
            <div class="dialog-text">
              <span>{{ props.room.description }}</span>
            </div>
          </div>
          <div class="capacity-wrapper">
            <div class="text-header">
              <span>Capacity</span>
            </div>
            <div class="dialog-text">
              <span>{{ props.room.capacity }}</span>
            </div>
          </div>
          <v-row>
            <v-col 
              class="text-header pb-0"
              cols="3">
              <span>Daytime</span>
            </v-col>
            <v-col
              class="text-header pb-0"
              cols="3">
              <span>Night</span>
            </v-col>
          </v-row>
          <v-row>
            <v-col 
              class="dialog-text pt-0"
              cols="3">
              <span>{{ props.room.dayLength }} minutes</span>
            </v-col>
            <v-col
              class="dialog-text pt-0"
              cols="3">
              <span>{{ props.room.nightLength }} minutes</span>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions class="dialog-actions">
        <div class="flex-grow-1"></div>
        <v-btn
          class="close-btn"
          text
          @click="close">
          <span>CLOSE</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { defineComponent, reactive, PropType } from '@vue/composition-api'

  import { Room } from '@/types/index'

  export default defineComponent({
    props: {
      room: {
        type: Object as PropType<Room>,
        required: true,
      }
    },

    setup(props, context) {

      const state = reactive<{
        dialog: boolean,
      }>({
        dialog: false,
      })

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

  .dialog-title span {
    color: $white;
    font-size: 16px;
  }

  .text-header span {
    color: $gray3;
    font-size: 12px;
    font-weight: 500;
  }

  .dialog-text span {
    color: $white;
  }

  .description-wrapper {
    padding: 0 0 15px 0;
  }

  .details-btn span {
    text-transform: none;
    color: $white;
  }

  .private-icon {
    color: $gray2;
  }

  .close-btn span {
    color: $white;
    font-size: 12px;
  }
</style>