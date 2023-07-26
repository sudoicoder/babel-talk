import { Ionicons } from "@expo/vector-icons"
import { StyledComponent } from "nativewind"
import { FC, useEffect, useReducer, useState } from "react"
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Screen } from "."
import { ScreenView } from "../components/ScreenView"
import {
  checkUser,
  removeParticipantFromChannel,
  updateChannelName,
  useParticipant,
} from "../services"
import { Channel, Participant } from "../services/types"
import { useUser } from "../services/user"
import { getImageUri, useImageUri } from "../services/storage"
import { pickImage } from "../services/pickImage"
import { uploadImageAsync } from "../services/storage"
import { optional } from "../types"
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore"
import { repo } from "../services/firebase"
import { channelConverter, participantConverter } from "../services/converters"

export const Settings: Screen<"Settings"> = ({ navigation, route }) => {
  const { channel } = route.params
  const [imageUri, setImageUri] = useState<optional<string>>(null)
  const [isProcessingImageChange, setIsProcessingImageChange] = useState(false)
  const [isProcessingNameChange, setIsProcessingNameChange] = useState(false)
  const [isProcessingInvite, setIsProcessingInvite] = useState(false)
  const [newName, setNewName] = useState("")
  const [newParticipant, setNewParticipantEmail] = useState("")
  const [participants, setParticipants] = useState<Channel["participants"]>(
    channel.participants
  )
  const user = useUser()
  const isAdmin = user.email === channel.admin
  useEffect(() => {
    getImageUri(`channels/${channel.id}`).then(setImageUri)
  }, [])
  useEffect(() => {
    updateDoc(
      doc(repo, "channels", channel.id).withConverter(channelConverter),
      {
        participants: participants,
      }
    )
  }, [participants])
  const removeParticipant = (participantId: Participant["id"]) =>
    removeParticipantFromChannel(channel, participantId).then(() =>
      setParticipants(o => o.filter(p => p !== participantId))
    )
  const changeImage = async () => {
    try {
      setIsProcessingImageChange(true)
      const newImageUri = await pickImage()
      if (!newImageUri) {
        return
      }
      setImageUri(newImageUri)
      await uploadImageAsync(`channels/${channel.id}`, newImageUri)
    } catch (e) {
      alert(e)
    } finally {
      setIsProcessingImageChange(false)
    }
  }
  const changeName = async () => {
    setIsProcessingNameChange(false)
    await updateChannelName(channel.id, newName)
  }
  const invite = async () => {
    setIsProcessingInvite(true)
  }
  const add = async () => {
    setIsProcessingInvite(false)
    if (!(await checkUser(newParticipant))) {
      return
    }
    setParticipants(ids => [...ids, newParticipant])
  }
  const leave = () => {
    removeParticipant(user.email!)
      .then(() => {
        const ref = doc(repo, "users", user.email!).withConverter(
          participantConverter
        )
        getDoc(ref)
          .then(snap => snap.data())
          .then(p => {
            if (p) {
              updateDoc(ref, {
                participatesIn: p.participatesIn.filter(c => c !== channel.id),
              })
            }
          })
      })
      .then(() => navigation.navigate("Home"))
  }
  const remove = () => {
    deleteDoc(doc(repo, "channels", channel.id))
      .then(() => {
        getDocs(
          query(
            collection(repo, "users").withConverter(participantConverter),
            where("participatesIn", "array-contains", channel.id)
          )
        ).then(snaps => {
          snaps.forEach(snap => {
            if (!snap) {
              return
            }
            const data = snap.data()
            updateDoc(snap.ref, {
              participatesIn: data.participatesIn.filter(c => c !== channel.id),
            })
          })
        })
      })
      .then(() => navigation.navigate("Home"))
  }
  return (
    <ScreenView>
      <SafeAreaView className="p-20 bg-purple-800 shadow-2xl shadow-purple-950 flex flex-row justify-center relative">
        <TouchableOpacity className="ml-3 p-2 absolute top-8 left-1">
          <StyledComponent
            className="text-purple-50"
            component={Ionicons}
            name="arrow-back"
            size={35}
            onPress={navigation.goBack}
          />
        </TouchableOpacity>
        <View className="w-40 aspect-square absolute -bottom-20 bg-purple-200 border-[10px] border-purple-200  rounded-full">
          <TouchableOpacity
            onPress={changeImage}
            className="w-full aspect-square items-center justify-center"
          >
            {isProcessingImageChange ? (
              <ActivityIndicator
                className="w-full aspect-square"
                color="gray"
              />
            ) : imageUri ? (
              <Image
                className="w-full aspect-square rounded-full"
                source={{ uri: imageUri }}
              />
            ) : (
              <StyledComponent
                className="text-purple-800"
                component={Ionicons}
                name="person"
                size={90}
              />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <View className="mt-20 p-1 flex-row items-center justify-center">
        <View className="mr-2">
          {isProcessingNameChange ? (
            <TextInput
              className="text-xl"
              placeholderTextColor="gray"
              placeholder={channel.name}
              value={newName}
              onChangeText={setNewName}
            />
          ) : (
            <Text className="text-2xl font-bold">{channel.name}</Text>
          )}
        </View>
        <View className="flex-row items-center justify-center gap-1">
          <TouchableOpacity
            onPress={
              isProcessingNameChange
                ? changeName
                : () => setIsProcessingNameChange(true)
            }
            disabled={isProcessingNameChange && !newName}
          >
            <StyledComponent
              className="text-gray-400"
              component={Ionicons}
              name={isProcessingNameChange ? "checkmark" : "pencil-sharp"}
              size={20}
            />
          </TouchableOpacity>
          {isProcessingNameChange && (
            <TouchableOpacity
              onPress={() => {
                setIsProcessingNameChange(false)
                setNewName("")
              }}
            >
              <StyledComponent
                className="text-gray-400"
                component={Ionicons}
                name="close"
                size={20}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <View className="my-5 flex flex-row justify-center items-center">
        {isProcessingInvite ? (
          <>
            <TextInput
              className="py-2 px-3 text-xl bg-white rounded"
              placeholderTextColor="gray"
              placeholder="New Participant Email"
              textContentType="emailAddress"
              value={newParticipant}
              onChangeText={setNewParticipantEmail}
            />
            <TouchableOpacity
              className="ml-2"
              onPress={add}
              disabled={isProcessingInvite && !newParticipant}
            >
              <StyledComponent
                className="text-gray-400"
                component={Ionicons}
                name="checkmark-sharp"
                size={25}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="ml-2"
              onPress={() => {
                setIsProcessingInvite(false)
                setNewParticipantEmail("")
              }}
            >
              <StyledComponent
                className="text-gray-400"
                component={Ionicons}
                name="close-sharp"
                size={25}
              />
            </TouchableOpacity>
          </>
        ) : (
          <>
            {isAdmin && (
              <TouchableOpacity
                className="mx-2 py-2 px-3 bg-purple-100 rounded-xl shadow-lg shadow-purple-950 "
                onPress={invite}
              >
                <Text className="font-medium text-base">Invite</Text>
              </TouchableOpacity>
            )}
            {isAdmin ? (
              <TouchableOpacity
                className="mx-2 py-2 px-3 bg-purple-100 rounded-xl shadow-lg shadow-purple-950 "
                onPress={remove}
              >
                <Text className="font-medium text-base">Delete</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                className="mx-2 py-2 px-3 bg-purple-100 rounded-xl shadow-lg shadow-purple-950 "
                onPress={leave}
              >
                <Text className="font-medium text-base">Leave</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
      <View className="mt-2 flex">
        <View className="px-2 py-1 bg-purple-200 sha shadow-md shadow-purple-950">
          <Text className="text-gray-500 font-medium">Participants</Text>
        </View>
        <FlatList
          data={[channel.admin, ...participants]}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <ParticipantItem
              isAdmin={item === channel.admin}
              participantId={item}
              forAdmin={isAdmin}
              removeParticipant={removeParticipant}
            />
          )}
          ListFooterComponent={<View className="mt-10" />}
          extraData={participants}
        />
      </View>
    </ScreenView>
  )
}

const ParticipantItem: FC<{
  isAdmin: boolean
  participantId: Participant["id"]
  forAdmin: boolean
  removeParticipant: (participantId: Participant["id"]) => Promise<void>
}> = ({ isAdmin, participantId, forAdmin, removeParticipant }) => {
  const [participant] = useParticipant(participantId)
  const [imageUri] = useImageUri(`users/${participantId}`)
  return (
    <View className="mt-2 px-5 py-4 flex flex-row items-center bg-purple-200 shadow-md shadow-purple-950 border-b-purple-900">
      <Image
        className="w-12 aspect-square bg-gray-400 rounded-full"
        source={{
          ...(!!imageUri && { uri: imageUri }),
        }}
      />
      <View className="ml-5 flex-1">
        <Text className="text-lg font-semibold">{participant?.name}</Text>
        <Text className="text-xs">{participant?.language.toUpperCase()}</Text>
      </View>
      {forAdmin && !isAdmin && (
        <TouchableOpacity
          className="mr-3 px-2 py-1"
          onPress={() => removeParticipant(participantId)}
        >
          <StyledComponent
            className="text-red-900 opacity-75"
            component={Ionicons}
            name="person-remove"
            size={15}
          />
        </TouchableOpacity>
      )}
    </View>
  )
}
