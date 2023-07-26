import { View, ViewProps } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export const SafeAreaView = ({ children, style, ...props }: ViewProps) => {
  const insets = useSafeAreaInsets()
  return (
    <View
      style={[
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  )
}
