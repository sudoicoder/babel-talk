import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack"
import { ScreenParamsList } from "./screens"
import { Chats } from "./screens/Chats"
import { CreateChannel } from "./screens/CreateChannel"
import { Home } from "./screens/Home"
import { Login } from "./screens/Login"
import { Profile } from "./screens/Profile"
import { Register } from "./screens/Register"
import { Settings } from "./screens/Settings"
import { Splash } from "./screens/Splash"
import { useAuth } from "./services"
import { UserProvider } from "./services/user"

const NavigationStack = createNativeStackNavigator<ScreenParamsList>()

const screenOptions: NativeStackNavigationOptions = {
  headerShown: false,
}

export const Main = () => {
  const [user, loading] = useAuth()
  return loading ? (
    <NavigationStack.Navigator
      initialRouteName="Splash"
      screenOptions={screenOptions}
    >
      <NavigationStack.Screen
        name="Splash"
        component={Splash}
      />
    </NavigationStack.Navigator>
  ) : !user ? (
    <NavigationStack.Navigator
      initialRouteName="Login"
      screenOptions={screenOptions}
    >
      <NavigationStack.Screen
        name="Login"
        component={Login}
      />
      <NavigationStack.Screen
        name="Register"
        component={Register}
      />
    </NavigationStack.Navigator>
  ) : (
    <UserProvider user={user}>
      <NavigationStack.Navigator
        initialRouteName="Home"
        screenOptions={screenOptions}
      >
        <NavigationStack.Screen
          name="Home"
          component={Home}
        />
        <NavigationStack.Screen
          name="CreateChannel"
          component={CreateChannel}
        />
        <NavigationStack.Screen
          name="Profile"
          component={Profile}
        />
        <NavigationStack.Screen
          name="Chats"
          component={Chats}
        />
        <NavigationStack.Screen
          name="Settings"
          component={Settings}
        />
      </NavigationStack.Navigator>
    </UserProvider>
  )
}
