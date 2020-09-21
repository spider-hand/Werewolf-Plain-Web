<template>
  <v-dialog 
    persistent
    max-width="600"
    v-model="state.dialog">
    <template v-slot:activator="{ on }">
      <v-btn
        class="host-game-btn"
        depressed
        v-on="on">
        <span>Host Game</span>
      </v-btn>
    </template>
    <v-card class="dialog-wrapper">
      <v-card-title class="dialog-title">
        <span>Create a game</span>
      </v-card-title>
      <v-card-text>
        <form>
          <div class="input-wrapper">
            <label 
              class="input-label"
              :class="{ 'text-error': hasRoomNameError }">ROOM NAME</label>
            <label
              class="input-label ml-2"
              :class="{ 'text-error': hasRoomNameError }">{{ state.roonNameErrorMessage }}</label>
            <input 
              class="room-create-input"
              :class="{ 'input-error': hasRoomNameError }"
              type="text" 
              name="name"
              v-model="state.roomName">
          </div>
          <div class="input-wrapper">
            <label 
              class="input-label"
              :class="{ 'text-error': hasDescriptionError }">DESCRIPTION</label>
            <label
              class="input-label ml-2"
              :class="{ 'text-error': hasDescriptionError }">{{ state.desciptionErrorMessage }}</label>
            <textarea 
              class="room-create-textarea"
              :class="{ 'input-error': hasDescriptionError }" 
              name="description"
              rows="4"
              maxlength="1000"
              v-model="state.roomDescription"></textarea>
          </div>
          <v-row>
            <v-col cols="4">
              <div class="input-capacity-wrapper">
                <label class="input-label">CAPACITY</label>
                <select 
                  class="room-create-input" 
                  name="capacity"
                  v-model="state.capacity">
                  <option 
                    v-for="item in state.capacityItems"
                    :key="item.text"
                    :value="item.value">
                    {{ item.text }}  
                  </option>
                </select>
              </div>
            </v-col>
            <v-col cols="4">
              <div class="input-daytime-wrapper">
                <label class="input-label">DAYTIME</label>
                <select 
                  class="room-create-input" 
                  name="daytime"
                  v-model="state.dayLength">
                  <option 
                    v-for="item in state.dayLengthItems"
                    :key="item.text"
                    :value="item.value">
                    {{ item.text }}    
                  </option>
                </select>
              </div>
            </v-col>
            <v-col cols="4">
              <div class="input-night-wrapper">
                <label class="input-label">NIGHT</label>
                <select 
                  class="room-create-input" 
                  name="night"
                  v-model="state.nightLength">
                  <option 
                    v-for="item in state.nightLengthItems"
                    :key="item.text"
                    :value="item.value">
                    {{ item.text }}    
                  </option>
                </select>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <div class="input-wrapper-2">
                <input 
                  type="checkbox"
                  v-model="state.isPrivate">
                <label 
                  class="input-label"
                  for="isPrivate">Private</label>
              </div>
            </v-col>
            <v-col cols="9">
              <div class="input-wrapper-2">
                <label 
                  class="input-label"
                  :class="{ 'text-error': hasAccessCodeError }">ACCESS CODE</label>
                <label
                  class="input-label ml-2"
                  :class="{ 'text-error': hasAccessCodeError }">{{ state.accessCodeErrorMessage }}</label>
                <input 
                  class="room-create-input"
                  :class="{ 'input-error': hasAccessCodeError }"
                  type="text" 
                  name="code"
                  maxlength="16" 
                  v-model="state.accessCode"
                  :disabled="!state.isPrivate">
              </div>              
            </v-col>
          </v-row>
        </form>
      </v-card-text>
      <v-card-actions class="dialog-actions">
        <div class="flex-grow-1"></div>
        <v-btn 
          class="confirm-btn" 
          depressed
          @click="validate">
          <span>OK</span>
        </v-btn>
        <v-btn
          class="cancel-btn" 
          text
          @click="cancel">
          <span>CANCEL</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import { defineComponent, reactive, computed, } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth'
  import 'firebase/firestore'

  declare interface Item {
    text: string,
    value: number,
  }

  export default defineComponent({
    setup(props, context) {
      const router = context.root.$router

      const state = reactive<{
        dialog: boolean,
        roomName: string,
        roomDescription: string,
        capacity: number,
        capacityItems: Item[],
        dayLength: number,
        dayLengthItems: Item[],
        nightLength: number,
        nightLengthItems: Item[],
        isPrivate: boolean,
        accessCode: string,
        roonNameErrorMessage: string,
        descriptionErrorMessage: string,
        accessCodeErrorMessage: string,
      }>({
        dialog: false,
        roomName: '',
        roomDescription: '',
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
        roonNameErrorMessage: '',
        roomDescriptionErrorMessage: '',
        accessCodeErrorMessage: '',
      })

      const hasRoomNameError = computed<boolean>(() => {
        return state.roonNameErrorMessage !== ''
      })

      const hasDescriptionError = computed<boolean>(() => {
        return state.roomDescriptionErrorMessage !== ''
      })

      const hasAccessCodeError = computed<boolean>(() => {
        return state.accessCodeErrorMessage !== ''
      })

      function validate(): void {
        const isValidName = validateRoomName()
        const isValidDescription = validateRoomDescription()
        const isValidAccessCode = validateAccessCode()

        if (isValidName && isValidDescription && isValidAccessCode) {
          createRoom()
        }
      }

      function validateRoomName(): boolean {
        if (!state.roomName.replace(/\s/g, '').length) {
          state.roonNameErrorMessage = "This field is required."
          return false
        } else if (state.roomName.length > 16) {
          state.roonNameErrorMessage = "Name is too long."
          return false
        } else {
          return true
        }
      }

      function validateRoomDescription(): boolean {
        if (state.roomDescription.length > 500) {
          state.descriptionErrorMessage = "Description is too long."
          return false
        } else {
          return true
        }
      }

      function validateAccessCode(): boolean {
        if (state.isPrivate && !state.accessCode.replace(/\s/g, '').length) {
          state.accessCodeErrorMessage = "This field is required."
          return false
        } else if (state.isPrivate && /\s/.test(state.accessCode)) {
          state.accessCodeErrorMessage = "Whitespace is not allowed."
          return false
        } else if (state.accessCode.length > 16) {
          state.accessCodeErrorMessage = "Access code is too long."
          return false
        } else {
          return true
        }
      }

      function createRoom(): void {
        const db = firebase.firestore()
        const promises = [] as Promise<void | firebase.firestore.DocumentReference>[]

        db.collection('rooms').add({
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          name: state.roomName,
          description: state.roomDescription,
          capacity: state.capacity,
          dayLength: state.dayLength,
          nightLength: state.nightLength,
          isPrivate: state.isPrivate,
          accessCode: state.accessCode,
          numberOfParticipants: 1,
          status: 'new',
          isNight: false,
          ownerId: firebase.auth().currentUser!.uid,
          banList: [],
        })
        .then((docRef) => {
          const putPlayer =
            db.collection('rooms')
              .doc(docRef.id)
              .collection('players')
              .doc(firebase.auth().currentUser!.uid)
              .set({
                uid: firebase.auth().currentUser!.uid,
                name: 'Anonymous',  // TODO: Set a name
                avatar: '',  // TODO: Set an avatar
                role: null,
                isAlive: true,
                votedPlayer: null,
                bittenPlayer: null,
                protectedPlayer: null,
                divinedPlayer: null,
              })
          const sendMessage = 
            db.collection('rooms')
              .doc(docRef.id)
              .collection('messages')
              .add({
                from: '',
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                body: 'A player has joined.', 
                gameName: 'GM',
                avatar: '',
                isFromGrave: false,
              })

          promises.push(putPlayer)
          promises.push(sendMessage)

          Promise.all(promises)
            .then(() => {
              router.push({
                name: 'game',
                params: { id: docRef.id },
              })
            }) 
        })
      }

      function cancel(): void {
        state.dialog = false
        state.roonNameErrorMessage = ''
        state.roomDescriptionErrorMessage = ''
        state.accessCodeErrorMessage = ''
      }

      return {
        state,
        hasRoomNameError,
        hasDescriptionError,
        hasAccessCodeError,
        validate,
        validateRoomName,
        validateRoomDescription,
        validateAccessCode,
        createRoom,
        cancel,
      }
    }
  })
