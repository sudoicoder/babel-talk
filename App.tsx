import { SafeAreaProvider } from "react-native-safe-area-context"
import { NavigationContainer } from "@react-navigation/native"
import { Main } from "./Main"
import { LogBox } from "react-native"

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
])

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Main />
      </SafeAreaProvider>
    </NavigationContainer>
  )
}
