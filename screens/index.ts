import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { FC } from "react"
import { Channel } from "../services/types"

export type ScreenParamsList = {
  Splash: undefined
  Login: undefined
  Register: undefined
  Home: undefined
  CreateChannel: undefined
  Profile: undefined
  Chats: { channel: Channel }
  Settings: { channel: Channel }
}

export type Screen<ScreenName extends keyof ScreenParamsList> = FC<
  NativeStackScreenProps<ScreenParamsList, ScreenName>
>
