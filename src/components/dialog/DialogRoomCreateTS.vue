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
            <label class="input-label">ROOM NAME</label>
            <input 
              class="room-create-input" 
              type="text" 
              name="name">
          </div>
          <div class="input-wrapper">
            <label class="input-label">DESCRIPTION</label>
            <textarea 
              class="room-create-textarea" 
              name="description"
              rows="4"
              maxlength="1000"></textarea>
          </div>
          <v-row>
            <v-col cols="4">
              <div class="input-capacity-wrapper">
                <label class="input-label">CAPACITY</label>
                <select 
                  class="room-create-input" 
                  name="capacity">
                  <option value="5">5</option>
                  <option value="9">9</option>
                  <option value="11">11</option>
                  <option value="15">15</option>
                </select>
              </div>
            </v-col>
            <v-col cols="4">
              <div class="input-daytime-wrapper">
                <label class="input-label">DAYTIME</label>
                <select 
                  class="room-create-input" 
                  name="daytime">
                  <option value="5">5</option>
                  <option value="9">9</option>
                  <option value="11">11</option>
                  <option value="15">15</option>
                </select>
              </div>
            </v-col>
            <v-col cols="4">
              <div class="input-night-wrapper">
                <label class="input-label">NIGHT</label>
                <select 
                  class="room-create-input" 
                  name="night">
                  <option value="5">5</option>
                  <option value="9">9</option>
                  <option value="11">11</option>
                  <option value="15">15</option>
                </select>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="3">
              <div class="input-wrapper-2">
                <!-- TODO: checkbox -->
              </div>
            </v-col>
            <v-col cols="9">
              <div class="input-wrapper-2">
                <label class="input-label">ACCESS CODE</label>
                <input 
                  class="room-create-input" 
                  type="text" 
                  name="code">
              </div>              
            </v-col>
          </v-row>
        </form>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn 
          class="confirm-btn" 
          text>
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
  import { defineComponent, reactive, } from '@vue/composition-api'

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
      })

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
                id: firebase.auth().currentUser!.uid,
                name: '',  // TODO: Set a name
                avatar: '',  // TODO: Set an avatar
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
                from: 'GM',
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                body: 'A room has been created.', // TODO: Set a message
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
      }

      return {
        state,
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

  .dialog-title span {
    color: $gray2;
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
  }

  .room-create-textarea:focus {
    outline: none;
  }

  .confirm-btn, .cancel-btn span {
    color: $white;
  }
</style>