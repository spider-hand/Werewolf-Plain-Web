<template>
  <div>
    <v-container>
      <v-form>
        <v-card
          class="profile-container"
          flat 
          max-width="800">
          <v-container>
            <v-card-title>
              <v-text-field
                v-if="isEditing == true"
                label="Username"
                outlined></v-text-field>
              <span v-else>Username</span>
              <div class="flex-grow-1"></div>
              <v-btn 
                icon
                v-if="isEditing == false"
                @click="editProfile">
                <v-icon>mdi-account-edit</v-icon>
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-textarea
                  v-if="isEditing == true"
                  label="Bio"
                  outlined></v-textarea>
                <div 
                  class="user-bio"
                  v-else>bio here</div>
              </v-container>
              <v-container
                class="pt-0" 
                v-if="isEditing == true">
                <v-row>
                  <div class="flex-grow-1"></div>
                  <v-btn text>SAVE</v-btn>
                  <v-btn 
                    text
                    @click="cancel">CANCEL</v-btn>
                </v-row>
              </v-container>
              <v-divider></v-divider>
              <v-container>
                <v-row>
                  <v-col cols="4">
                    <strong>Win: 123</strong>
                  </v-col>
                  <v-col cols="4">
                    <strong>Lose: 45</strong>
                  </v-col>
                  <v-col cols="4">
                    <strong>Win Rate: 69%</strong>
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
                        <td>0</td>
                        <td>0</td>
                        <td>0 %</td>
                      </tr>
                      <tr>
                        <td>Wolf</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0 %</td>
                      </tr>
                      <tr>
                        <td>Seer</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0 %</td>
                      </tr>
                      <tr>
                        <td>Medium</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0 %</td>
                      </tr>
                      <tr>
                        <td>Doctor</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0 %</td>
                      </tr>
                      <tr>
                        <td>Minion</td>
                        <td>0</td>
                        <td>0</td>
                        <td>0 %</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-container>
            </v-card-text>
          </v-container>
        </v-card>
      </v-form>
    </v-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        isEditing: false,
      }
    },
    methods: {
      editProfile() {
        this.isEditing = true
      },
      cancel() {
        this.isEditing = false
      },
    }
  }
</script>

<style scoped>
  .profile-container {
    margin: 0 auto;
  }

  .user-bio {
    white-space: pre-wrap;
  }
</style>