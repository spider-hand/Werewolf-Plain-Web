<template>
  <div id="game-page">
    <v-navigation-drawer
      width="320"
      absolute
      permanent
      color="#2F3136">
      <v-list>
        <v-list-item-group v-model="player">
          <v-list-item color="#F44336">
            <v-list-item-avatar>
              <v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <span>All</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list-item v-for="player in players">
            <v-list-item-avatar>
              <v-img :src="player.avatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <span>{{ player.name }}</span>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <DialogPlayerKickOut 
                v-if="!hasGameStarted && isOwner() && !isMyself(player.id)"
                :uid="player.id" />
            </v-list-item-action>
            <v-list-item-action>
              <v-btn
                v-if="hasGameStarted && isJoiningThisGame && !isMyself(player.id) && player.isAlive"
                icon
                @click="vote(player.id)">
                <v-icon :color="player.id == myself.votedPlayer ? '#FFFFFF' : '#757575'">mdi-vote</v-icon>
              </v-btn>
             <v-btn
                v-if="hasGameStarted && !player.isAlive"
                icon>
                <v-icon color="#757575">mdi-emoticon-dead</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn
                v-if="hasGameStarted && isJoiningThisGame && isWolf && !isMyself(player.id) && player.isAlive"
                icon
                @click="bite(player.id)">
                <v-icon :color="player.id == myself.bittenPlayer ? '#FFFFFF' : '#757575'">mdi-skull</v-icon>
              </v-btn>
              <v-btn
                v-if="hasGameStarted && isJoiningThisGame && isSeer && !isMyself(player.id) && player.isAlive"
                icon
                @click="checkRole(player.id)">
                <v-icon :color="player.id == myself.divinedPlayer ? '#FFFFFF' : '#757575'">mdi-eye</v-icon>
              </v-btn>
              <v-btn
                v-if="hasGameStarted && isJoiningThisGame && isKnight && !isMyself(player.id) && player.isAlive"
                icon
                @click="protect(player.id)">
                <v-icon :color="player.id == myself.protectedPlayer ? '#FFFFFF' : '#757575'">mdi-shield-half-full</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="isWolf" />
          <v-list-item 
            v-if="isWolf"
            color="red">
            <v-list-item-avatar>
              <v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <span>Wolf Chat</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <div 
      class="message-list"
      :style="{
          height: isFormVisible ? $viewport.height - 207 + 'px' : $viewport.height - 64 + 'px',
          width: $viewport.width > 450 ? $viewport.width - 337 + 'px' : $viewport.width + 'px' }">
        <ul>
          <li v-for="message in getMessages">
            <div class="message">
              <v-img 
                class="message-avatar"
                :src="message.avatar"></v-img>
              <small class="message-from">{{ message.gameName }}</small>
              <div class="message-body">{{ message.body }}</div>
            </div>
            <v-divider class="message-divider" />
          </li>
        </ul>
    </div>
    <v-form
      ref="form"
      v-if="isFormVisible"
      v-model="valid"
      lazy-validation>
      <v-textarea
        class="message-input"
        :style="{ width: $viewport.width > 450 ? $viewport.width - 337 + 'px' : $viewport.width + 'px' }"
        :rules="[v => !!v || 'Required']"
        v-model="message"
        background-color="#40444B"
        solo
        flat
        dark
        hide-details
        name="input-7-4">
      </v-textarea>
      <v-btn 
        class="send-button"
        depressed
        color="#2F3136"
        small
        @click="validate">
        <v-icon color="#FFFFFF">mdi-send</v-icon>
      </v-btn>
    </v-form>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'

  import DialogPlayerKickOut from '@/components/DialogPlayerKickOut'

  export default {
    components: {
      DialogPlayerKickOut,
    },
    data() {
      return {
        room: null,
        myself: null,
        player: 0,
        players: [],
        messages: [],
        wolfMessages: [],
        isJoiningThisGame: false,
        isInitialTriggerDone: false,
        isInitialWolfTriggerDone: false,
        message: '',
        valid: true,
        isChatAllOpened: true,
        isWolfChatOpened: false,
      }
    },
    computed: {
      hasGameStarted() {
        if (this.room.status != 'new') {
          return true
        } else {
          return false
        }
      },
      isWolf() {
        try {
          if (this.myself.role == 'wolf') {
            return true
          } else {
            return false
          }
        } catch (err) {
          return false
        }
      },
      isSeer() {
        try {
          if (this.myself.role == 'seer') {
            return true
          } else {
            return false
          }
        } catch (err) {
          return false
        }
      },
      isMedium() {
        try {
          if (this.myself.role == 'medium') {
            return true
          } else {
            return false
          }
        } catch (err) {
          return false
        }
      },
      isKnight() {
        try {
          if (this.myself.role == 'knight') {
            return true
          } else {
            return false
          }
        } catch (err) {
          return false
        }
      },
      isFormVisible() {
        if (this.isJoiningThisGame && (this.isChatAllOpened && !this.room.isNight) || this.isWolfChatOpened) {
          return true
        } else {
          return false
        }
      },
      getMessages() {
        if (this.isChatAllOpened) {
          return this.messages
        } else if (this.isWolfChatOpened) {
          return this.wolfMessages
        } else {
          var individualMessages = []
          for (var i = 0; i < this.messages.length; i++) {
            if (this.messages[i].from == this.players[this.player - 1].id) {
              individualMessages.push(this.messages[i])
            }
          }
          return individualMessages
        }
      },
    },
    methods: {
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
      validate() {
        if (this.$refs.form.validate()) {
          this.sendMessage()
        }
      },
      sendMessage() {
        var db = firebase.firestore()

        if (this.isWolfChatOpened) {
          // Save the message
          db.collection('rooms').doc(this.$route.params.id)
            .collection('wolfMessages').add({
            from: firebase.auth().currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            body: this.message,
            gameName: this.myself.name,
            avatar: this.myself.avatar,
          })
          .then((docRef) => {
            this.message = ''
          })          
        } else {
          // Save the message
          db.collection('rooms').doc(this.$route.params.id)
            .collection('messages').add({
            from: firebase.auth().currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            body: this.message,
            gameName: this.myself.name,
            avatar: this.myself.avatar,
          })
          .then((docRef) => {
            this.message = ''
          })
        }
      },
      vote(uid) {
        var db = firebase.firestore()
        var docRef = db.collection('rooms').doc(this.$route.params.id).collection('players').doc(firebase.auth().currentUser.uid)

        docRef.update({
          votedPlayer: uid,
        })
      },
      bite(uid) {
        var db = firebase.firestore()
        var docRef = db.collection('rooms').doc(this.$route.params.id).collection('players').doc(firebase.auth().currentUser.uid)

        docRef.update({
          bittenPlayer: uid,
        })
      },
      checkRole(uid) {
        var db = firebase.firestore()
        var docRef = db.collection('rooms').doc(this.$route.params.id).collection('players').doc(firebase.auth().currentUser.uid)

        docRef.update({
          divinedPlayer: uid,
        })
      },
      protect(uid) {
        var db = firebase.firestore()
        var docRef = db.collection('rooms').doc(this.$route.params.id).collection('players').doc(firebase.auth().currentUser.uid)

        docRef.update({
          protectedPlayer: uid,
        })
      },
    },
    watch: {
      player: function(newVal, oldVal) {
        const that = this
        if (newVal == 0 || newVal === undefined) {
          that.isChatAllOpened = true
          that.isWolfChatOpened = false
        } else if (newVal == that.players.length + 1) {
          that.isWolfChatOpened = true
          that.isChatAllOpened = false
        } else {
          that.isChatAllOpened = false
          that.isWolfChatOpened = false
        }
      }
    },
    mounted() {
      this.$emit('isJoiningThisGame', false)

      var db = firebase.firestore()
      var docRef = db.collection('rooms').doc(this.$route.params.id)

      // Listener for this room document
      docRef.onSnapshot((doc) => {
        if (!doc.exists) {
          // Force the player to exit the game if the room is already deleted
          this.$router.push({
            name: 'room-list',
          })
        } else {
          this.room = doc.data()
          this.$emit('updateRoom', doc.data())
        }
      })

      // Listener for players collection
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
                this.isJoiningThisGame = true
                this.$emit('isJoiningThisGame', true)

                if (change.type === 'added' || change.type === 'modified') {
                    // Update my data as a player
                    this.myself = change.doc.data()
                    this.$emit('updateMyself', change.doc.data())
                } else {
                  // Force to exit the game when the player's doc is removed
                  this.$router.push({
                    name: 'room-list',
                  })
                }

                // Get wolf's messages if the player's role is wolf
                if (this.isWolf) {
                  docRef.collection('wolfMessages').orderBy('timestamp', 'asc').get().then((querySnapShot) => {
                    querySnapShot.forEach((doc) => {
                      this.wolfMessages.push(doc.data())
                    })
                  })

                  docRef.collection('wolfMessages').orderBy('timestamp', 'desc').limit(1).onSnapshot((querySnapShot) => {
                    querySnapShot.forEach((doc) => {
                      if (!doc.metadata.hasPendingWrites && this.isInitialWolfTriggerDone) {
                        this.wolfMessages.push(doc.data())
                      }
                      this.isInitialWolfTriggerDone = true
                    })
                  })
                }              
              }
            }
          })
        })
      })

      // Get all current messages
      docRef.collection('messages').orderBy('timestamp', 'asc').get().then((querySnapShot) => {
        querySnapShot.forEach((doc) => {
          this.messages.push(doc.data())
        })
      })

      // Set listener and retrieve the latest message every time when a message is added
      docRef.collection('messages').orderBy('timestamp', 'desc').limit(1).onSnapshot((querySnapShot) => {
          querySnapShot.forEach((doc) => {
            if (!doc.metadata.hasPendingWrites && this.isInitialTriggerDone) {
              this.messages.push(doc.data())
            }
            this.isInitialTriggerDone = true
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
    margin: 5px 0 15px 0;
  }

  span {
    color: #FFFFFF;
  }

  #game-page {
    position: relative;
    height: 100%;
    background-color: #36393F;
  }

  .message-list {
    position: absolute;
    right: 0px;
    padding-top: 20px;
    overflow-y: scroll;
    background-color: #36393F;
  }

  .message {
    padding: 0 3px;
    white-space: pre-wrap;
    color: #FFFFFF;
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
  }

  .message-divider {
    margin: 10px 30px 0 0;
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
