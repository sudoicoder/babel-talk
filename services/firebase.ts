import { getApp, getApps, initializeApp } from "firebase/app"
import {
  getReactNativePersistence,
  setPersistence,
  getAuth,
} from "firebase/auth/react-native"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

import { firebaseConfig } from "../config/firesbaseConfig"
import AsyncStorage from "@react-native-async-storage/async-storage"

const app = getApps().length <= 0 ? initializeApp(firebaseConfig) : getApp()

export const repo = getFirestore(app)

export const auth = getAuth(app)

export const storage = getStorage(app)

setPersistence(auth, getReactNativePersistence(AsyncStorage))
