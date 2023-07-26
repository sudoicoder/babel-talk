import { MediaTypeOptions, launchImageLibraryAsync } from "expo-image-picker"

export const pickImage = async () => {
  try {
    const result = await launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    if (!result.canceled) {
      return result.assets[0].uri
    }
  } catch (e) {
    alert(e)
  }
  return null
}
