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
				<v-divider color="#FFFFFF" />
				<v-card-text class="text-left white--text pb-0">
					<h2>{{ $t('About.supportThisSite.title') }}</h2>
				</v-card-text>
				<v-card-text class="pb-0">
					<span>{{ $t('About.supportThisSite.para1') }}</span>
				</v-card-text>
				<v-card-text>
					<v-container>
						<v-btn 
							target="_blank"
							href="http://twitter.com/share?url=https://werewolfplain.com/"
							icon
							color="#FFFFFF">
							<v-icon size="36">mdi-twitter</v-icon>
						</v-btn>
						<v-btn
							class="ml-4"
							target="_blank"
							href="http://www.facebook.com/sharer.php?u=https://werewolfplain.com/" 
							rel="nofollow"
							icon
							color="#FFFFFF">
							<v-icon size="36">mdi-facebook-box</v-icon>
						</v-btn>
					</v-container>
				</v-card-text>
				<v-divider color="#FFFFFF" />
				<v-card-text class="text-left white--text pb-0">
					<h2>{{ $t('About.mobile.title') }}</h2>
				</v-card-text>
				<v-card-text class="pb-0">
					<span>{{ $t('About.mobile.para1') }}</span>
					<a href="https://play.google.com/store/apps/details?id=com.spiderhand.werewolf_plain">
						<v-img
							src="../assets/google-play-badge.png"
							width="180" />			
					</a>
				</v-card-text>
				<v-divider color="#FFFFFF" />
				<v-card-text class="text-left white--text pb-0">
					<h2>{{ $t('About.feedback.title') }}</h2>
				</v-card-text>
				<v-card-text class="pb-0">
					<span>{{ $t('About.feedback.para1') }}</span>
					<br>
					<span>{{ $t('About.feedback.email') }}: <a href="mailto:werewolf.plain@gmail.com">werewolf.plain@gmail.com</a></span>
				</v-card-text>
				<v-card-text>
					<v-container>
						<v-btn
							icon
							color="#FFFFFF"
							href="https://discord.gg/Vrtx7fW">
							<v-icon size="36">mdi-discord</v-icon>
						</v-btn>
						<v-btn
							class="ml-4"
							icon
							color="#FFFFFF"
							href="https://github.com/spider-hand/Werewolf-Plain-Web">
							<v-icon size="36">mdi-github-circle</v-icon>
						</v-btn>
					</v-container>
				</v-card-text>
				<v-divider color="#FFFFFF" />
				<v-card-text class="text-left white--text pb-0">
					<h2>{{ $t('About.credit.title') }}</h2>
				</v-card-text>
				<v-card-text>
					<span>{{ $t('About.credit.logo') }} <a href="http://thenounproject.com/leemette">Lee Mette</a> from <a href="http://thenounproject.com">The Noun Project</a></span>
					<br>
					<span>{{ $t('About.credit.icon') }} <a href="http://thenounproject.com/grega.cresnar">Gregor Cresnar</a> from <a href="http://thenounproject.com">The Noun Project</a></span>
					<br>
					<span>{{ $t('About.credit.translationES') }} Alejandra Sandoval</span>
					<br>
					<span>{{ $t('About.credit.translationPT') }} Alex Gimenez</span>
				</v-card-text>
				<v-footer color="transparent">
					<span>
						<small>&copy; {{ new Date().getFullYear() }} Spider Hand</small>
					</span>
					<router-link
						class="ml-3"
						to="/privacy-policy">
						<small>Privacy Policy</small>
					</router-link>
				</v-footer>
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
