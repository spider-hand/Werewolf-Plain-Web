<template>
  <v-dialog
    :fullscreen="$viewport.width < 450"
    v-model="dialog"
    max-width="600">
    <template v-slot:activator="{ on }">
      <v-btn
        icon
        v-on="on">
        <v-icon color="#757575">mdi-bell</v-icon>
      </v-btn>
    </template>
    <v-card color="#36393F">
      <v-card-title>
        <span>You are {{ myself.role }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <span>{{ getDescription }}</span>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          text
          @click="close">
          <span>CLOSE</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: [
      'myself',
    ],
    data() {
      return {
        dialog: false,
      }
    },
    computed: {
      getDescription() {
        switch (this.myself.role) {
          case 'villager':
            return "You are a normal villager and don't have any abilities. Discuss and select one player to execute each day."
          case 'wolf':
            return 'You can choose one player to kill every night. You can chat with other werewolves on wolf chat.'
          case 'seer':
            return "You can choose one player and uncover the player's role each night."
          case 'medium':
            return "You can see which team the player executed last day's night is each night."
          case 'knight':
            return 'You can choose one player to protect every night. The player cannot be killed the night.'
          case 'minion':
            return "You belongs to werewolf team but you don't have any abilities and seen as a villager. You can't see which players are werewolves but will help werewolf team to win."
        }
      }
    },
    methods: {
      close() {
        this.dialog = false
      }
    }
  }
</script>

<style scoped>
  span {
    color: #FFFFFF;
  }

  .v-card__text span {
    color: #DCDDDE;
  }
</style>