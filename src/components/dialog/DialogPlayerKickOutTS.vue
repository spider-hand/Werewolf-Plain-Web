<template>
  <div>
    
  </div>
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

    setup(props) {
      const state = reactive<{
        dialog: boolean,
      }>({
        dialog: false,
      })

      function kickOut(): void {
        const db = firebase.firestore()
        const docRef = db.collection('rooms').doc(/** $route */)

        docRef.collection('messages').add({
          from: 'GM',
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          body: 'A player has been kicked out.', // TODO: Set a message
          gameName: 'GM',
          avatar: '',
          isFromGrave: false,
        })

        docRef.collection('players').doc(props.player.uid).delete()

        docRef.update({
          numberOfParticipants: firebase.firestore.FieldValue.increment(-1),
          banList: firebase.firestore.FieldValue.arrayUnion(props.player.uid)
        })
      }

      function cancel(): void {
        state.dialog = false
      }

      return {
        state,
        kickOut,
        cancel
      }
    }
  })
</script>

<style lang="scss" scoped>
  
</style>