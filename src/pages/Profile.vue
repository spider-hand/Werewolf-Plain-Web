<template>
  <div>
    <v-container v-if="user != null">
      <v-card
        class="mx-auto"
        flat 
        max-width="800">
        <v-container>
          <v-card-title>
            <v-text-field
              v-if="isEditing == true"
              v-model="newUsername"
              :disabled="isUsernameEditable == false"
              :error-messages="isUsernameEditable == false ? 'You can change username once 30 days' : ''"
              label="Username"
              :value="newUsername"
              outlined></v-text-field>
            <span v-else>{{ user.username }}</span>
            <div class="flex-grow-1"></div>
            <v-btn 
              icon
              v-if="getMyUserId == $route.params.uid && isEditing == false"
              @click="editProfile">
              <v-icon>mdi-account-edit</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-textarea
                v-if="isEditing == true"
                v-model="newBio"
                label="Bio"
                :value="newBio"
                outlined></v-textarea>
              <div 
                class="user-bio"
                v-else>{{ user.bio }}</div>
            </v-container>
            <v-container
              class="pt-0" 
              v-if="isEditing == true">
              <v-row>
                <div class="flex-grow-1"></div>
                <v-btn 
                  text
                  @click="updateProfile">SAVE</v-btn>
                <v-btn 
                  text
                  @click="cancel">CANCEL</v-btn>
              </v-row>
            </v-container>
            <v-divider></v-divider>
            <v-container>
              <v-row>
                <v-col cols="4">
                  <strong>Win: {{ getWin }}</strong>
                </v-col>
                <v-col cols="4">
                  <strong>Lose: {{ getLose }}</strong>
                </v-col>
                <v-col cols="4">
                  <strong>Win Rate: {{ getWinRate(getWin, getLose) }} %</strong>
                </v-col>
              </v-row>
              <v-divider></v-divider>
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th class="text-left">Role</th>
                      <th class="text-left">Win</th>
                      <th class="text-left">Lose</th>
                      <th class="text-left">Win Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Villager</td>
                      <td>{{ user.villagerWin }}</td>
                      <td>{{ user.villagerLose }}</td>
                      <td>0 %</td>
                    </tr>
                    <tr>
                      <td>Wolf</td>
                      <td>{{ user.wolfWin }}</td>
                      <td>{{ user.wolfLose }}</td>
                      <td>0 %</td>
                    </tr>
                    <tr>
                      <td>Seer</td>
                      <td>{{ user.seerWin }}</td>
                      <td>{{ user.seerLose }}</td>
                      <td>0 %</td>
                    </tr>
                    <tr>
                      <td>Medium</td>
                      <td>{{ user.mediumWin }}</td>
                      <td>{{ user.mediumLose }}</td>
                      <td>0 %</td>
                    </tr>
                    <tr>
                      <td>Doctor</td>
                      <td>{{ user.doctorWin }}</td>
                      <td>{{ user.doctorLose }}</td>
                      <td>0 %</td>
                    </tr>
                    <tr>
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
        var win = this.user.villagerWin + this.user.wolfWin + this.user.seerWin + this.user.mediumWin + this.user.doctorWin + this.user.minionWin
        return win
      },
      getLose() {
        var lose = this.user.villagerLose + this.user.wolfLose + this.user.seerLose + this.user.mediumLose + this.user.doctorLose + this.user.minionLose
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
  .user-bio {
    white-space: pre-wrap;
  }
</style>