import {
  addDoc,
  collection,
  doc,
  getDoc,
  or,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore"
import {
  useAuthState,
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword as useFirebaseSignInWithEmailAndPassword,
  useSignOut as useFirebaseSignOut,
} from "react-firebase-hooks/auth"
import {
  useCollectionData,
  useDocumentData,
} from "react-firebase-hooks/firestore"
import {
  channelConverter,
  chatConverter,
  participantConverter,
} from "./converters"
import { auth, repo } from "./firebase"
import { Channel, Participant } from "./types"

export const checkUser = (email: Participant["id"]) =>
  getDoc(doc(repo, "users", email)).then(snapshot => snapshot.exists())

export const updateChannelName = (channelId: Channel["id"], newName: string) =>
  updateDoc(doc(repo, "channels", channelId).withConverter(channelConverter), {
    name: newName,
  })

export const addChannel = (channelInfo: Omit<Channel, "id">) =>
  addDoc(
    collection(repo, "channels").withConverter(channelConverter),
    channelInfo
  )

export const addProfile = (participant: Participant) =>
  setDoc(
    doc(repo, "users", participant.id).withConverter(participantConverter),
    participant
  )

export const removeParticipantFromChannel = (
  channel: Channel,
  participantId: Participant["id"]
) =>
  updateDoc(doc(repo, "channels", channel.id).withConverter(channelConverter), {
    participants: channel.participants.filter(id => id !== participantId),
  })

export const useSignIn = () => useFirebaseSignInWithEmailAndPassword(auth)

export const useSignUp = () => useCreateUserWithEmailAndPassword(auth)

export const useSignOut = () => useFirebaseSignOut(auth)

export const useAuth = () => useAuthState(auth)

export const useChannels = (userId: string) =>
  useCollectionData(getChannelsCollection(userId))

export const useChats = (channelId: Channel["id"]) =>
  useCollectionData(query(getChatsCollection(channelId), orderBy("timestamp")))

export const useParticipant = (participantId: Participant["id"]) =>
  useDocumentData(getParticipantDocument(participantId))

const getParticipantDocument = (participantId: string) => {
  const ref = doc(repo, "users", participantId)
  return ref.withConverter(participantConverter)
}

const getChatsCollection = (channelId: string) => {
  const ref = collection(repo, "channels", channelId, "chats")
  return ref.withConverter(chatConverter)
}

function getChannelsCollection(userId: string) {
  const ref = collection(repo, "channels").withConverter(channelConverter)
  return query(
    ref,
    or(
      where("admin", "==", userId),
      where("participants", "array-contains", userId)
    )
  )
}
