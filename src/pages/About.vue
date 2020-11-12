<template>
  <div class="page">
    <v-container>
      <v-card
        flat
        tile
        color="transparent">
        <v-card-text>
          <h1>About</h1>
        </v-card-text>
        <v-card-text>
          <span>Werewolf Red is a simple and easy to play online werewolf server.</span>
        </v-card-text>
        <v-divider />
        <v-card-text>
          <h2>Game Type and Roles</h2>
        </v-card-text>
        <v-card-text>
          <h3>5 player game</h3>
          <span>3 villagers, 1 seer, 1 werewolf</span>
        </v-card-text>
        <v-card-text>
          <h3>9 player game</h3>
          <span>4 villagers, 1 seer, 1 knight, 2 werewolves, 1 minion</span>
        </v-card-text>
        <v-card-text>
          <h3>11 player game</h3>
          <span>5 villagers, 1 seer, 1 medium, 1 knight, 2 werewolves, 1 minion</span>
        </v-card-text>
        <v-card-text>
          <h3>15 player game</h3>
          <span>8 villagers, 1 seer, 1 medium, 1 knight, 3 werewolves, 1 minion</span>
        </v-card-text>
        <v-divider />
        <v-card-text>
          <h2>Roles</h2>
        </v-card-text>
        <v-card-text>
          <h3>Villager</h3>
          <span>Villager doesn't have any abilities. They win when they kill all werewolves.</span>
        </v-card-text>
        <v-card-text>
          <h3>Werewolf</h3>
          <span>Werewolf can choose one player each day and kill the most selected player at night. Werewwolf team wins either when they outnumber the villagers or they are the same number of villagers. They can chat using Werewolf Chat even during night and make strategies.
          </span>
        </v-card-text>
        <v-card-text>
          <h3>Seer</h3>
          <span>Seer can choose one player each day and uncover whether the player'role is Werewolf or not.
          </span>
        </v-card-text>
        <v-card-text>
          <h3>Medium</h3>
          <span>Medium can see whether the player executed last night is Werewolf or not.
          </span>
        </v-card-text>
        <v-card-text>
          <h3>Knight</h3>
          <span>Knight can choose one player each day and protect the player. The player cannot be killed by werewolves.
          </span>
        </v-card-text>
        <v-card-text>
          <h3>Minion</h3>
          <span>Minion belongs to werewolf team but is seen as human. Minion wins when werewolf team wins. Minion doesn't have any abilities and can't see which players are werewolves. Werewolves also can't see which player is Minion. Minion's goal is to help werewolves win.
          </span>
        </v-card-text>
        <v-divider />
        <v-card-text>
          <h2>Contact</h2>
        </v-card-text>
        <v-card-text>
          <span>Join Discord or email me. Feel free to give me feedback. Also this website is open source so you can contact me via Github. Links are at the bottom of this page.</span>
        </v-card-text>
        <v-divider />
        <v-card-text>
          <h2>Credits</h2>
        </v-card-text>
        <v-card-text>
          <span>Logo by <a href="http://thenounproject.com/leemette">Lee Mette</a> from <a href="http://thenounproject.com">The Noun Project</a></span>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
  import  { defineComponent, } from '@vue/composition-api'

  export default defineComponent({

  })
</script>

<style lang="scss" scoped>
  span {
    color: $gray4 !important;
  }

  .v-divider {
    background-color: $white !important;
    opacity: 0.1;
  }

  .v-card__text {
    text-align: left !important;
    color: $white !important;
  }
</style>