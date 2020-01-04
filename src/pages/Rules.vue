<template>
  <div id="rules-page">
  	<v-container>
	  	<v-card
	  		flat
	  		tile
	  		width="100%"
	  		color="transparent">
	  		<v-card-text class="text-left white--text">
	  			<h1>Rules</h1>
	  		</v-card-text>
	  		<v-card-text class="text-left white--text pb-0">
	  			<h2>How to win</h2>
	  		</v-card-text>
	  		<v-card-text>
	  			<span>
	  				The village wins if they can execute all werewolves. The werewolves win if they can kill enough villagers and the number of werewolves can be equal or greater than the number of villagers.
	  				<br>  
	  				Villagers vote a player and execute a player each day so they can kill all werewolves. Werewolves select and bite a player every night.
	  			</span>
	  		</v-card-text>
	  		<v-divider color="#FFFFFF" />
	  		<v-card-text class="text-left white--text pb-0">
	  			<h2>Game flow</h2>
	  		</v-card-text>
	  		<v-card-text>
	  			<span>
	  				There are two phases each day and will repeat until the game finishes. In daytime, players discuss and villagers have to find out who are likely to be werewolves and vote a player. At night, villagers aren't allowed to discuss, but werewolves can talk on wolf chat. When daytime comes, a player that is most voted will be executed and a villager that is most selected by werewolves will be killed. Dead players can't communicate with live players but they can see the chat and talk with other dead players. The game will finish either when all werewolves are executed or the number of werewolves are equal or greater than the number of villagers.
	  			</span>
	  		</v-card-text>
	  		<v-divider color="#FFFFFF" />
		  	<v-card-text class="text-left white--text pb-0">
		  		<h2>Roles</h2>
		  	</v-card-text>
		  	<v-card-text>
		  		<span>A role will be decided randomly when the game starts.</span>
		  	</v-card-text>
		  	<v-card-text>
		  		<h3 class="text-left white--text">Villager</h3>
		  		<span>Normal villager. They don't have any abilities.</span>
		  	</v-card-text>
		  	<v-card-text>
		  		<h3 class="text-left white--text">Seer</h3>
		  		<span>Seer can choose one player each day to uncover whether the player is wereolf or not. The result will be sent every time daytime comes.</span>
		  	</v-card-text>
		  	<v-card-text>
		  		<h3 class="text-left white--text">Medium</h3>
		  		<span>Medium can see which team the player executed last night belongs to when daytime comes.</span>
		  	</v-card-text>
		  	<v-card-text>
		  		<h3 class="text-left white--text">Knight</h3>
		  		<span>Knight can choose one player to protect each day. The player will not be killed by werewolf at the night.</span>
		  	</v-card-text>
		  	<v-card-text>
		  		<h3 class="text-left white--text">Werewolf</h3>
		  		<span>Werewolf can choose a player each day and the most selected player will be killed at night. Werewolves can chat even during night on wolf chat. If no werewolves didn't select a player, a random villager will be killed.</span>
		  	</v-card-text>
		  	<v-card-text>
		  		<h3 class="text-left white--text">Minion</h3>
		  		<span>Minion belongs to werewolf team but seen as a human. Minion wins when werewolves win. Minion doesn't have any abilities and can't see which players are werewolves.</span>
		  	</v-card-text>
		  	<v-divider color="#FFFFFF" />
		  	<v-card-text class="text-left white--text">
		  		<h2>Others</h2>
		  	</v-card-text>
		  	<v-card-text>
		  		<h3 class="text-left white--text">Voting</h3>
		  		<span>Every players need to vote a player by the time next day's daytime comes. Players who didn't vote will commit suicide. Players can change the selected player anytime in the day. If there are multiple players who are voted the most, the executed player will be decided randomly in the players. A player will be executed first, then, if a werewolf is still alive, a villager will be killed. If werewolves select the same player as the one who are executed, no one will be killed. If nobody voted and all players commit suicide, the village will win.</span>
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
