<template>
  <v-dialog 
    persistent
    :fullscreen="$viewport.width < 450"
    v-model="dialogVillage"
    max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn 
        depressed
        v-on="on">Host Game</v-btn>
    </template>
    <v-card>
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
              v-model="roomName"
              :rules="[v => !!v || 'Required']"
              label="Village Name"
              outlined></v-text-field>
            <v-textarea
              v-model="roomDescription"
              name="input-7-4"
              label="Description (Opitonal)"
              outlined></v-textarea>
            <v-select 
              v-model="roomCapacity"
              label="Capacity"
              outlined
              :items="roomCapacityItems"></v-select>
            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="dayLength"
                  label="Day (minutes)"
                  outlined
                  :items="dayLengthItems"></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="nightLength"
                  label="Night (minutes)"
                  outlined
                  :items="nightLengthItems"></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-checkbox
                  v-model="isPrivate" 
                  label="Private"></v-checkbox>
              </v-col>
              <v-col cols="9">
                <v-text-field 
                  :disabled="!isPrivate"
                  :rules="accessCodeRules"
                  ref="accessCodeInput"
                  v-model="accessCode"
                  outlined
                  label="Access Code"
                  prepend-icon="mdi-lock"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn 
          depressed
          @click="validate">OK</v-btn>
        <v-btn 
          depressed
          @click="cancel">CANCEL</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'

  export default {
    data() {
      return {
        dialogVillage: false,
        valid: true,
        roomName: '',
        roomDescription: '',
        roomCapacity: 15,
        roomCapacityItems: [
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
        db.collection('rooms').doc(firebase.auth().currentUser.uid).set({
          roomId: firebase.auth().currentUser.uid,
          roomName: this.roomName,
          roomDescription: this.roomDescription,
          roomCapacity: this.roomCapacity,
          dayLength: this.dayLength,
          nightLength: this.nightLength,
          isPrivate: this.isPrivate,
          accessCode: this.accessCode,
          numberOfParticipants: 1,
          status: 'new',
        })
        db.collection('rooms').doc(firebase.auth().currentUser.uid).collection('players').doc(firebase.auth().currentUser.uid).set({
          playerId: firebase.auth().currentUser.uid,
          role: '',
          name: 'Test Player',
          avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        })
        .then(() => {
          this.$router.push({
            name: 'game',
            params: {
              roomId: firebase.auth().currentUser.uid,
            },
          })
        })
      },
      cancel() {
        this.dialogVillage = false
      },
    }
  }
</script>

<style scoped>
  
</style>
