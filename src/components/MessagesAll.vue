<template>
  <div>
    <div 
      class="message-list"
      :style="{
          height: isJoiningThisGame ? $viewport.height - 199 + 'px' : $viewport.height - 64 + 'px',
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
      v-if="isJoiningThisGame"
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

  export default {
    props: [
      'myself',
      'messages',
      'isJoiningThisGame',
    ],
    data() {
      return {
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
        db.collection('rooms').doc(this.$route.params.id)
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
      },
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
