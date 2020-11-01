<template>
  <v-app-bar class="header">
    <div>
      <v-img
        src="@/assets/logo.png"
        width="120" />
    </div>
    <div class="flex-grow-1"></div>
    <div v-if="store.getters.isSignedIn">
      <DialogSettings ref="dialogSettings" />
      <DialogUserSignOut ref="dialogUserSignOut" />
    </div>
    <v-menu>
      <template v-slot:activator="{ on }">
        <v-btn
          class="icon-menu"
          icon
          v-on="on">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
      </template>
      <v-list class="menu-wrapper">
        <v-list-item @click="$router.push({ name: 'about' })">
          <v-list-item-content>
            <v-list-item-title class="menu-title">About</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="!store.getters.isSignedIn" 
          @click="$router.push({ name: 'sign-in' })">
          <v-list-item-content>
            <v-list-item-title class="menu-title">Sign In</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item 
          v-if="!store.getters.isSignedIn"
          @click="$router.push({ name: 'sign-up' })">
          <v-list-item-content>
            <v-list-item-title class="menu-title">Sign Up</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="store.getters.isSignedIn" 
          @click="showSettingsDialog">
          <v-list-item-content>
            <v-list-item-title class="menu-title">Settings</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-if="store.getters.isSignedIn" 
          @click="showSignOutDialog">
          <v-list-item-content>
            <v-list-item-title class="menu-title">Sign Out</v-list-item-title>
          </v-list-item-content>
        </v-list-item>        
      </v-list>
    </v-menu>
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

 .icon-menu {
  color: $gray2 !important;
 }

 .menu-wrapper {
  background-color: $black1 !important;
 }

 .menu-title {
  color: $gray4 !important;
 }
</style>