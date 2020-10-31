export interface Count {
  name: string,
  count: number,
}

export interface Player {
  uid: string,
  name: string,
  role: string,
  avatar: string | null,
  isAlive: boolean,
  votedPlayer: Player | null,
  bittenPlayer: Player | null,
  protectedPlayer: Player | null,
  divinedPlayer: Player | null,  
}

export interface Room {
  id: string,
  timestamp: Date,
  name: string,
  description: string,
  capacity: number,
  dayLength: number,
  nightLength: number,
  isPrivate: boolean,
  accessCode: string,
  numberOfParticipants: number,
  status: string,
  isNight: boolean,
  ownerId: string,
  banList: string[],
}