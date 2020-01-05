<template>
	<div id="about-page">
		<v-container>
			<v-card
				flat
				tile
				width="100%"
				color="transparent">
				<v-card-text class="text-left white--text">
					<h1>{{ $t('About.about.title') }}</h1>
				</v-card-text>
				<v-card-text>
					<span>
						{{ $t('About.about.para1') }}
					</span>
				</v-card-text>
				<v-divider color="#FFFFFF" />
				<v-card-text class="text-left white--text">
					<h2>{{ $t('About.settingUp.title') }}</h2>
				</v-card-text>
				<v-card-text>
					<span>
						{{ $t('About.settingUp.para1') }}
						<br>
						{{ $t('About.settingUp.para2') }}
						<br>
						{{ $t('About.settingUp.para3') }}
					</span>
				</v-card-text>
				<v-divider color="#FFFFFF" />
				<v-card-text class="text-left white--text">
					<h2>{{ $t('About.villageAndRoles.title') }}</h2>
				</v-card-text>
				<v-card-text>
					<h3 class="text-left white--text">{{ $t('About.villageAndRoles.para1') }}</h3>
					<span>
						{{ $t('About.villageAndRoles.para2') }}
					</span>
				</v-card-text>
				<v-card-text>
					<h3 class="text-left white--text">{{ $t('About.villageAndRoles.para3') }}</h3>
					<span>
						{{ $t('About.villageAndRoles.para4') }}
					</span>
				</v-card-text>
				<v-card-text>
					<h3 class="text-left white--text">{{ $t('About.villageAndRoles.para5') }}</h3>
					<span>
						{{ $t('About.villageAndRoles.para6') }}
					</span>
				</v-card-text>
				<v-card-text>
					<h3 class="text-left white--text">{{ $t('About.villageAndRoles.para7') }}</h3>
					<span>
						{{ $t('About.villageAndRoles.para8') }}
					</span>
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

  #about-page {
    position: relative;
    height: 100%;
    background-color: #23272A;
  }

  .v-divider {
  	opacity: 0.06;
  }
</style>
