<template>
  <div id="game-page">
    <v-navigation-drawer
      width="320"
      absolute
      permanent>
      <v-list>
        <v-list-item
          v-for="player in players"
          @click="">
          <v-list-item-avatar>
            <v-img :src="player.avatar"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{ player.name }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action v-if="isOwner() == true && isMyself(player.id) == false">
            <DialogPlayerKickOut :uid="player.id" />
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div 
      class="message-list"
      :style="{
          height: isChatVisible == true ? $viewport.height - 199 + 'px' : $viewport.height - 64 + 'px',
          width: $viewport.width > 450 ? $viewport.width - 337 + 'px' : $viewport.width + 'px' }">
        <ul>
          <li v-for="message in messages">
            <div class="message">
              <v-img 
                class="message-avatar"
                :src="message.avatar"></v-img>
              <small class="message-from">{{ message.gameName }}</small>
              <div class="message-body">{{ message.body }}</div>
            </div>
          </li>
        </ul>
    </div>
    <v-form
      ref="form"
      v-if="isChatVisible"
      v-model="valid"
      lazy-validation>
      <v-textarea
        class="message-input"
        :style="{ width: $viewport.width > 450 ? $viewport.width - 337 + 'px' : $viewport.width + 'px' }"
        :rules="[v => !!v || 'Required']"
        v-model="message"
        solo
        flat
        hide-details
        name="input-7-4">
      </v-textarea>

      <v-btn 
        class="send-button"
        depressed
        small
        @click="validate">
        <v-icon color="blue">mdi-send</v-icon>
      </v-btn>
    </v-form>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'
  import { mapActions } from 'vuex'

  import DialogPlayerKickOut from '@/components/DialogPlayerKickOut'

  export default {
    components: {
      DialogPlayerKickOut,
    },
    data() {
      return {
        room: null,
        myself: null,
        players: [],
        messages: [],
        message: '',
        valid: true,
        isChatEnabled: false,
      }
    },
    computed: {
      isChatVisible() {
        if (this.isChatEnabled) {
          return true
        } else {
          return false
        }
      },
    },
    methods: {
      ...mapActions([
        'leaveGame',
      ]),
      validate() {
        if (this.$refs.form.validate()) {
          this.sendMessage()
        }
      },
      isOwner() {
        if (firebase.auth().currentUser) {
          if (firebase.auth().currentUser.uid == this.room.ownerId) {
            return true
          } else {
            return false
          }          
        } else {
          return false
        }
      },
      isMyself(uid) {
        if (firebase.auth().currentUser) {
          if (firebase.auth().currentUser.uid == uid) {
            return true
          } else {
            return false
          }          
        } else {
          return false
        }
      },
      isJoiningThisGame() {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            var db = firebase.firestore()
            var docRef = db.collection('rooms').doc(this.$route.params.id)
              .collection('players').doc(firebase.auth().currentUser.uid)
            
            docRef.get().then((doc) => {
                if (doc.exists) {
                  this.isChatEnabled = true
                  this.$emit('isJoiningThisGame', true)
                } else {
                  this.isChatEnabled = false
                  this.$emit('isJoiningThisGame', false)
                }
              })
          } else {
            this.isChatEnabled = false
            this.$emit('isJoiningThisGame', false)
          }
        })
      },
      sendMessage() {
        var db = firebase.firestore()
        var numberOfMessages = this.messages.length

        // Save the message
        db.collection('rooms').doc(this.$store.state.game.roomId)
          .collection('messages').doc('message' + numberOfMessages).set({
          from: firebase.auth().currentUser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          body: this.message,
          gameName: this.myself.name,
          avatar: this.myself.avatar,
        })
        .then(() => {
          this.message = ''
        })
      }
    },
    mounted() {
      this.isJoiningThisGame()

      var db = firebase.firestore()
      var docRef = db.collection('rooms').doc(this.$route.params.id)

      docRef.onSnapshot((doc) => {
        if (!doc.exists) {
          // Force the player to exit the game if the room is already deleted
          this.leaveGame()
          this.$router.push({
            name: 'room-list',
          })
        } else {
          this.room = doc.data()
          this.$emit('updateRoom', doc.data())
        }
      })

      // Listener for player's status
      docRef.collection('players').onSnapshot((querySnapShot) => {
        querySnapShot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            this.players.push(change.doc.data())
          }

          if (change.type === 'modified') {
            for (var i = 0; i < this.players.length; i++) {
              if (this.players[i].id == change.doc.data().id) {
                this.players[i] = change.doc.data()
              }
            }
          }

          if (change.type === 'removed') {
            for (var i = 0; i < this.players.length; i++) {
              if (this.players[i].id == change.doc.data().id) {
                this.players.splice(i, 1)
              }
            }
          }

          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              if (user.uid == change.doc.data().id) {
                if (change.type === 'added' || change.type === 'modified') {
                    // Update my data as a player
                    this.myself = change.doc.data()
                } else {
                  // Force to exit the game when the player's doc is removed
                  this.leaveGame()
                  this.$router.push({
                    name: 'room-list',
                  })
                }                
              }
            }
          })
        })
      })

      // Set listener and retrieve the latest message every time when a message is added
      docRef.collection('messages').orderBy('timestamp', 'desc').limit(1).onSnapshot((querySnapShot) => {
          querySnapShot.forEach((doc) => {
            if (!doc.metadata.hasPendingWrites) {
              this.messages.push(doc.data())
            }
          })
      })
    }
  }
</script>

<style scoped>
  ul {
    list-style: none;
  }

  li {
    margin-bottom: 45px;
  }

  #game-page {
    position: relative;
    height: 100%;
  }

  .message-list {
    position: absolute;
    right: 0px;
    padding-top: 20px;
    overflow-y: scroll;
  }

  .message {
    padding: 0 12px;
    white-space: pre-wrap;
  }

  .message-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin: 5px 14px 0 0;
    float: left;
  }

  .message-from {
    display: block;
    padding: 0 15px 2px 0;
    font-weight: 500;
  }

  .message-body {
    display: inline-block;
    max-width: calc(100% - 100px);
    padding: 4px 15px;
    font-size: 16px;
    word-break: break-all;
    background-color: #FFFFFF;
    border-radius: 5px;
  }

  .message-input {
    position: fixed; 
    right: 0px; 
    bottom: 28px;
  }

  .send-button {
    position: fixed;
    right: 20px;
    bottom: 0px;
  }
</style>
