import { Timestamp } from "firebase/firestore"

export type Channel = {
  id: string
  name: string
  admin: Participant["id"]
  participants: Participant["id"][]
}

export type Participant = {
  id: string
  name: string
  language: string
  participatesIn: Channel["id"][]
}

export type Chat = {
  id: string
  message: string
  timestamp: Timestamp
  participant: Participant["id"]
}
