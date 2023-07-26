import { Ionicons } from "@expo/vector-icons"
import { StyledComponent } from "nativewind"
import { FC, useMemo } from "react"
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "../components/SafeAreaView"
import { Screen } from "."
import { ScreenView } from "../components/ScreenView"
import { useChats, useParticipant, useAuth } from "../services"
import { Chat } from "../services/types"
import { useUser } from "../services/user"
import { useImageUri } from "../services/storage"

export const Chats: Screen<"Chats"> = ({ navigation, route }) => {
  const { channel } = route.params
  const [chats] = useChats(channel.id)
  return (
    <ScreenView>
      <SafeAreaView className="bg-purple-800">
        <SafeAreaView className="p-5 pt-3 flex flex-row items-center">
          <TouchableOpacity>
            <StyledComponent
              className="text-purple-50"
              component={Ionicons}
              name="arrow-back"
              size={35}
              onPress={navigation.goBack}
            />
          </TouchableOpacity>
          <Text className="px-8 flex-1 text-purple-50 text-2xl font-semibold text-center">
            {channel.name}
          </Text>
          <TouchableOpacity>
            <StyledComponent
              className="text-purple-50"
              component={Ionicons}
              name="settings-sharp"
              size={30}
              onPress={() => navigation.push("Settings", { channel })}
            />
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaView>
      <FlatList
        className="p-3"
        data={chats}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChatItem chat={item} />}
      />
      <TouchableOpacity className="my-5 w-full flex flex-row justify-center">
        <StyledComponent
          className="text-purple-800"
          component={Ionicons}
          name="mic-circle"
          size={80}
        />
      </TouchableOpacity>
    </ScreenView>
  )
}

const ChatItem: FC<{ chat: Chat }> = ({ chat }) => {
  const user = useUser()
  const [imageUri] = useImageUri(chat.participant)
  const isOwnChat = chat.participant === user.email
  return (
    <View
      className={`mb-5 flex ${
        isOwnChat ? "flex-row-reverse" : "flex-row"
      } gap-1`}
    >
      <Image
        className={`w-6 aspect-square bg-gray-400 rounded-full self-center`}
        source={{
          ...(!!imageUri && { uri: imageUri }),
        }}
      />
      <StyledComponent
        className={`self-start ${isOwnChat && "-scale-x-100"}`}
        component={Ionicons}
        name="megaphone-outline"
        size={10}
      />
      <Text className="bg-purple-300 text-base font-semibold p-2 max-w-[75%] rounded-lg shadow-md shadow-gray-600">
        {chat.message}
      </Text>
    </View>
  )
}
