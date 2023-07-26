import { StatusBar } from "expo-status-bar"
import { FC, ReactNode } from "react"
import { View } from "react-native"

export const ScreenView: FC<{
  children: ReactNode
  withDarkStatusBar?: true
}> = ({ children, withDarkStatusBar }) => {
  return (
    <>
      <StatusBar style={withDarkStatusBar ? "dark" : "light"} />
      <View className="flex-1 bg-purple-200 relative">{children}</View>
    </>
  )
}
