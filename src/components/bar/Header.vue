<template>
  <v-app-bar class="header">
    <div>
      <v-img
        src="@/assets/logo.png"
        width="120">
      </v-img>
    </div>
    <div class="flex-grow-1"></div>
    <div v-if="store.getters.isSignedIn">
      <DialogSettings />
      <DialogUserSignOut />
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
  import { defineComponent, computed, } from '@vue/composition-api'

  import firebase from 'firebase/app'
  import 'firebase/auth'

  import DialogSettings from '@/components/dialog/DialogSettings.vue'
  import DialogUserSignOut from '@/components/dialog/DialogUserSignOut.vue'

  export default defineComponent({
    components: {
      DialogSettings,
      DialogUserSignOut,
    },

    setup(props, context) {
      const store = context.root.$store

      return {
        store,
      }
    }
  })
</script>

<style lang="scss" scoped>
 .header {
  background-color: $black1 !important;
 }

 .sign-in-btn {
 	color: $red1 !important;
 }

 .sign-in-btn, .sign-up-btn {
 	text-transform: none;
 }
</style>