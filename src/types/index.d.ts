import { User as FirebaseUser } from 'firebase'

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

export interface Player {
  uid: string,
  name: string,
  role: string | null,
  avatar: string | null,
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
  avatar: string | null,
  isFromGrave: boolean,
}

export interface User {
  username: string,
  inGameName: string,
  avatar: string,
}

export interface UserState {
  user: FirebaseUser | null,
  status: boolean,
  token: string | null,
}

export interface GameState {
  isJoiningThisGame: boolean,
  room: Room | null,
  myself: Player | null,
}

export interface DialogComponent {
  open(): void,
}