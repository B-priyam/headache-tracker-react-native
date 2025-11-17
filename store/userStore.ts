import { create } from "zustand";
import { persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type UserState = {
  name: string | null;
  setName: (name: string | null) => void;
  gender: "male" | "female" | "";
  setGender: (gender: "male" | "female" | "") => void;
  email: string | null;
  setEmail: (email: string | null) => void;
  createdAt: Date | null;
  setCreatedAt: (createdAt: Date | null) => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      name: null,
      setName: (name) => set({ name }),
      gender: "",
      setGender: (gender) => set({ gender }),
      email: null,
      setEmail: (email) => set({ email }),
      createdAt: null,
      setCreatedAt: (createdAt) => set({ createdAt }),
    }),
    {
      name: "user-storage", // key name in AsyncStorage
      storage: {
        getItem: async (name: string) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name: string, value: any) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name: string) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
