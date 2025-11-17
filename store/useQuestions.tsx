import { Region } from "@/constants/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Updater<T> = T | ((prev: T) => T);

type GlobalStore = {
  startTime: Date | string;
  setStartTime: (value: Updater<Date | string>) => void;

  endTime: Date | string;
  setEndTime: (value: Updater<Date | string>) => void;

  triggers: string[];
  setTriggers: (value: Updater<string[]>) => void;

  severity: string;
  setSeverity: (value: Updater<string>) => void;

  selectedSense: string[];
  setSelectedSense: (value: Updater<string[]>) => void;

  symptoms: string[];
  setSymptoms: (value: Updater<string[]>) => void;

  relieve: string[];
  setRelieve: (value: Updater<string[]>) => void;

  region: Region[];
  setRegion: (value: Updater<Region[]>) => void;

  medicine: string;
  setMedicine: (value: Updater<string>) => void;

  medicinesList: string[];
  setMedicinesList: (value: Updater<string[]>) => void;

  recurrence: string;
  setRecurrence: (value: Updater<string>) => void;

  relievedMedicine: string;
  setRelievedMedicine: (value: Updater<string>) => void;
};

export const useGlobal = create<GlobalStore>()(
  persist(
    (set) => ({
      startTime: "",
      setStartTime: (value) =>
        set((state) => ({
          startTime:
            typeof value === "function" ? value(state.startTime) : value,
        })),

      endTime: "",
      setEndTime: (value) =>
        set((state) => ({
          endTime: typeof value === "function" ? value(state.endTime) : value,
        })),

      triggers: [],
      setTriggers: (value) =>
        set((state) => ({
          triggers: typeof value === "function" ? value(state.triggers) : value,
        })),

      severity: "",
      setSeverity: (value) =>
        set((state) => ({
          severity: typeof value === "function" ? value(state.severity) : value,
        })),

      selectedSense: [],
      setSelectedSense: (value) =>
        set((state) => ({
          selectedSense:
            typeof value === "function" ? value(state.selectedSense) : value,
        })),

      symptoms: [],
      setSymptoms: (value) =>
        set((state) => ({
          symptoms: typeof value === "function" ? value(state.symptoms) : value,
        })),

      relieve: [],
      setRelieve: (value) =>
        set((state) => ({
          relieve: typeof value === "function" ? value(state.relieve) : value,
        })),

      region: [],
      setRegion: (value) =>
        set((state) => ({
          region: typeof value === "function" ? value(state.region) : value,
        })),

      medicine: "",
      setMedicine: (value) =>
        set((state) => ({
          medicine: typeof value === "function" ? value(state.medicine) : value,
        })),

      medicinesList: [],
      setMedicinesList: (value) =>
        set((state) => ({
          medicinesList:
            typeof value === "function" ? value(state.medicinesList) : value,
        })),

      recurrence: "",
      setRecurrence: (value) =>
        set((state) => ({
          recurrence:
            typeof value === "function" ? value(state.recurrence) : value,
        })),

      relievedMedicine: "",
      setRelievedMedicine: (value) =>
        set((state) => ({
          relievedMedicine:
            typeof value === "function" ? value(state.relievedMedicine) : value,
        })),
    }),

    {
      name: "global-store",
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
