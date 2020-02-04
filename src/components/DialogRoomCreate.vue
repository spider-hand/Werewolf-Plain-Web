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
        color="#7289DA"
        v-on="on">
        <span>{{ $t('DialogRoomCreate.hostGame') }}</span>
      </v-btn>
    </template>
    <v-card color="#36393F">
      <v-card-title>
        <span>{{ $t('DialogRoomCreate.hostGame') }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation>
            <v-text-field
              v-model="name"
              :rules="villageNameRules"
              :label="$t('DialogRoomCreate.villageName')"
              maxlength="30"
              outlined
              color="#8E9297"
              background-color="#2F3136"
              dark></v-text-field>
            <v-textarea
              v-model="description"
              name="input-7-4"
              :rules="descriptionRules"
              :label="$t('DialogRoomCreate.description')"
              maxlength="1000"
              outlined
              color="#8E9297"
              background-color="#2F3136"
              dark></v-textarea>
            <v-select 
              v-model="capacity"
              :label="$t('DialogRoomCreate.capacity')"
              outlined
              color="#8E9297"
              background-color="#2F3136"
              dark
              :items="capacityItems"></v-select>
            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="dayLength"
                  :label="$t('DialogRoomCreate.dayLength')"
                  outlined
                  color="#8E9297"
                  background-color="#2F3136"
                  dark
                  :items="dayLengthItems"></v-select>
              </v-col>
              <v-col cols="6">
                <v-select
                  v-model="nightLength"
                  :label="$t('DialogRoomCreate.nightLength')"
                  outlined
                  color="#8E9297"
                  background-color="#2F3136"
                  dark
                  :items="nightLengthItems"></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="6">
                <v-select
                  v-model="language"
                  :label="$t('DialogRoomCreate.language')"
                  outlined
                  color="#8E9297"
                  background-color="#2F3136"
                  dark
                  :items="languageItems"></v-select>
                </v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-checkbox
                  v-model="isPrivate"
                  :label="$t('DialogRoomCreate.private')"
                  color="#8E9297"
                  dark></v-checkbox>
              </v-col>
              <v-col cols="9">
                <v-text-field 
                  ref="accessCodeInput"
                  v-model="accessCode"
                  :disabled="!isPrivate"
                  :rules="accessCodeRules"
                  :label="$t('DialogRoomCreate.accessCode')"
                  maxlength="20"
                  outlined
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
          <span>{{ $t('DialogRoomCreate.ok') }}</span>
        </v-btn>
        <v-btn 
          text
          @click="cancel">
          <span>{{ $t('DialogRoomCreate.cancel') }}</span>
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
        ip: null,
        name: '',
        villageNameRules: [
          v => {
            if (!v) {
              return this.$t('DialogRoomCreate.required')
            } else if (!v.replace(/\s/g, '').length) {
              return this.$t('DialogRoomCreate.onlyWhitespace')
            } else if (v.length > 30) {
              return this.$t('DialogRoomCreate.tooLong')
            } else {
              return true
            }
          }
        ],
        description: '',
        descriptionRules: [
          v => {
            if (v.length > 1000) {
              return this.$t('DialogRoomCreate.tooLong')
            } else {
              return true
            }
          }
        ],
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
        language: this.$i18n.locale,
        languageItems: [
          {
            text: this.$t('DialogRoomCreate.english'),
            value: 'en',
          },
          {
            text: this.$t('DialogRoomCreate.japanese'),
            value: 'ja',
          },
          {
            text: this.$t('DialogRoomCreate.spanish'),
            value: 'es',
          },
          {
            text: this.$t('DialogRoomCreate.portuguese'),
            value: 'pt',
          },
        ],
        isPrivate: false,
        accessCode: '',
        accessCodeRules: [
          v => {
            if (!v && this.isPrivate) {
              return this.$t('DialogRoomCreate.required')
            } else if (/\s/.test(v) && this.isPrivate) {
              return this.$t('DialogRoomCreate.whitespaceIsNotAllowed')
            } else if ((v.length < 4 || v.length > 20) && this.isPrivate) {
              return this.$t('DialogRoomCreate.invalidLength')
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
      getIP() {
        this.$axios.get("https://api.ipify.org?format=json").then((resp) => {
          this.ip = resp.data.ip
        })
      },
      validate() {
        if (this.$refs.form.validate()) {
          this.createRoom()
        }
      },
      createRoom() {
        // Create the room's document
        var db = firebase.firestore()
        var promises = []
        
        db.collection('rooms').add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          name: this.name,
          description: this.description,
          capacity: this.capacity,
          dayLength: this.dayLength,
          nightLength: this.nightLength,
          language: this.language,
          isPrivate: this.isPrivate,
          accessCode: this.accessCode,
          numberOfParticipants: 1,
          status: 'new',
          isNight: false,
          ownerId: firebase.auth().currentUser.uid,
          banList: [],
          ipList: [{ 
            ip: this.ip, 
            uid: firebase.auth().currentUser.uid, 
          }],
        })
        .then((docRef) => {
          var putPlayer = 
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

          var sendNotification = 
            db.collection('rooms').doc(docRef.id).collection('messages').add({
              from: 'GM',
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              body: this.$t('DialogRoomCreate.playerJoined', this.language, [this.gameName]),
              gameName: 'GM',
              avatar: '',
              isFromGrave: false,
            })

          promises.push(putPlayer)
          promises.push(sendNotification)

          Promise.all(promises)            
            .then(() => {
              this.$router.push({
                name: 'game',
                params:{ id: docRef.id },
              })
          })
        })
      },
      cancel() {
        this.dialog = false
      },
    },
    mounted() {
      this.getIP()
    }
  }
</script>

<style scoped>
  span {
    color: #FFFFFF;
  }
</style>
