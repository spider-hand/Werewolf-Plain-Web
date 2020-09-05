<template>
  <v-dialog
    persistent
    max-width="400"
    v-model="state.dialog">
    <template v-slot:activator="{ on }">
      <v-btn
        class="leave-btn" 
        text
        v-on="on">
        <span>Leave</span>
      </v-btn>
    </template>
    <v-card class="dialog-wrapper">
      <v-card-title class="dialog-title">
        <span>Leave game</span>
      </v-card-title>
      <v-card-text class="dialog-text">
        <v-container>
          <span>Are you sure you want to leave this game?</span>
        </v-container>
      </v-card-text>
      <v-card-actions class="dialog-actions">
        <div class="flex-grow-1"></div>
        <v-btn 
          class="confirm-btn"
          depressed
          >
          <span>LEAVE</span>
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
  import { defineComponent, reactive } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'

  export default defineComponent({
    setup(props, context) {
      const route = context.root.$route
      const router = context.root.$router

      const state = reactive<{
        dialog: boolean,
      }>({
        dialog: false,
      })

      function leaveRoom(): void {
        const db = firebase.firestore()
        const docRef = db.collection('rooms').doc(route.params.id)
        const promises0 = [] as Promise<void | firebase.firestore.DocumentReference>[]
        const promises1 = [] as Promise<void>[]

        const sendMessage =
          docRef.collection('messages').add({
            from: 'GM',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            body: 'A player has left', // TODO: Set a message
            gameName: 'GM',
            avatar: '',
            isFromGrave: false,
          })

        const removePlayer =
          docRef.collection('players')
                .doc(firebase.auth().currentUser!.uid)
                .delete()

        promises0.push(sendMessage)
        promises0.push(removePlayer)

        Promise.all(promises0).then(() => {
          docRef.get().then((doc) => {
            // Delete the entire room doc and its subcollection when the owner left
            if (doc.data()!.ownerId! === firebase.auth().currentUser!.uid) {
              const deleteRoom = docRef.delete()

              const deletePlayers = 
                docRef.collection('players').get()
                  .then((querySnapshot) => {
                    Promise.all(querySnapshot.docs.map((doc) => {
                      doc.ref.delete()
                    }))
                  })

              const deleteMessages =
                docRef.collection('messages').get()
                  .then((querySnapshot) => {
                    Promise.all(querySnapshot.docs.map((doc) => {
                      doc.ref.delete()
                    }))
                  })

              promises1.push(deleteRoom)
              promises1.push(deletePlayers)
              promises1.push(deleteMessages)
            } else {
              const updateRoom =
                docRef.update({
                  numberOfParticipants: firebase.firestore.FieldValue.increment(-1)
                })

              promises1.push(updateRoom)

              Promise.all(promises1).then(() => {
                router.push({
                  name: 'room-list',
                })
              })
            }
          })
        })
      }

      function cancel(): void {
        state.dialog = false
      }

      return {
        state,
        leaveRoom,
        cancel
      }
    }
  })
</script>

<style lang="scss" scoped>
  .leave-btn span {
    color: $gray2;
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

  .dialog-title, .confirm-btn, .cancel-btn span {
    color: $white;
  }
</style>