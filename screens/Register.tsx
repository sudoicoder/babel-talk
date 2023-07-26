import { Ionicons } from "@expo/vector-icons"
import { StyledComponent } from "nativewind"
import { useState } from "react"
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Screen } from "."
import { ScreenView } from "../components/ScreenView"
import { addProfile, useSignUp } from "../services"

export const Register: Screen<"Register"> = ({ navigation }) => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmedPassword, setConfirmedPassword] = useState("")
  const [signUp] = useSignUp()
  const doSignUp = () => {
    if (!name) {
      return
    }
    if (!email) {
      return
    }
    if (!password) {
      return
    }
    if (!confirmedPassword) {
      return
    }
    if (confirmedPassword !== password) {
      return
    }
    signUp(email, password).then(credential => {
      if (credential) {
        addProfile({
          id: email,
          name: name,
          language: "english",
          participatesIn: [],
        })
      }
    })
  }
  return (
    <ScreenView>
      <ScrollView>
        <SafeAreaView className="relative">
          <Image
            className="h-48 mt-1 self-center"
            resizeMode="contain"
            source={require("../assets/Logo.png")}
          />
          <TouchableOpacity
            className="ml-3 p-2 absolute top-8 left-1"
            onPress={navigation.goBack}
          >
            <StyledComponent
              className="text-purple-50"
              component={Ionicons}
              name="arrow-back"
              size={35}
            />
          </TouchableOpacity>
          <Text className="py-6 text-5xl text-center text-purple-800 font-bold">
            Sign up
          </Text>
          <TextInput
            className="m-3 p-4 text-xl bg-purple-50 rounded-2xl"
            placeholderTextColor="gray"
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            className="m-3 p-4 text-xl bg-purple-50 rounded-2xl"
            placeholderTextColor="gray"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className="m-3 p-4 text-xl bg-purple-50 rounded-2xl"
            placeholderTextColor="gray"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            className="m-3 p-4 text-xl bg-purple-50 rounded-2xl"
            placeholderTextColor="gray"
            placeholder="Confirm password"
            value={confirmedPassword}
            onChangeText={setConfirmedPassword}
            secureTextEntry
          />
          <TouchableOpacity
            className="m-3 p-4 bg-purple-500 rounded-2xl shadow shadow-purple-950"
            onPress={doSignUp}
          >
            <Text className="text-xl text-purple-50 text-center font-bold">
              Sign up
            </Text>
          </TouchableOpacity>
          <Text className="my-3 text-sm text-center text-gray-500 font-medium">
            Or continue with
          </Text>
          <View className="mb-5 flex flex-row justify-center gap-2">
            <TouchableOpacity className="p-2 bg-purple-50 rounded-lg">
              <StyledComponent
                className="text-gray-500"
                component={Ionicons}
                name="logo-google"
                size={40}
              />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-purple-50 rounded-lg">
              <StyledComponent
                className="text-gray-500"
                component={Ionicons}
                name="logo-github"
                size={40}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </ScreenView>
  )
}
