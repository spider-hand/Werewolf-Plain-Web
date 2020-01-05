export default {
	en: {
		Header: {
			roomList: 'Room List',
			about: 'About',
			rules: 'Rules',
		},
		HeaderGame: {
			start: 'Start',
		},
		DialogRoomCreate: {
			hostGame: 'Host Game',
			ok: 'OK',
			cancel: 'CANCEL',
		},
		DialogAccessCode: {
			title: 'Input Access Code',
			close: 'CLOSE',
		},
		DialogRoomLeave: {
			leave: 'Leave',
			title: 'Leave Room',
			para1: 'Are you sure you want to leave this room?',
			cancel: 'CANCEL',
		},
		DialogPlayerKickOut: {
			title: 'Kick this player out',
			para1: 'Are you sure you want to kick this player out?',
			cancel: 'CANCEL',
		},
		DialogRole: {
			villager: 'You are villager',
			villagerDescription: "You are a normal villager and don't have any abilities.",
			seer: 'You are seer',
			seerDescription: "You can choose one player and uncover the player's role each day.",
			medium: 'You are medium',
			mediumDescription: "You can see which team the player executed last night belongs to when daytime comes.",
			knight: 'You are knight',
			knightDescription: 'You can choose one player to protect every night. The player cannot be killed the night.',
			werewolf: 'You are werewolf',
			werewolfDescription: 'You can choose one player to kill every night. You can chat with other werewolves on wolf chat.',
			minion: 'You are minion',
			minionDescription: "You belong to werewolf team but seen as a human. Minion wins when werewolves win. Minion doesn't have any abilities and can't see which players are werewolves.",
			close: 'CLOSE',
		},
		DialogDetails: {
			daytime: 'Daytime',
			night: 'Night',
			minutes: 'minutes',
			capacity: 'Capacity',
			fivePlayerVillage: '3 villagers, 1 seer and 1 werewolf',
			ninePlayerVillage: '4 villagers, 1 seer, 1 knight, 2 werewolves and 1 minion',
			elevenPlayerVillage: '5 villagers, 1 seer, 1 medium, 1 knight, 2 werewolves and 1 minion',
			fifteenPlayerVillage: '8 villagers, 1 seer, 1 medium, 1 knight, 3 werewolves and 1 minion',
			close: 'CLOSE',
		},
		DialogSettings: {
			title: 'Settings',
			gameName: 'Game Name',
			avatar: 'Avatar',
			uploadAvatar: 'UPLOAD AVATAR',
			preview: 'Preview',
			close: 'CLOSE',
			save: 'SAVE',
			cancel: 'CANCEL',
		},
		About: {
			about: { 
				title: "About",
				para1: "Werewolf Plain is a simple and easy to use werewolf game server.",
			},
			settingUp: {
				para1: '1. Press "Host Game" to create a new village.',
				para2: '2. Press "Start" to start the game after the village gets full.',
				para3: "The host can kick out players before starting the game. Players can leave the villager before the game starts. If the host leaves the village, the village will be deleted. If one week passed since the village created and the game haven't started, it will also be deleted automatically.",
			},
			villageAndRoles: {
				title: 'Village and Roles',
				para1: '5 player game',
				para2: '3 villagers, 1 seer and 1 werewolf',
				para3: '9 player game',
				para4: '4 villagers, 1 seer, 1 knight, 2 werewolves and 1 minion',
				para5: '11 player game',
				para6: '5 villagers, 1 seer, 1 medium, 1 knight, 2 werewolves and 1 minion',
				para7: '15 player game',
				para8: '8 villagers, 1 seer, 1 medium, 1 knight, 3 werewolves and 1 minion',
			}			
		},
		Rules: {
			title: 'Rules',
			howToWin: {
				title: 'How to win',
				para1: 'The village wins if they can execute all werewolves. The werewolves win if they can kill enough villagers and the number of werewolves can be equal or greater than the number of villagers.',
				para2: 'Villagers vote a player and execute a player each day so they can kill all werewolves. Werewolves select and bite a player every night.',
			},
			gameFlow: {
				title: 'Game flow',
				para1: "There are two phases each day and will repeat until the game finishes. In daytime, players discuss and villagers have to find out who are likely to be werewolves and vote a player. At night, villagers aren't allowed to discuss, but werewolves can talk on wolf chat. When daytime comes, a player that is most voted will be executed and a villager that is most selected by werewolves will be killed. Dead players can't communicate with live players but they can see the chat and talk with other dead players. The game will finish either when all werewolves are executed or the number of werewolves are equal or greater than the number of villagers.",
			},
			roles: {
				title: 'Roles',
				para1: 'A role will be decided randomly when the game starts.',
				villager: 'Villager',
				para2: "Normal villager. They don't have any abilities.",
				seer: 'Seer',
				para3: 'Seer can choose one player each day to uncover whether the player is wereolf or not. The result will be sent every time daytime comes.',
				medium: 'Medium',
				para4: 'Medium can see which team the player executed last night belongs to when daytime comes.',
				knight: 'Knight',
				para5: 'Knight can choose one player to protect each day. The player will not be killed by werewolf at the night.',
				werewolf: 'Werewolf',
				para6: "Werewolf can choose a player each day and the most selected player will be killed at night. Werewolves can chat even during night on wolf chat. If no werewolves didn't select a player, a random villager will be killed.",
				minion: 'Minion',
				para7: "Minion belongs to werewolf team but seen as a human. Minion wins when werewolves win. Minion doesn't have any abilities and can't see which players are werewolves.",
			},
			others: {
				title: 'Others',
				voting: 'Voting',
				para1: "Every players need to vote a player by the time next day's daytime comes. Players who didn't vote will commit suicide. Players can change the selected player anytime in the day. If there are multiple players who are voted the most, the executed player will be decided randomly in the players. A player will be executed first, then, if a werewolf is still alive, a villager will be killed. If werewolves select the same player as the one who are executed, no one will be killed. If nobody voted and all players commit suicide, the village will win.",
			}
		},
		RoomList: {
			new: 'New',
			ongoing: 'Ongoing',
			closed: 'Closed',
			name: 'Name',
			participants: 'Participants',
			details: 'Details',
			enter: 'Enter',
		},
		Game: {
			all: 'All',
			wolfChat: 'Werewolf Chat',
			resultsSeer: 'Results (Seer)',
			resultsMedium: 'Results (Medium)',
		},
		Profile: {
			win: 'Win',
			lose: 'Lose',
			winRate: 'Win Rate',
			role: 'Role',
			villager: 'Villager',
			werewolf: 'Werewolf',
			seer: 'Seer',
			medium: 'Medium',
			knight: 'Knight',
			minion: 'Minion',
			save: 'SAVE',
			cancel: 'CANCEL',
		},
	}
}