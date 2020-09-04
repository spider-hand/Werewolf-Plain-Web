<template>
  <div>
    <v-btn
      class="leave-btn" 
      text>
      <span>Leave</span>
    </v-btn>
  </div>
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
    color: $gray2 !important;
  }
</style>