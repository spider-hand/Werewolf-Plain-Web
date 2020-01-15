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
            <v-list-item-icon>
              <v-icon color="#757575">mdi-pound</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <span>{{ $t('Game.all') }}</span>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list-item 
            v-for="player in players"
            color="#F44336">
            <v-list-item-avatar>
              <v-img :src="player.avatar != null ? player.avatar : getAnonymousAvatar"></v-img>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <span>{{ player.name }}</span>
                <v-icon 
                  class="ml-1"
                  v-if="isOwner(player.id)"
                  color="#FAA61A"
                  size="16">
                  mdi-crown
                </v-icon>
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <DialogPlayerKickOut 
                v-if="!hasGameStarted && isMyselfOwner && !isMyself(player.id)"
                :player="player"
                :room="room" />
            </v-list-item-action>
            <v-list-item-action>
              <v-btn
                v-if="isGameOngoing && isJoiningThisGame && !isMyself(player.id) && myself.isAlive && player.isAlive"
                icon
                @click="vote(player)">
                <v-icon :color="myself.votedPlayer != null && player.id == myself.votedPlayer.id ? '#FFFFFF' : '#757575'">mdi-vote</v-icon>
              </v-btn>
             <v-btn
                v-if="!player.isAlive"
                icon>
                <v-icon color="#757575">mdi-emoticon-dead</v-icon>
              </v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn
                v-if="isGameOngoing && isJoiningThisGame && isWerewolf && !isMyself(player.id) && myself.isAlive && player.isAlive"
                icon
                @click="bite(player)">
                <v-icon :color="myself.bittenPlayer != null && player.id == myself.bittenPlayer.id ? '#FFFFFF' : '#757575'">mdi-skull</v-icon>
              </v-btn>
              <v-btn
                v-if="isGameOngoing && isJoiningThisGame && isSeer && !isMyself(player.id) && myself.isAlive && player.isAlive"
                icon
                @click="checkRole(player)">
                <v-icon :color="myself.divinedPlayer != null && player.id == myself.divinedPlayer.id ? '#FFFFFF' : '#757575'">mdi-eye</v-icon>
              </v-btn>
              <v-btn
                v-if="isGameOngoing && isJoiningThisGame && isKnight && !isMyself(player.id) && myself.isAlive && player.isAlive"
                icon
                @click="protect(player)">
                <v-icon :color="myself.protectedPlayer != null && player.id == myself.protectedPlayer.id ? '#FFFFFF' : '#757575'">mdi-shield-half-full</v-icon>
              </v-btn>
              <v-btn
                v-if="hasGameDone" 
                icon
                :href="'/profile/' + player.id"
                target="_blank">
                <v-icon color="#757575">mdi-account</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider v-if="isWerewolf || isSeer" />
          <v-list-item 
            v-if="isWerewolf || isSeer || isMedium"
            color="#F44336">
            <v-list-item-icon>
              <v-icon color="#757575">mdi-pound</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                <span v-if="isWerewolf">{{ $t('Game.werewolfChat') }}</span>
                <span v-if="isSeer">{{ $t('Game.resultsSeer') }}</span>
                <span v-if="isMedium">{{ $t('Game.resultsMedium') }}</span>
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
                :src="message.avatar != null ? message.avatar : getAnonymousAvatar"></v-img>
              <small 
                class="message-from"
                :style="{ color: message.from == 'GM' ? '#43B581' : (message.isFromGrave ? '#F44336': '#FFFFFF') }">
                {{ message.gameName }}
              </small>
              <div
                class="message-timestamp"
                :style="{ paddingLeft: message.gameName != '' ? '6px' : '0' }"
                >{{ message.timestamp.toDate().toLocaleString() }}
              </div>
              <div></div>
              <div class="message-body">{{ message.body }}</div>
            </div>
            <v-divider 
              class="message-divider"
              color="#FFFFFF" />
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
        :rules="messageRules"
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
        werewolfMessages: [],
        resultsSeer: [],
        isJoiningThisGame: false,
        isInitialTriggerDone: false,
        isInitialWerewolfTriggerDone: false,
        isInitialSeerTriggerDone: false,
        isInitialMediumTriggerDone: false,
        message: '',
        messageRules: [
          v => {
            if (!v) {
              return this.$t('Game.required')
            } else if (!v.replace(/\s/g, '').length) {
              return this.$t('Game.onlyWhitespace')
            } else if (v.length > 500) {
              return this.$t('Game.tooLong')
            } else {
              return true
            }
          }
        ],
        valid: true,
        isChatAllOpened: true,
        isWerewolfChatOpened: false,
        isResultsSeerOpened: false,
      }
    },
    computed: {
      isMyselfOwner() {
        try {
          if (firebase.auth().currentUser.uid == this.room.ownerId) {
            return true
          } else {
            return false
          }
        } catch (err) {
          return false
        }
      },
      hasGameStarted() {
        try {
          if (this.room.status != 'new') {
            return true
          } else {
            return false
          }
        } catch (err) {
          return true
        }
      },
      isGameOngoing() {
        try {
          if (this.room.status == 'ongoing') {
            return true
          } else {
            return false
          }
        } catch (err) {
          return false
        }
      },
      hasGameDone() {
        try {
          if (this.room.status == 'closed') {
            return true
          } else {
            return false
          }
        } catch (err) {
          return false
        }
      },
      isWerewolf() {
        try {
          if (this.myself.role == 'werewolf') {
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
      isAlive() {
        try {
          if (this.myself.isAlive) {
            return true
          } else {
            return false
          }
        } catch (err) {
          return true
        }
      },
      isFormVisible() {
        if (this.isJoiningThisGame && (this.isChatAllOpened && !this.room.isNight) || this.isWerewolfChatOpened) {
          return true
        } else {
          return false
        }
      },
      getMessages() {
        if (this.isChatAllOpened) {
          if (this.isAlive && this.isGameOngoing) {
            return this.messages.filter(function(message) {
              return !message.isFromGrave
            })
          } else {
            return this.messages
          }
        } else if (this.isWerewolfChatOpened) {
          if (this.isAlive) {
            return this.werewolfMessages.filter(function(werewolfMessage) {
              return !werewolfMessage.isFromGrave
            })
          } else {
            return this.werewolfMessages
          }
          return this.werewolfMessages
        } else if (this.isResultsSeerOpened) {
          return this.resultsSeer
        } else if (this.isResultsMediumOpened) {
          return this.resultsMedium
        } else {
          var individualMessages = []
          try {
            for (var i = 0; i < this.messages.length; i++) {
              if (this.messages[i].from == this.players[this.player - 1].id) {
                individualMessages.push(this.messages[i])
              }
            }
            return individualMessages
          } catch (err) {
            // Switch to all chat when the player has been kicked out or left
            this.player = 0
            return individualMessages
          }
        }
      },
      getAnonymousAvatar() {
        return require('../assets/anonymous.png')
      },
    },
    methods: {
      isOwner(uid) {
        if (uid == this.room.ownerId) {
          return true
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

        if (this.isWerewolfChatOpened) {
          // Save the message
          db.collection('rooms').doc(this.$route.params.id).collection('werewolfMessages').add({
            from: firebase.auth().currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            body: this.message,
            gameName: this.myself.name,
            avatar: this.myself.avatar,
            isFromGrave: !this.isAlive,
          })
          .then((docRef) => {
            this.message = ''
          })          
        } else {
          // Save the message
          db.collection('rooms').doc(this.$route.params.id).collection('messages').add({
            from: firebase.auth().currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            body: this.message,
            gameName: this.myself.name,
            avatar: this.myself.avatar,
            isFromGrave: !this.isAlive,
          })
          .then((docRef) => {
            this.message = ''
          })
        }
      },
      vote(player) {
        var db = firebase.firestore()
        var docRef = db.collection('rooms').doc(this.$route.params.id).collection('players').doc(firebase.auth().currentUser.uid)

        docRef.update({
          votedPlayer: player,
        })
      },
      bite(player) {
        var db = firebase.firestore()
        var docRef = db.collection('rooms').doc(this.$route.params.id).collection('players').doc(firebase.auth().currentUser.uid)

        docRef.update({
          bittenPlayer: player,
        })
      },
      checkRole(player) {
        var db = firebase.firestore()
        var docRef = db.collection('rooms').doc(this.$route.params.id).collection('players').doc(firebase.auth().currentUser.uid)

        docRef.update({
          divinedPlayer: player,
        })
      },
      protect(player) {
        var db = firebase.firestore()
        var docRef = db.collection('rooms').doc(this.$route.params.id).collection('players').doc(firebase.auth().currentUser.uid)

        docRef.update({
          protectedPlayer: player,
        })
      },
    },
    watch: {
      player: function(newVal, oldVal) {
        const that = this
        if (newVal == 0 || newVal === undefined) {
          that.isChatAllOpened = true
          that.isWerewolfChatOpened = false
        } else if (newVal == that.players.length + 1) {
          // When the extra chat is opened
          if (that.myself.role == 'werewolf') {
            that.isWerewolfChatOpened = true
            that.isChatAllOpened = false
          } else if (that.myself.role == 'seer') {
            that.isResultsSeerOpened = true
            that.isChatAllOpened = false
          } else if (that.myself.role == 'medium') {
            that.isResultsMediumOpened = true
            that.isChatAllOpened = false
          }
        } else {
          // When an individual log is opened
          that.isChatAllOpened = false
          that.isWerewolfChatOpened = false
          that.isResultsSeerOpened = false
          that.isResultsMediumOpened = false
        }
      },
      myself: function(newVal, oldVal) {
        // Get messages depending on the player's role
        if (oldVal == null || oldVal.role == null && newVal.role != null) {
          var db = firebase.firestore()
          var docRef = db.collection('rooms').doc(this.$route.params.id)

          // Get werewolf's messages if the player's role is werewolf
          if (this.isWerewolf) {
            docRef.collection('werewolfMessages').orderBy('timestamp', 'asc').get()
              .then((querySnapShot) => {
                Promise.all(querySnapShot.docs.map((doc) => {
                  this.werewolfMessages.push(doc.data())
                }))
                .then(() => {
                  docRef.collection('werewolfMessages').orderBy('timestamp', 'desc').limit(1)
                    .onSnapshot((querySnapShot) => {
                      querySnapShot.forEach((doc) => {
                        if (!doc.metadata.hasPendingWrites && this.isInitialWerewolfTriggerDone) {
                          this.werewolfMessages.push(doc.data())
                        }
                        this.isInitialWerewolfTriggerDone = true
                      })
                  })
                })
            })
          }

          // Get results if the player's role is seer
          if (this.isSeer) {
            docRef.collection('resultsSeer').orderBy('timestamp', 'asc').get()
              .then((querySnapShot) => {
                Promise.all(querySnapShot.docs.map((doc) => {
                  this.resultsSeer.push(doc.data())
                }))
                .then(() => {
                  docRef.collection('resultsSeer').orderBy('timestamp', 'desc').limit(1)
                    .onSnapshot((querySnapShot) => {
                      querySnapShot.forEach((doc) => {
                        if (!doc.metadata.hasPendingWrites && this.isInitialSeerTriggerDone) {
                          this.resultsSeer.push(doc.data())
                        }
                        this.isInitialSeerTriggerDone = true
                      })
                  })
                })
            })
          }

          // Get results if the player's role is medium
          if (this.isMedium) {
            docRef.collection('resultsMedium').orderBy('timestamp', 'asc').get()
              .then((querySnapShot) => {
                Promise.all(querySnapShot.docs.map((doc) => {
                  this.resultsMedium.push((doc.data()))
                }))
                .then(() => {
                  docRef.collection('resultsMedium').orderBy('timestamp', 'desc').limit(1)
                    .onSnapshot((querySnapShot) => {
                      querySnapShot.forEach((doc) => {
                        if (!doc.metadata.hasPendingWrites && this.isInitialSeerTriggerDone) {
                          this.resultsMedium.push(doc.data())
                        }
                        this.isInitialMediumTriggerDone = true                        
                      })
                  })
                })
            })
          }   
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
              }
            }
          })
        })
      })

      // Get all current messages
      docRef.collection('messages').orderBy('timestamp', 'asc').get()
        .then((querySnapShot) => {
          Promise.all(querySnapShot.docs.map((doc) => {
            this.messages.push(doc.data())
          })).then(() => {
            // After reading all the current messages
            // Set listener and retrieve the latest message every time when a message is added
            docRef.collection('messages').orderBy('timestamp', 'desc').limit(1).onSnapshot((querySnapShot) => {
                querySnapShot.forEach((doc) => {
                  if (!doc.metadata.hasPendingWrites && this.isInitialTriggerDone) {
                    this.messages.push(doc.data())
                  }
                  this.isInitialTriggerDone = true
                })
            })
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

  .message-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin: 5px 14px 0 0;
    float: left;
  }

  .message-from {
    display: inline-block;
    font-weight: 500;
  }

  .message-timestamp {
    display: inline-block;
    color: #72767D;
    font-size: 12px;
  }

  .message-body {
    display: inline-block;
    max-width: calc(100% - 100px);
    padding-top: 4px;
    font-size: 15px;
    word-break: break-all;
    white-space: pre-wrap;
    color: #DCDDDE;
  }

  .message-divider {
    margin: 10px 30px 0 0;
    opacity: 0.06;
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

  @media (max-width: 450px) {
    .message-body {
      font-size: 14px;
    }
  }
</style>