</script>

<style lang="scss" scoped>
  .host-game-btn span {
    color: $white;
  }

  .host-game-btn {
    background-color: $red1 !important;
  }

  .dialog-wrapper {
    background-color: $black3;
  }

  .dialog-actions {
    background-color: $black2;
  }

  .dialog-title span {
    color: $white;
    font-size: 16px;
  }

  .input-wrapper {
    width: 100%;
    position: relative;
    padding: 0 25px 0 25px;
    margin: 20px 0 20px 0;
  }

  .input-capacity-wrapper {
    width: 100%;
    position: relative;
    padding: 0 5px 0 25px;
  }

  .input-daytime-wrapper {
    width: 100%;
    position: relative;
    padding: 0 15px 0 15px;
  }

  .input-night-wrapper {
    width: 100%;
    position: relative;
    padding: 0 25px 0 5px;
  }

  .input-wrapper-2 {
    width: 100%;
    position: relative;
    padding: 0 25px 0 25px;
  }

  .input-label {
    color: $gray3;
    font-size: 12px;
    font-weight: 500;
  }

  .room-create-input {
    font-size: 16px;
    width: 100%;
    height: 45px;
    color: $white;
    background-color: $black4;
    border-radius: 3px;
    border: 1.5px solid $black5;
    padding: 0 10px 0 10px;
  }

  .room-create-input:focus {
    outline: none;
  }

  .room-create-textarea {
    font-size: 16px;
    width: 100%;
    color: $white;
    background-color: $black4;
    border-radius: 3px;
    border: 1.5px solid $black5;
    padding: 0 10px 0 10px;
    resize: none;
  }

  .room-create-textarea:focus {
    outline: none;
  }

  .confirm-btn {
    background-color: $red1 !important;
  }

  .confirm-btn, .cancel-btn span {
    color: $white;
    font-size: 12px !important;
  }

  .text-error {
    color: $red1;
  }

  .input-error {
    border: 1.5px solid $red1;
  }
</style>