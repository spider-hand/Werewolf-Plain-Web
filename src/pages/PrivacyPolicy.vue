<template>
  <div id="privacy-policy-page">
    <v-container>
      <v-card
        flat
        tile
        width="100%"
        color="transparent">
        <v-card-text class="text-left white--text">
          <h1>{{ $t('PrivacyPolicy.title') }}</h1>
        </v-card-text>
        <v-card-text>
          <span>{{ $t('PrivacyPolicy.para1') }}</span>
        </v-card-text>
        <v-divider color="#FFFFFF" />
        <v-card-text class="text-left white--text">
          <h2>{{ $t('PrivacyPolicy.informationCollectionAndUse.title') }}</h2>
        </v-card-text>
        <v-card-text>
          <span>{{ $t('PrivacyPolicy.informationCollectionAndUse.para1') }}</span>
          <li><a href="https://firebase.google.com/policies/analytics">Google Analytics for Firebase</a></li>
        </v-card-text>
        <v-divider color="#FFFFFF" />
        <v-card-text class="text-left white--text">
          <h2>{{ $t('PrivacyPolicy.logData.title') }}</h2>
        </v-card-text>
        <v-card-text>
          <span>{{ $t('PrivacyPolicy.logData.para1') }}</span>
        </v-card-text>
        <v-divider color="#FFFFFF" />
        <v-card-text class="text-left white--text">
          <h2>{{ $t('PrivacyPolicy.serviceProviders.title') }}</h2>
        </v-card-text>
        <v-card-text>
          <span>{{ $t('PrivacyPolicy.serviceProviders.para1') }}</span>
          <li>{{ $t('PrivacyPolicy.serviceProviders.para2') }}</li>
          <li>{{ $t('PrivacyPolicy.serviceProviders.para3') }}</li>
          <li>{{ $t('PrivacyPolicy.serviceProviders.para4') }}</li>
          <li>{{ $t('PrivacyPolicy.serviceProviders.para5') }}</li>
          <span>{{ $t('PrivacyPolicy.serviceProviders.para6') }}</span>
        </v-card-text>
        <v-divider color="#FFFFFF" />
        <v-card-text class="text-left white--text">
          <h2>{{ $t('PrivacyPolicy.security.title') }}</h2>
        </v-card-text>
        <v-card-text>
          <span>{{ $t('PrivacyPolicy.security.para1') }}</span>
        </v-card-text>
        <v-divider color="#FFFFFF" />
        <v-card-text class="text-left white--text">
          <h2>{{ $t('PrivacyPolicy.linksToOtherSites.title') }}</h2>
        </v-card-text>
        <v-card-text>
          <span>{{ $t('PrivacyPolicy.linksToOtherSites.para1') }}</span>
        </v-card-text>
        <v-divider color="#FFFFFF" />
        <v-card-text class="text-left white--text">
          <h2>{{ $t('PrivacyPolicy.changesToThisPrivacyPolicy.title') }}</h2>
        </v-card-text>
        <v-card-text>
          <span>{{ $t('PrivacyPolicy.changesToThisPrivacyPolicy.para1') }}</span>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
  export default {

  }
</script>

<style>
  span {
    color: #DCDDDE;
  }

  li {
    color: #DCDDDE;
  }

  #privacy-policy-page {
    position: relative;
    height: 100%;
    background-color: #23272A;
  }

  .v-divider {
    opacity: 0.06;
  }
</style>
