<template>
  <v-dialog 
    persistent
    :fullscreen="$viewport.width < 450"
    v-model="dialog"
    max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn 
        :disabled="!isSignedIn"
        depressed
        color="#43B581"
        v-on="on">
        <span>Host Game</span>
      </v-btn>
    </template>
    <v-card color="#36393F">
      <v-card-title>
        <span>Host Game</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation>
            <v-text-field
              v-model="name"
              :rules="[v => !!v || 'Required']"
              label="Village Name"
              outlined
              color="#8E9297"
              background-color="#2F3136"
              dark></v-text-field>
            <v-textarea
              v-model="description"
              name="input-7-4"
              label="Description (Opitonal)"
              outlined
              color="#8E9297"
              background-color="#2F3136"
              dark></v-textarea>
            <v-select 
              v-model="capacity"
              label="Capacity"
              outlined
              color="#8E9297"
              background-color="#2F3136"
              dark
              :items="capacityItems"></v-select>
            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="dayLength"
                  label="Day (minutes)"
                  outlined
                  color="#8E9297"
                  background-color="#2F3136"
                  dark
                  :items="dayLengthItems"></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="nightLength"
                  label="Night (minutes)"
                  outlined
                  color="#8E9297"
                  background-color="#2F3136"
                  dark
                  :items="nightLengthItems"></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-checkbox
                  v-model="isPrivate"
                  label="Private"
                  color="#8E9297"
                  dark></v-checkbox>
              </v-col>
              <v-col cols="9">
                <v-text-field 
                  :disabled="!isPrivate"
                  :rules="accessCodeRules"
                  ref="accessCodeInput"
                  v-model="accessCode"
                  outlined
                  label="Access Code"
                  color="#8E9297"
                  background-color="#2F3136"
                  dark
                  prepend-icon="mdi-lock"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          text
          @click="validate">
          <span>OK</span>
        </v-btn>
        <v-btn 
          text
          @click="cancel">
          <span>CANCEL</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'
  import { mapGetters } from 'vuex'

  export default {
    props: [
      'gameName',
      'avatar',
    ],
    data() {
      return {
        dialog: false,
        valid: true,
        name: '',
        description: '',
        capacity: 15,
        capacityItems: [
          {
            text: '5',
            value: 5,
          },
          {
            text: '9',
            value: 9,
          },
          {
            text: '11',
            value: 11,
          },
          {
            text: '15',
            value: 15,
          }
        ],
        dayLength: 10,
        dayLengthItems: [
          {
            text: '3',
            value: 3,
          },
          {
            text: '4',
            value: 4,
          },
          {
            text: '5',
            value: 5,
          },
          {
            text: '6',
            value: 6,
          },
          {
            text: '7',
            value: 7,
          },
          {
            text: '8',
            value: 8,
          },
          {
            text: '9',
            value: 9,
          },
          {
            text: '10',
            value: 10,
          },
          {
            text: '1440',
            value: 1440,
          }
        ],
        nightLength: 5,
        nightLengthItems: [
          {
            text: '1',
            value: 1,
          },
          {
            text: '2',
            value: 2,
          },
          {
            text: '3',
            value: 3,
          },
          {
            text: '4',
            value: 4,
          },
          {
            text: '5',
            value: 5,
          },          
        ],
        isPrivate: false,
        accessCode: '',
        accessCodeRules: [
          v => {
            if (!v && this.isPrivate == true) {
              return 'Required'
            } else if (/\s/.test(v) && this.isPrivate == true) {
              return "Whitespace isn't allowed"
            } else {
              return true
            }
          }
        ]
      }
    },
    computed: {
      ...mapGetters(['isSignedIn']),
    },
    watch: {
      isPrivate: function(newVal, oldVal) {
        if (newVal == false) {
          this.$refs.accessCodeInput.resetValidation()
          this.accessCode = ''
        }
      }
    },
    methods: {
      validate() {
        if (this.$refs.form.validate()) {
          this.createRoom()
        }
      },
      createRoom() {
        // Create the room's document
        var db = firebase.firestore()
        db.collection('rooms').add({
          name: this.name,
          description: this.description,
          capacity: this.capacity,
          dayLength: this.dayLength,
          nightLength: this.nightLength,
          isPrivate: this.isPrivate,
          accessCode: this.accessCode,
          numberOfParticipants: 1,
          status: 'new',
          isNight: false,
          ownerId: firebase.auth().currentUser.uid,
          banList: [],
        })
        .then((docRef) => {
          db.collection('rooms').doc(docRef.id).collection('players').doc(firebase.auth().currentUser.uid).set({
            id: firebase.auth().currentUser.uid,
            role: null,
            name: this.gameName,
            avatar: this.avatar,
            isAlive: true,
            votedPlayer: null,
            bittenPlayer: null,
            protectedPlayer: null,
            divinedPlayer: null,
          })
          .then(() => {
            db.collection('rooms').doc(docRef.id).collection('messages').add({
              from: 'host',
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              body: `${this.gameName} joined.`,
              gameName: '',
              avatar: '',
              isFromGrave: false,
            })
            .then(() => {
              this.$router.push({
                name: 'game',
                params:{ id: docRef.id },
              })
            })
          })
        })
      },
      cancel() {
        this.dialog = false
      },
    }
  }
</script>

<style scoped>
  span {
    color: #FFFFFF;
  }
</style>
