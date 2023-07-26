import { FirestoreDataConverter } from "firebase/firestore"
import { Channel, Chat, Participant } from "./types"

export const channelConverter: FirestoreDataConverter<Channel> = {
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)!
    return {
      id: snapshot.id,
      name: data.name,
      admin: data.admin,
      participants: data.participants,
    }
  },
  toFirestore: channel => ({
    name: channel.name,
    admin: channel.admin,
    participants: channel.participants,
  }),
}

export const participantConverter: FirestoreDataConverter<Participant> = {
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    return {
      id: snapshot.id,
      name: data.name,
      language: data.language,
      participatesIn: data.participatesIn,
    }
  },
  toFirestore: participant => {
    return {
      name: participant.name,
      language: participant.language,
      participatesIn: participant.participatesIn,
    }
  },
}

export const chatConverter: FirestoreDataConverter<Chat> = {
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)
    return {
      id: snapshot.id,
      message: data.message,
      timestamp: data.timestamp,
      participant: data.participant,
    }
  },
  toFirestore: chat => {
    return {
      message: chat.message,
      timestamp: chat.timestamp,
      participant: chat.participant,
    }
  },
}
