<template>
  <div>
    <v-container>
      <v-tabs v-model="tabs">
        <v-tab>New</v-tab>
        <v-tab>Ongoing</v-tab>
        <v-tab>Closed</v-tab>
        <v-tab-item 
          transition="false"
          reverse-transition="false">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left"></th>
                  <th class="text-left">Name</th>
                  <th class="text-left">Participants</th>
                  <th class="text-left"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="village in newVillages">
                  <td width="3%">
                    <v-icon 
                      v-if="village.isPrivate == true"
                      :small="$viewport.width < 450"
                      >mdi-lock
                    </v-icon>
                  </td>
                  <td width="60%">{{ village.name }}</td>
                  <td>{{ village.numberOfParticipants }} / {{ village.capacity }}</td>
                  <td>
                    <v-btn 
                      text
                      :small="$viewport.width < 450">
                      Details
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-tab-item>
        <v-tab-item 
          transition="false"
          reverse-transition="false">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left"></th>
                  <th class="text-left">Name</th>
                  <th class="text-left">Participants</th>
                  <th class="text-left"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="village in ongoingVillages">
                  <td width="3%">
                    <v-icon 
                      v-if="village.isPrivate == true"
                      :small="$viewport.width < 450"
                      >mdi-lock
                    </v-icon>
                  </td>
                  <td width="60%">{{ village.name }}</td>
                  <td>{{ village.numberOfParticipants }}</td>
                  <td>
                    <v-btn 
                      text
                      :small="$viewport.width < 450">
                      Details
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-tab-item>
        <v-tab-item 
          transition="false"
          reverse-transition="false">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left"></th>
                  <th class="text-left">Name</th>
                  <th class="text-left">Participants</th>
                  <th class="text-left"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="village in closedVillages">
                  <td width="3%">
                    <v-icon 
                      v-if="village.isPrivate == true"
                      :small="$viewport.width < 450">
                      mdi-lock
                    </v-icon>
                  </td>
                  <td width="60%">{{ village.name }}</td>
                  <td>{{ village.numberOfParticipants }}</td>
                  <td>
                    <v-btn 
                      text
                      :small="$viewport.width < 450">
                      Details
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-tab-item>
      </v-tabs>
    </v-container>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tabs: 0,
        newVillages: [
          {
            name: 'Village 1',
            numberOfParticipants: 3,
            capacity: 15,
            isPrivate: true,
          },
          {
            name: 'Village 2',
            numberOfParticipants: 7,
            capacity: 11,
            isPrivate: false,
          },
          {
            name: 'Village 3',
            numberOfParticipants: 10,
            capacity: 15,
            isPrivate: false,
          },
          {
            name: 'Village 4',
            numberOfParticipants: 4,
            capacity: 9,
            isPrivate: true,
          },
          {
            name: 'Village 6',
            numberOfParticipants: 12,
            capacity: 15,
            isPrivate: false,
          },
          {
            name: 'Village 123',
            numberOfParticipants: 14,
            capacity: 15,
            isPrivate: false,
          },
        ],
        ongoingVillages: [
          {
            name: 'Village 1',
            numberOfParticipants: 15,
            capacity: 15,
            isPrivate: false,
          },
          {
            name: 'Village 2',
            numberOfParticipants: 11,
            capacity: 11,
            isPrivate: true,
          },
          {
            name: 'Village 3',
            numberOfParticipants: 15,
            capacity: 15,
            isPrivate: false,
          },
        ],
        closedVillages: [
          {
            name: 'Village 1',
            numberOfParticipants: 15,
            capacity: 15,
            isPrivate: false,
          },
          {
            name: 'Village 16',
            numberOfParticipants: 11,
            capacity: 11,
            isPrivate: true,
          },
        ],
      }
    }
  }
</script>

<style scoped>
  @media (max-width: 450px) {
    td {
      font-size: 12px;
    }
  }
</style>
