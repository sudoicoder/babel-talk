import { ActivityIndicator } from "react-native"
import { SafeAreaView } from "../components/SafeAreaView"
import { ScreenView } from "../components/ScreenView"

export const Splash = () => (
  <ScreenView>
    <SafeAreaView className="flex-1 items-center justify-center">
      <ActivityIndicator
        size={75}
        color="#3b0764"
      />
    </SafeAreaView>
  </ScreenView>
)
