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
  </v-app-bar>
</template>

<script lang="ts">
  
</script>

<style lang="scss" scoped>
 .header {
  background-color: $black1 !important;
 }

 .sign-in-btn {
 	color: $red1 !important;
 	text-transform: none;
 }

 .sign-up-btn {
 	text-transform: none;
 }
</style>