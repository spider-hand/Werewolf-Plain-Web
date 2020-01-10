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
        <span v-if="myself.role == 'villager'">{{ $t('DialogRole.villager') }}</span>
        <span v-if="myself.role == 'seer'">{{ $t('DialogRole.seer') }}</span>
        <span v-if="myself.role == 'medium'">{{ $t('DialogRole.medium') }}</span>
        <span v-if="myself.role == 'knight'">{{ $t('DialogRole.knight') }}</span>
        <span v-if="myself.role == 'werewolf'">{{ $t('DialogRole.werewolf') }}</span>
        <span v-if="myself.role == 'minion'">{{ $t('DialogRole.minion') }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <span v-if="myself.role == 'villager'">{{ $t('DialogRole.villagerDescription') }}</span>
          <span v-if="myself.role == 'seer'">{{ $t('DialogRole.seerDescription') }}</span>
          <span v-if="myself.role == 'medium'">{{ $t('DialogRole.mediumDescription') }}</span>
          <span v-if="myself.role == 'knight'">{{ $t('DialogRole.knightDescription') }}</span>
          <span v-if="myself.role == 'werewolf'">{{ $t('DialogRole.werewolfDescription') }}</span>
          <span v-if="myself.role == 'minion'">{{ $t('DialogRole.minionDescription') }}</span>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn
          text
          @click="close">
          <span>{{ $t('DialogRole.close') }}</span>
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