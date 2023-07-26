import { Ionicons } from "@expo/vector-icons"
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker"
import { StyledComponent } from "nativewind"
import { useState } from "react"
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Screen } from "."
import { ScreenView } from "../components/ScreenView"
import { addChannel } from "../services"
import { uploadImageAsync } from "../services/storage"
import { useUser } from "../services/user"
import { optional } from "../types"
import { pickImage } from "../services/pickImage"

export const CreateChannel: Screen<"CreateChannel"> = ({ navigation }) => {
  const user = useUser()
  const [imageUri, setImageUri] = useState<optional<string>>(null)
  const [name, setName] = useState("")
  const changeImage = () => {
    pickImage().then(setImageUri)
  }
  const createChannel = async () => {
    try {
      if (!name) {
        return
      }
      const channelRef = await addChannel({
        name,
        admin: user.email!,
        participants: [],
      })
      if (imageUri) {
        await uploadImageAsync(`channels/${channelRef.id}`, imageUri)
      }
      navigation.navigate("Home")
    } catch (e) {
      alert(e)
    }
  }
  return (
    <ScreenView>
      <SafeAreaView className="bg-purple-800 shadow-2xl shadow-purple-950">
        <View className="p-20 flex flex-row justify-center relative">
          <TouchableOpacity
            className="absolute top-5 left-5"
            onPress={navigation.goBack}
          >
            <StyledComponent
              className="text-purple-50"
              component={Ionicons}
              name="arrow-back"
              size={35}
            />
          </TouchableOpacity>
          <View className="absolute -bottom-20 w-40 aspect-square bg-purple-200 border-[10px] border-purple-200 rounded-full shadow-2xl shadow-purple-950 flex-row justify-center items-center">
            <TouchableOpacity
              className="w-full aspect-square rounded-full items-center justify-center"
              onPress={changeImage}
            >
              {imageUri ? (
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
        </View>
      </SafeAreaView>
      <TextInput
        className="m-10 mt-28 p-4 text-xl bg-purple-50 rounded-2xl"
        placeholderTextColor="gray"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <View className="flex items-center justify-center">
        <TouchableOpacity
          className="w-1/2 p-5 bg-purple-800 rounded-3xl flex items-center justify-center"
          onPress={createChannel}
        >
          <Text className="text-lg font-medium text-purple-50 text-center">
            Create Channel
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenView>
  )
}
