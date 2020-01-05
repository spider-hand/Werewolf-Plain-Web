<template>
  <div id="rules-page">
  	<v-container>
	  	<v-card
	  		flat
	  		tile
	  		width="100%"
	  		color="transparent">
	  		<v-card-text class="text-left white--text">
	  			<h1>{{ $t("Rules.title") }}</h1>
	  		</v-card-text>
	  		<v-card-text class="text-left white--text pb-0">
	  			<h2>{{ $t('Rules.howToWin.title') }}</h2>
	  		</v-card-text>
	  		<v-card-text>
	  			<span>
	  				{{ $t('Rules.howToWin.para1') }}
	  				<br>  
	  				{{ $t('Rules.howToWin.para2') }}
	  			</span>
	  		</v-card-text>
	  		<v-divider color="#FFFFFF" />
	  		<v-card-text class="text-left white--text pb-0">
	  			<h2>{{ $t('Rules.gameFlow.title') }}</h2>
	  		</v-card-text>
	  		<v-card-text>
	  			<span>
	  				{{ $t('Rules.gameFlow.para1') }}
	  			</span>
	  		</v-card-text>
	  		<v-divider color="#FFFFFF" />
		  	<v-card-text class="text-left white--text pb-0">
		  		<h2>{{ $t('Rules.roles.title') }}</h2>
		  	</v-card-text>
		  	<v-card-text>
		  		<span>{{ $t('Rules.roles.para1') }}</span>
		  	</v-card-text>
		  	<v-card-text>
		  		<h3 class="text-left white--text">{{ $t('Rules.roles.villager') }}</h3>
		  		<span>{{ $t('Rules.roles.para2') }}</span>
		  	</v-card-text>
		  	<v-card-text>
		  		<h3 class="text-left white--text">{{ $t('Rules.roles.seer') }}</h3>
		  		<span>{{ $t('Rules.roles.para3') }}</span>
		  	</v-card-text>
		  	<v-card-text>
		  		<h3 class="text-left white--text">{{ $t('Rules.roles.medium') }}</h3>
		  		<span>{{ $t('Rules.roles.para4') }}</span>
		  	</v-card-text>
		  	<v-card-text>
		  		<h3 class="text-left white--text">{{ $t('Rules.roles.knight') }}</h3>
		  		<span>{{ $t('Rules.roles.para5') }}</span>
		  	</v-card-text>
		  	<v-card-text>
		  		<h3 class="text-left white--text">{{ $t('Rules.roles.werewolf') }}</h3>
		  		<span>{{ $t('Rules.roles.para6') }}</span>
		  	</v-card-text>
		  	<v-card-text>
		  		<h3 class="text-left white--text">{{ $t('Rules.roles.minion') }}</h3>
		  		<span>{{ $t('Rules.roles.para7') }}</span>
		  	</v-card-text>
		  	<v-divider color="#FFFFFF" />
		  	<v-card-text class="text-left white--text">
		  		<h2>{{ $t('Rules.others.title') }}</h2>
		  	</v-card-text>
		  	<v-card-text>
		  		<h3 class="text-left white--text">{{ $t('Rules.others.voting') }}</h3>
		  		<span>{{ $t('Rules.others.para1') }}</span>
		  	</v-card-text>
		  </v-card>
	  </v-container>
  </div>
</template>

<script>
  export default {

  }
</script>

<style scoped>
	span {
		color: #DCDDDE;
	}

  #rules-page {
    position: relative;
    height: 100%;
    background-color: #23272A;
  }

  .v-divider {
  	opacity: 0.06;
  }
</style>
