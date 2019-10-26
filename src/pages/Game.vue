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
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div 
      class="message-list"
      :style="{
          height: $viewport.height - 199 + 'px',
          width: $viewport.width > 450 ? $viewport.width - 337 + 'px' : $viewport.width + 'px' }">
        <ul>
          <li v-for="message in messages">
            <div class="message">
              <v-img 
                class="message-avatar"
                src="https://cdn.vuetifyjs.com/images/lists/1.jpg"></v-img>
              <div class="message-body">{{ message.body }}</div>
            </div>
          </li>
        </ul>
    </div>
    <v-form
      ref="form"
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
  import 'firebase/firestore'

  export default {
    data() {
      return {
        players: [],
        messages: [],
        message: '',
        valid: true,
      }
    },
    methods: {
      validate() {
        if (this.$refs.form.validate()) {
          this.sendMessage()
        }
      },
      sendMessage() {
        var db = firebase.firestore()
        var numberOfMessages = this.messages.length

        // Save the message
        db.collection('rooms').doc(this.$store.state.game.roomId).collection('messages').doc('message' + numberOfMessages).set({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          body: this.message,
          from: firebase.auth().currentUser.uid,
        })
        .then(() => {
          this.message = ''
        })
      }
    },
    mounted() {
      var db = firebase.firestore()
      var docRef = db.collection('rooms').doc(this.$store.state.game.roomId)

      // Set listener and update the players when entering and leaving the room
      docRef.collection('players').onSnapshot((querySnapShot) => {
        querySnapShot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            this.players.push(change.doc.data())
          }
          if (change.type === 'removed') {
            for (var i = 0; i < this.players.length; i++) {
              if (this.players[i].id == change.doc.data().id) {
                this.players.splice(i, 1)
              }
            }
          }
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
    margin: 0 14px 0 0;
    float: left;
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
