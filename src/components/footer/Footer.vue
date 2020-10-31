<template>
  <v-footer
    class="footer"
    height="150">
    <v-container> 
     <v-row justify="center">
        <v-btn
          icon
          href="">
          <v-icon size="30">mdi-github-circle</v-icon>
        </v-btn>
        <v-btn 
          icon
          href="">
          <v-icon size="30">mdi-discord</v-icon>
        </v-btn>
        <v-btn 
          icon
          href="mailto:creative.spider.hand@gmail.com">
          <v-icon size="30">mdi-email</v-icon>
        </v-btn>
      </v-row>
      <v-row
        class="mt-8" 
        justify="center">
        <span class="copyright">All rights reserved. Copyright © {{ new Date().getFullYear() }} <strong>Spider Hand</strong></span>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script lang="ts">
  
</script>

<style lang="scss" scoped>
  .footer {
    background-color: $black1 !important;
  }

  .v-btn {
    color: $white !important;
    margin-right: 16px;
    margin-left: 16px;
  }

  .copyright {
    color: $white;
    font-size: 12px;
  }
</style>