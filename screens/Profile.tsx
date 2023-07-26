import { Ionicons } from "@expo/vector-icons"
import { StyledComponent } from "nativewind"
import { useEffect, useState } from "react"
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Screen } from "."
import { SafeAreaView } from "../components/SafeAreaView"
import { ScreenView } from "../components/ScreenView"
import { useParticipant, useSignOut } from "../services"
import { pickImage } from "../services/pickImage"
import { getImageUri, uploadImageAsync } from "../services/storage"
import { useUser } from "../services/user"
import { optional } from "../types"
import { doc, updateDoc } from "firebase/firestore"
import { repo } from "../services/firebase"
import { participantConverter } from "../services/converters"

export const Profile: Screen<"Profile"> = ({ navigation }) => {
  const user = useUser()
  const [participant] = useParticipant(user.email!)
  const [imageUri, setImageUri] = useState<optional<string>>(null)
  const [signOut] = useSignOut()
  const [language, setLanguage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  useEffect(() => {
    getImageUri(`users/${user.email}`).then(setImageUri)
  }, [])
  const changeImage = async () => {
    const newImageUri = await pickImage()
    setImageUri(newImageUri)
    await uploadImageAsync(`users/${user.email}`, newImageUri)
  }
  const changeLanguage = async () => {
    updateDoc(
      doc(repo, "users", user.email!).withConverter(participantConverter),
      {
        language: language.toLowerCase(),
      }
    ).then(() => setIsProcessing(false))
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
            <TouchableOpacity onPress={changeImage}>
              {imageUri ? (
                <Image
                  className="w-full aspect-square rounded-full"
                  source={{
                    uri: imageUri,
                  }}
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
      <Text className="mt-28 mb-5 text-3xl font-bold text-center">
        {participant?.name}
      </Text>
      <View className="p-10 flex items-center justify-center">
        <TouchableOpacity
          className="p-5 bg-purple-100 rounded-3xl shadow shadow-purple-950 flex-row items-center"
          onPress={!isProcessing ? () => setIsProcessing(true) : undefined}
          disabled={isProcessing}
        >
          <TextInput
            className={`my-1 text-sx text-center ${
              isProcessing && "outline outline-purple-950"
            }`}
            editable={isProcessing}
            placeholder={participant?.language.toUpperCase()}
            placeholderTextColor="gray"
            value={
              isProcessing ? language : participant?.language.toUpperCase()
            }
            onChangeText={isProcessing ? setLanguage : undefined}
          />
          {isProcessing && (
            <>
              <TouchableOpacity
                className="ml-2"
                onPress={changeLanguage}
                disabled={isProcessing && !language}
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
                  setIsProcessing(false)
                  setLanguage("")
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
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className="w-1/2 my-16 p-5 bg-purple-800 rounded-3xl flex items-center justify-center"
          onPress={signOut}
        >
          <Text className="text-lg font-medium text-purple-50 text-center">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenView>
  )
}
