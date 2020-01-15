<template>
  <div>
    <v-app-bar color="#2C2F33">
      <v-btn
        icon
        color="#757575"
        @click="$router.push({ name: 'room-list' })">
        <v-icon>mdi-arrow-left-bold</v-icon>
      </v-btn>
      <div class="flex-grow-1"></div>
      <v-btn 
        v-if="isOwner() && !hasGameStarted"
        text
        :color="isGameReady ? '#F44336' : '#757575'"
        @click="startGame">{{ $t('HeaderGame.start') }}</v-btn>
      <DialogRoomLeave 
        v-if="isJoiningThisGame && !hasGameStarted"
        :myself="myself"
        :room="room" />
      <DialogRole
        v-if="myself != null && myself.role != null" 
        :myself="myself" />
      <DialogRoomDetails :room="room" />
    </v-app-bar>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'
  import 'firebase/functions'

  import DialogRole from '@/components/DialogRole'
  import DialogRoomDetails from '@/components/DialogRoomDetails'
  import DialogRoomLeave from '@/components/DialogRoomLeave'

  export default {
    props: [
      'room',
      'myself',
      'isJoiningThisGame',
    ],
    components: {
      DialogRole,
      DialogRoomDetails,
      DialogRoomLeave,
    },
    computed: {
      isGameReady() {
        if (this.room.numberOfParticipants == this.room.capacity) {
          return true
        } else {
          return false
        }
      },
      hasGameStarted() {
        if (this.room.status != 'new') {
          return true
        } else {
          return false
        }
      },      
    },
    methods: {
      startGame() {
        if (this.room.numberOfParticipants == this.room.capacity) {
          var db = firebase.firestore()
          var docRef = db.collection('rooms').doc(this.$route.params.id)
          var promises = []

          var updateRoom = 
            docRef.update({
              status: 'ongoing',
            })

          var sendMessage = 
            docRef.collection('messages').add({
              from: 'GM',
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              body: this.$t('HeaderGame.startMessage', this.room.language),
              gameName: 'GM',
              avatar: '',
              isFromGrave: false,
            })

          promises.push(updateRoom)
          promises.push(sendMessage)

          Promise.all(promises)
            .then(() => {
              // Decide the roles randomly
              this.decideRoles(this.room.capacity)

              // Add a scheduled task to trigger cloud functions
              this.callCloudFunction()
            })
        } else {
          console.log('This room is not ready.')
        }
      },
      decideRoles(capacity) {
        var roles
        switch (capacity) {
          case 5:
            roles = ['villager', 'villager', 'villager', 'werewolf', 'seer']
            break
          case 9:
            roles = ['villager', 'villager', 'villager', 'villager', 
            'werewolf', 'werewolf', 'seer', 'knight', 'minion']
            break
          case 11:
            roles = ['villager', 'villager', 'villager', 'villager', 
            'villager', 'werewolf', 'werewolf', 'seer', 'medium', 'knight', 'minion']
            break
          case 15:
            roles = ['villager', 'villager', 'villager', 'villager', 
            'villager', 'villager', 'villager', 'villager', 'werewolf', 
            'werewolf', 'werewolf', 'seer', 'medium', 'knight', 'minion']
            break
        }

        // Shuffle roles
        for (var i = roles.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1))
          var temp = roles[i]
          roles[i] = roles[j]
          roles[j] = temp
        }

        var db = firebase.firestore()
        var collectionRef = db.collection('rooms').doc(this.$route.params.id).collection('players')

        var k = 0
        collectionRef.get()
          .then((querySnapShot) => {
            querySnapShot.forEach((doc) => {
              var docRef = collectionRef.doc(doc.id)

              docRef.update({
                role: roles[k]
              })

              k++
            })
          })
      },
      callCloudFunction() {
        var functions = firebase.functions()
        var addTasks = functions.httpsCallable('addTasks')
        
        addTasks({
          roomId: this.$route.params.id,
          dayLength: this.room.dayLength,
          nightLength: this.room.nightLength,
          language: this.room.language,
        })
      },
      isOwner() {
        try {
          if (firebase.auth().currentUser) {
            if (this.room.ownerId == firebase.auth().currentUser.uid) {
              return true
            } else {
              return false
            }          
          } else {
            return false
          }
        } catch (err) {
          return false
        }
      },
    }
  }
</script>

<style scoped>
  
</style>