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
import { Screen } from "."
import { SafeAreaView } from "../components/SafeAreaView"
import { ScreenView } from "../components/ScreenView"
import { useSignIn } from "../services"

export const Login: Screen<"Login"> = ({ navigation }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [signIn] = useSignIn()
  const doSignIn = () => {
    if (!email) {
      return
    }
    if (!password) {
      return
    }
    signIn(email, password)
  }
  return (
    <ScreenView withDarkStatusBar>
      <ScrollView>
        <SafeAreaView>
          <Image
            className="h-48 mt-1 self-center"
            resizeMode="contain"
            source={require("../assets/Logo.png")}
          />
        </SafeAreaView>
        <Text className="mt-3 mb-2 text-5xl text-center text-purple-900 font-bold">
          Login
        </Text>
        <View className="my-8">
          <TextInput
            className="m-3 p-4 text-xl bg-purple-50 rounded-2xl"
            placeholderTextColor="gray"
            textContentType="emailAddress"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            className="m-3 p-4 text-xl bg-purple-50 rounded-2xl"
            placeholderTextColor="gray"
            placeholder="Password"
            textContentType="password"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
          />
          <TouchableOpacity className="mx-3 my-1 self-end">
            <Text className="text-base font-bold">Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="m-3 p-4 bg-purple-500 rounded-2xl shadow shadow-purple-950"
            disabled={!email || !password}
            onPress={doSignIn}
          >
            <Text className="text-xl text-purple-50 text-center font-bold">
              Sign in
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text className="mt-1 text-base text-center font-bold">
              Register
            </Text>
          </TouchableOpacity>
          <Text className="my-2 text-base text-gray-400 text-center font-normal">
            Or continue with
          </Text>
          <View className="flex flex-row justify-center gap-2">
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
        </View>
      </ScrollView>
    </ScreenView>
  )
}
