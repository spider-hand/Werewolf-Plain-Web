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
        width: $viewport.width > 450 ? $viewport.width - 337 + 'px' : $viewport.width }">
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
      :style="{ width: $viewport.width > 450 ? $viewport.width - 337 + 'px' : $viewport.width }"
      solo
      flat
      hide-details
      name="input-7-4">
    </v-textarea>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        players: [
          { name: 'All', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
          { name: 'Wolves', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
          { name: 'You', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
          { name: 'Player2', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
          { name: 'Player3', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
          { name: 'Player4', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' },
          { name: 'Player5', avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg' },
          { name: 'Player6', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
          { name: 'Player7', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
          { name: 'Player8', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
          { name: 'Player9', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' },
          { name: 'Player10', avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg' },
          { name: 'Player11', avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg' },
          { name: 'Player12', avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg' },
          { name: 'Player13', avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg' },
          { name: 'Player14', avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg' },
          { name: 'Player15', avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg' },
        ],
        messages: [
          { body: 'Hello' },
          { body: 'How is it going?' },
          { body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.' },
          { body: 'Hello' },
          { body: 'How is it going?' },
          { body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.' },
          { body: 'Hello' },
          { body: 'How is it going?' },
          { body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.' },
          { body: 'Hello' },
          { body: 'How is it going?' },
          { body: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.' },
        ],
      }
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
