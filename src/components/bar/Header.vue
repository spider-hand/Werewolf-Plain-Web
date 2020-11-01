<template>
  <v-app-bar class="header">
    <div>
      <v-img
        src="@/assets/logo.png"
        width="120">
      </v-img>
    </div>
    <div class="flex-grow-1"></div>
    <v-btn
      class="about-btn"
      text
      @click="$router.push({ name: 'about' })">
      <span>About</span>
    </v-btn>
    <div v-if="store.getters.isSignedIn">
      <v-btn
        class="settings-btn"
        text
        @click="showSettingsDialog">
        <span>Settings</span>
      </v-btn>
      <v-btn
        class="sign-out-btn"
        text
        @click="showSignOutDialog">
        <span>Sign Out</span>
      </v-btn>
      <DialogSettings ref="dialogSettings" />
      <DialogUserSignOut ref="dialogUserSignOut" />
    </div>
    <div v-else>
      <v-btn
        class="sign-in-btn" 
        text
        @click="$router.push({ name: 'sign-in' })">
        <span>Sign In</span>
      </v-btn>
      <v-btn
        class="sign-up-btn"
        rounded
        depressed
        @click="$router.push({ name: 'sign-up' })">
        <span>Sign Up</span>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
  import { defineComponent, ref, } from '@vue/composition-api'

  import { DialogComponent } from '@/types/index'
  import DialogSettings from '@/components/dialog/DialogSettings.vue'
  import DialogUserSignOut from '@/components/dialog/DialogUserSignOut.vue'

  export default defineComponent({
    components: {
      DialogSettings,
      DialogUserSignOut,
    },

    setup(props, context) {
      const store = context.root.$store

      const dialogSettings = ref<DialogComponent | null>(null)
      const dialogUserSignOut = ref<DialogComponent | null>(null)

      function showSettingsDialog(): void {
        dialogSettings!.value!.open()
      }

      function showSignOutDialog(): void {
        dialogUserSignOut!.value!.open()
      }

      return {
        store,
        dialogSettings,
        dialogUserSignOut,
        showSettingsDialog,
        showSignOutDialog,
      }
    }
  })
</script>

<style lang="scss" scoped>
  .header {
    background-color: $black1 !important;
  }

  .about-btn, .settings-btn {
    color: $white !important;
  }

  .sign-in-btn, .sign-out-btn {
    color: $red1 !important;
  }

  .v-btn {
    text-transform: none;
  }
</style>