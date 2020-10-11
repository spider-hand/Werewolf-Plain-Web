<template>
  <v-dialog 
    persistent
    max-width="400"
    v-model="state.dialog">
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        v-on="on">
        <v-icon class="icon-kick-out">mdi-cancel</v-icon>
      </v-btn>
    </template>
    <v-card class="dialog-wrapper">
      <v-card-title class="dialog-title">
        <span>Kick '{{ props.player.name }}'</span>
      </v-card-title>
      <v-card-text class="dialog-text">
        <v-container>
          <span>Are you sure you want to kick this player out?</span>
        </v-container>
      </v-card-text>
      <v-card-actions class="dialog-actions">
        <div class="flex-grow-1"></div>
        <v-btn
          class="confirm-btn"
          depressed
          @click="state.isButtonEnabled ? kickOut() : null">
          <span>Confirm</span>
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
  import { defineComponent, reactive, PropType } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/firestore'

  import { Player, Room } from '@/types/index'

  export default defineComponent({
    props: {
      player: {
        type: Object as PropType<Player>,
        required: true,
      },
      room: {
        type: Object as PropType<Room>,
        required: true,
      },
    },

    setup(props, context) {
      const route = context.root.$route

      const state = reactive<{
        dialog: boolean,
        isButtonEnabled: boolean,
      }>({
        dialog: false,
        isButtonEnabled: true,
      })

      function kickOut(): void {
        const db = firebase.firestore()
        const docRef = db.collection('rooms').doc(route.params.id)
        const promises = [] as Promise<void | firebase.firestore.DocumentReference>[]
        // Disable the button while the function is executed
        state.isButtonEnabled = false

        const sendMessage = 
          docRef.collection('messages').add({
            from: 'GM',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            body: `${props.player.name} has been kicked out.`,
            gameName: 'GM',
            avatar: '',
            isFromGrave: false,
          })

        const deletePlayer = 
          docRef.collection('players').doc(props.player.uid).delete()

        const updateRoom = 
          docRef.update({
            numberOfParticipants: firebase.firestore.FieldValue.increment(-1),
            banList: firebase.firestore.FieldValue.arrayUnion(props.player.uid)
          })

        promises.push(sendMessage)
        promises.push(deletePlayer)
        promises.push(updateRoom)

        Promise.all(promises)
          .then(() => {
            state.isButtonEnabled = true
            state.dialog = false
          })
      }

      function cancel(): void {
        state.dialog = false
      }

      return {
        props,
        state,
        kickOut,
        cancel
      }
    }
  })
</script>

<style lang="scss" scoped>
  .icon-kick-out {
    color: $gray2 !important;
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

  .confirm-btn {
    background-color: $red1 !important;
  }

  .dialog-title span {
    font-size: 16px;
  }

  .dialog-title, .confirm-btn, .cancel-btn span {
    color: $white;
  }

  .confirm-btn, .cancel-btn span {
    font-size: 12px;
  }
</style>