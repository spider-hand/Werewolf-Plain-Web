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
        height: $viewport.width > 450 ? $viewport.height - 179 + 'px' : $viewport.height - 171 + 'px',
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
    <v-textarea
      class="message-input"
      :style="{ width: $viewport.width > 450 ? $viewport.width - 337 + 'px' : $viewport.width + 'px' }"
      solo
      flat
      hide-details
      name="input-7-4">
    </v-textarea>
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
      }
    },
    mounted() {
      const that = this
      var db = firebase.firestore()

      // Get players
      db.collection('rooms').doc(this.roomId).collection('players').get()
        .then(function(querySnapShot) {
          querySnapShot.forEach(function(doc) {
            that.players.push(doc.data())
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
    bottom: 2px;
  }
</style>
