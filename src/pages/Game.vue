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
                class="message-avator"
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
    props: [
      'roomId',
    ],
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
        const that = this
        var db = firebase.firestore()
        var numberOfMessages = this.messages.length

        // Save the message
        db.collection('rooms').doc(this.roomId).collection('messages').doc('message' + numberOfMessages).set({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          body: that.message,
          from: firebase.auth().currentUser.uid,
        })
        .then(() => {
          that.message = ''
        })
      }
    },
    mounted() {
      const that = this
      var db = firebase.firestore()
      var room = db.collection('rooms').doc(this.roomId)

      // Get players
      room.collection('players').get()
        .then(function(querySnapShot) {
          querySnapShot.forEach(function(doc) {
            that.players.push(doc.data())
          })
        })

      // Set listener and retrieve the latest message every time when a messsage is added
      room.collection('messages').orderBy('timestamp', 'desc').limit(1).onSnapshot(function(querySnapShot) {
          querySnapShot.forEach(function(doc) {
            if (!doc.metadata.hasPendingWrites) {
              that.messages.push(doc.data())
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

  .message-avator {
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
