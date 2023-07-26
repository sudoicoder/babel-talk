import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { storage } from "./firebase"

import { useDownloadURL } from "react-firebase-hooks/storage"

export const uploadImageAsync = async (path, uri) => {
  try {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.onerror = function (e) {
        console.log(e)
        reject(new TypeError("Network request failed"))
      }
      xhr.responseType = "blob"
      xhr.open("GET", uri, true)
      xhr.send(null)
    })
    const fileRef = ref(storage, path)
    await uploadBytes(fileRef, blob)
    blob.close()
  } catch (e) {}
}

export const useImageUri = path => useDownloadURL(ref(storage, path))

export const getImageUri = async path => {
  try {
    return await getDownloadURL(ref(storage, path))
  } catch (e) {
    return null
  }
}
