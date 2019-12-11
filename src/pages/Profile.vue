<template>
  <div id="profile-page">
    <v-container v-if="user != null">
      <v-card
        class="mx-auto"
        flat 
        max-width="800"
        color="#36393F">
        <v-container>
          <v-card-title>
            <v-text-field
              v-if="isEditing == true"
              v-model="newUsername"
              :disabled="isUsernameEditable == false"
              :error-messages="isUsernameEditable == false ? 'You can change username once 30 days' : ''"
              label="Username"
              :value="newUsername"
              outlined
              color="#8E9297"
              background-color="#2F3136"
              dark></v-text-field>
            <span v-else>{{ user.username }}</span>
            <div class="flex-grow-1"></div>
            <v-btn 
              icon
              v-if="getMyUserId == $route.params.uid && isEditing == false"
              @click="editProfile">
              <v-icon color="#8E9297">mdi-account-edit</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-textarea
                v-if="isEditing == true"
                v-model="newBio"
                label="Bio"
                :value="newBio"
                outlined
                color="#8E9297"
                background-color="#2F3136"
                dark></v-textarea>
              <div 
                class="user-bio"
                v-else>
                <span>{{ user.bio }}</span>
              </div>
            </v-container>
            <v-container
              class="pt-0" 
              v-if="isEditing == true">
              <v-row>
                <div class="flex-grow-1"></div>
                <v-btn 
                  text
                  color="#2F3136"
                  @click="updateProfile">
                  <span>SAVE</span>
                </v-btn>
                <v-btn 
                  text
                  color="#2F3136"
                  @click="cancel">
                  <span>CANCEL</span>
                </v-btn>
              </v-row>
            </v-container>
            <v-divider></v-divider>
            <v-container>
              <v-row>
                <v-col cols="4">
                  <span>
                    <strong>Win: {{ getWin }}</strong>
                  </span>
                </v-col>
                <v-col cols="4">
                  <span>
                    <strong>Lose: {{ getLose }}</strong>
                  </span>
                </v-col>
                <v-col cols="4">
                  <span>
                    <strong>Win Rate: {{ getWinRate(getWin, getLose) }} %</strong>
                  </span>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-simple-table dark>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">
                        <span>Role</span>
                      </th>
                      <th class="text-left">
                        <span>Win</span>
                      </th>
                      <th class="text-left">
                        <span>Lose</span>
                      </th>
                      <th class="text-left">
                        <span>Win Rate</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="background-color: #2F3136;">
                      <td>Villager</td>
                      <td>{{ user.villagerWin }}</td>
                      <td>{{ user.villagerLose }}</td>
                      <td>0 %</td>
                    </tr>
                    <tr style="background-color: #2F3136;">
                      <td>Wolf</td>
                      <td>{{ user.wolfWin }}</td>
                      <td>{{ user.wolfLose }}</td>
                      <td>0 %</td>
                    </tr>
                    <tr style="background-color: #2F3136;">
                      <td>Seer</td>
                      <td>{{ user.seerWin }}</td>
                      <td>{{ user.seerLose }}</td>
                      <td>0 %</td>
                    </tr>
                    <tr style="background-color: #2F3136;">
                      <td>Medium</td>
                      <td>{{ user.mediumWin }}</td>
                      <td>{{ user.mediumLose }}</td>
                      <td>0 %</td>
                    </tr>
                    <tr style="background-color: #2F3136;">
                      <td>Doctor</td>
                      <td>{{ user.knightWin }}</td>
                      <td>{{ user.knightLose }}</td>
                      <td>0 %</td>
                    </tr>
                    <tr style="background-color: #2F3136;">
                      <td>Minion</td>
                      <td>{{ user.minionWin }}</td>
                      <td>{{ user.minionLose }}</td>
                      <td>0 %</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-container>
          </v-card-text>
        </v-container>
      </v-card>
    </v-container>
  </div>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/firestore'

  export default {
    data() {
      return {
        isEditing: false,
        valid: true,
        user: null,
        newUsername: '',
        newBio: '',
      }
    },
    computed: {
      getMyUserId() {
        return firebase.auth().currentUser.uid
      },
      getWin() {
        var win = this.user.villagerWin + this.user.wolfWin + this.user.seerWin + this.user.mediumWin + this.user.knightWin + this.user.minionWin
        return win
      },
      getLose() {
        var lose = this.user.villagerLose + this.user.wolfLose + this.user.seerLose + this.user.mediumLose + this.user.knightLose + this.user.minionLose
        return lose
      },
      isUsernameEditable() {
        if (this.user.lastTimeUsernameEdited == null) {
          return true
        } else {
          var today = new Date()
          if (Math.floor((today - this.user.lastTimeUsernameEdited.toDate()) / (1000 * 60 * 60 * 24)) > 30) {
            return true
          } else {
            return false
          }
        }
      },
    },
    methods: {
      getWinRate(win, lose) {
        return Math.floor(win / (win + lose) * 100)
      },
      editProfile() {
        this.isEditing = true
      },
      updateProfile() {
        this.isEditing = false
        var db = firebase.firestore()

        if (this.isUsernameEditable == false) {
          db.collection('users').doc(this.$route.params.uid).update({
            bio: this.newBio,
          })
          .then(() => {
            db.collection('users').doc(this.$route.params.uid).get().then((doc) => {
              this.user = doc.data()
            })          
          })          
        } else {
          db.collection('users').doc(this.$route.params.uid).update({
            username: this.newUsername,
            lastTimeUsernameEdited: firebase.firestore.FieldValue.serverTimestamp(),
            bio: this.newBio,
          })
          .then(() => {
            db.collection('users').doc(this.$route.params.uid).get().then((doc) => {
              this.user = doc.data()
            })          
          })
        }
      },
      cancel() {
        this.isEditing = false
      },
    },
    mounted() {
      var db = firebase.firestore()

      db.collection('users').doc(this.$route.params.uid).get().then((doc) => {
        this.user = doc.data()
        this.newUsername = doc.data().username
        this.newBio = doc.data().bio
      })
    }
  }
</script>

<style scoped>
  tr {
    background-color: #2F3136;
  }

  th span {
    color: #8E9297;
  }

  td span {
    color: #FFFFFF;
  }

  span {
    color: #FFFFFF;
  }

  strong {
    color: #FFFFFF;
  }

  #profile-page {
    position: relative;
    height: 100%;
    background-color: #36393F;
  }

  .user-bio {
    white-space: pre-wrap;
  }
</style>