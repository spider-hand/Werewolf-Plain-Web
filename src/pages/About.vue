<template>
	<div id="about-page">
		<v-container>
			<v-card
				flat
				tile
				width="100%"
				color="transparent">
				<v-card-text class="text-left white--text">
					<h1>About</h1>
				</v-card-text>
				<v-card-text>
					<span>
						Werewolf Plain is a simple and easy to use werewolf game server.
					</span>
				</v-card-text>
				<v-divider color="#FFFFFF" />
				<v-card-text class="text-left white--text">
					<h2>Setting up</h2>
				</v-card-text>
				<v-card-text>
					<span>
						1. Press "Host Game" to create a new village.
						<br>
						2. Press "Start" to start the game after the village gets full.
						<br>
						The host can kick out players before starting the game. Players can leave the villager before the game starts. If the host leaves the village, the village will be deleted. If one week passed since the village created and the game haven't started, it will also be deleted automatically.
					</span>
				</v-card-text>
				<v-divider color="#FFFFFF" />
				<v-card-text class="text-left white--text">
					<h2>Village and Roles</h2>
				</v-card-text>
				<v-card-text>
					<h3 class="text-left white--text">5 player game</h3>
					<span>
						3 villagers, 1 seer and 1 werewolf
					</span>
				</v-card-text>
				<v-card-text>
					<h3 class="text-left white--text">9 player game</h3>
					<span>
						4 villagers, 1 seer, 1 knight, 2 werewolves and 1 minion
					</span>
				</v-card-text>
				<v-card-text>
					<h3 class="text-left white--text">11 player game</h3>
					<span>
						5 villagers, 1 seer, 1 medium, 1 knight, 2 werewolves and 1 minion
					</span>
				</v-card-text>
				<v-card-text>
					<h3 class="text-left white--text">15 player game</h3>
					<span>
						8 villagers, 1 seer, 1 medium, 1 knight, 3 werewolves and 1 minion
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
