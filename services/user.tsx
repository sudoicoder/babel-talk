import { User } from "firebase/auth"
import { createContext, useContext } from "react"
import { FC } from "../types"

const UserContext = createContext<User | null | undefined>(undefined)

export const UserProvider: FC<{ user: User }> = ({ user, children }) => (
  <UserContext.Provider value={user}>{children}</UserContext.Provider>
)

export const useUser = () => {
  const user = useContext(UserContext)
  if (!user) {
    throw new Error("UserProvider is not found!")
  }
  return user
}
