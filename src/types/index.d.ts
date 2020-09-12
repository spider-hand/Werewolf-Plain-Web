export interface Room {
	id?: string,
	timestamp: Date,
	name: string,
	description: string,
	capacity: number,
	dayLength: number,
	nightLength: number,
	language: string,
	isPrivate: boolean,
	accessCode: string,
	numberOfParticipants: number,
	status: string,
	isNight: boolean,
	ownerId: string,
	banList: string[],
	language: string,
}

export interface Player {
	uid: string,
	name: string,
	role: string,
	avatar: string,
	isAlive: boolean,
	votedPlayer: Player | null,
	bittenPlayer: Player | null,
	protectedPlayer: Player | null,
	divinedPlayer: Player | null,
}

export interface Message {
	from: string,
	timestamp: Date,
	body: string,
	gameName: string,
	avatar: string,
	isFromGrave: boolean,
}

export interface User {
	username: string,
	inGameName: string,
	avatar: string,
}