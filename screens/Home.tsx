import { Ionicons } from "@expo/vector-icons"
import { StyledComponent } from "nativewind"
import { useEffect, useState } from "react"
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import { Screen } from "."
import { SafeAreaView } from "../components/SafeAreaView"
import { ScreenView } from "../components/ScreenView"
import { useChannels } from "../services"
import { getImageUri } from "../services/storage"
import { Channel } from "../services/types"
import { useUser } from "../services/user"
import { FC, optional } from "../types"

export const Home: Screen<"Home"> = ({ navigation }) => {
  const user = useUser()
  const [channels] = useChannels(user.email!)
  const gotoCreateChannel = () => {
    return navigation.navigate("CreateChannel")
  }
  const gotoProfile = () => {
    return navigation.navigate("Profile")
  }
  const gotoChats = (channel: Channel) => {
    return navigation.navigate("Chats", { channel })
  }
  return (
    <ScreenView>
      <SafeAreaView className="bg-purple-800">
        <View className="px-8 py-5 flex-row items-center justify-between">
          <TouchableOpacity onPress={gotoCreateChannel}>
            <StyledComponent
              className="text-purple-50"
              component={Ionicons}
              name="add-circle-outline"
              size={30}
            />
          </TouchableOpacity>
          <Text className="text-xl text-purple-50 font-semibold">
            BABEL TALK
          </Text>
          <TouchableOpacity onPress={gotoProfile}>
            <StyledComponent
              className="text-purple-50"
              component={Ionicons}
              name="person-circle-outline"
              size={30}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={channels}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChannelItem
            channel={item}
            gotoChats={gotoChats}
          />
        )}
      />
    </ScreenView>
  )
}

const ChannelItem: FC<{
  channel: Channel
  gotoChats: (channel: Channel) => void
}> = ({ channel, gotoChats }) => {
  const [imageUri, setImageUri] = useState<optional<string>>(null)
  useEffect(() => {
    getImageUri(`channels/${channel.id}`).then(setImageUri)
  }, [])
  return (
    <TouchableOpacity onPress={() => gotoChats(channel)}>
      <View className="mt-1 p-5 flex-row bg-purple-100 relative">
        <Image
          className="w-14 aspect-square bg-gray-400 rounded-full"
          source={{ uri: imageUri ?? undefined }}
        />
        <View className="w-5 aspect-square absolute left-16 top-4 bg-purple-800 border border-white rounded-full items-center justify-center">
          <Text className="text-purple-50 text-xs">
            {channel.participants.length + 1}
          </Text>
        </View>
        <Text className="flex-1 py-3 pl-10 text-lg font-bold">
          {channel.name}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
