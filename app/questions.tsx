import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  Animated,
  Easing,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import TextIcon from "@/components/custom/TextIcon";
import { useGlobal } from "@/store/useQuestions";
import { symptomImages, triggerImages } from "@/constants/imageNames";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import {
  Calendar,
  CheckIcon,
  ChevronRight,
  ChevronsRight,
  ClockPlus,
  Loader2,
  Trash2,
  X,
} from "lucide-react-native";
import { useFocusEffect, useRouter } from "expo-router";
import TriggerComponent from "@/components/questions/Trigger";
import RegionComponent from "@/components/questions/RegionComponent";
import SymptomComponent from "@/components/questions/SymptomComponent";
import SeverityComponent from "@/components/questions/SeverityComponent";
import StartedEndedComponent from "@/components/questions/StartedEndedComponent";
import SummaryComponent from "@/components/questions/SummaryComponent";
import RelieveComponent from "@/components/questions/RelieveComponent";
import SenseComponent from "@/components/questions/SenseComponent";
import MedicineRelieve from "@/components/questions/MedicineRelieve";
import RecurrenceComponent from "@/components/questions/RecurrenceComponent";
import MedicineComponent from "@/components/questions/MedicineComponent";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "@/components/ui/button";
import {
  differenceInHours,
  differenceInMinutes,
  format,
  parseISO,
} from "date-fns";
import showToast from "./utils/showToast";
import { useToast } from "@/components/ui/toast";
import { setupHourlyReminder } from "@/components/custom/NotificationPermission";

const questions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const {
    symptoms,
    triggers,
    endTime,
    startTime,
    region,
    severity,
    medicine,
    medicinesList,
    recurrence,
    relieve,
    relievedMedicine,
    selectedSense,
    setEndTime,
    setMedicine,
    setMedicinesList,
    setRecurrence,
    setRegion,
    setRelieve,
    setRelievedMedicine,
    setSelectedSense,
    setSeverity,
    setStartTime,
    setSymptoms,
    setTriggers,
  } = useGlobal();

  const router = useRouter();
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const handleClose = () => setShowAlertDialog(false);
  const [isLoading, setIsLoading] = useState(false);

  const clearData = async () => {
    const remind = await SecureStore.getItemAsync("remindMeLater");
    if (remind === "true") {
      await SecureStore.deleteItemAsync("remindMeLater");
    }
    setupHourlyReminder();
    setTriggers([]);
    setEndTime("");
    setStartTime("");
    setSelectedSense([]);
    setSymptoms([]);
    setRecurrence("");
    setMedicine("");
    setSeverity("");
    setMedicinesList([]);
    setRegion([]);
    setRelieve([]);
    setRelievedMedicine("");
  };
  const handleNext = () => {
    if (currentPage === 1 && (!startTime || !endTime)) {
      return showToast(
        toast,
        "Kindly Select Start Time and End Time",
        X,
        1500,
        "error"
      );
    } else if (currentPage === 2 && !region.length) {
      return showToast(toast, "Kindly Select Region", X, 1500, "error");
    } else if (currentPage === 3 && !severity) {
      return showToast(toast, "Kindly Select Severity", X, 1500, "error");
    } else if (currentPage === 4 && !triggers.length) {
      return showToast(toast, "Kindly Select Triggers", X, 1500, "error");
    } else if (currentPage === 5 && !symptoms.length) {
      return showToast(toast, "Kindly Select Symptoms", X, 1500, "error");
    } else if (currentPage === 6 && !selectedSense.length) {
      return showToast(toast, "Kindly Select Sensitivities", X, 1500, "error");
    } else if (currentPage === 7 && !relieve.length) {
      return showToast(toast, "Kindly Select Relievers", X, 1500, "error");
    } else if (
      currentPage === 8 &&
      (!medicine ||
        (medicine === "Yes" && (!medicinesList?.length || !medicinesList[0])))
    ) {
      console.log(medicine);
      return !medicine
        ? showToast(toast, "Kindly Select Medicine Taken", X, 1500, "error")
        : showToast(toast, "Kindly Name The Medicines", X, 1500, "error");
    } else if (medicine === "Yes" && currentPage === 9 && !relievedMedicine) {
      return showToast(toast, "Kindly Select Relieved Time", X, 1500, "error");
    } else if (currentPage === 10 && !recurrence) {
      return showToast(toast, "Kindly Select Relieved Time", X, 1500, "error");
    } else {
      setCurrentPage((prev) =>
        prev === 8 && medicine === "No" ? 10 : prev + 1
      );
    }
  };

  const handleRemindMeLater = async () => {
    const remind = await SecureStore.getItemAsync("remindMeLater");
    if (remind !== "true") {
      await SecureStore.setItemAsync("remindMeLater", "true");
    }
    setupHourlyReminder();

    showToast(toast, "This Data is been successfully saved", CheckIcon, 1500);
    router.replace("/home");
  };

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        if (currentPage > 1)
          setCurrentPage((prev) =>
            prev === 10 && medicine === "No" ? 8 : prev - 1
          );
        else {
          setShowAlertDialog(true);
        }
        return true;
      });
      return () => sub.remove();
    }, [currentPage])
  );
  const toast = useToast();

  const handleSubmit = async () => {
    if (endTime === "Not yet Finished") {
      return showToast(toast, "Kindly Enter the Endtime", X, 1500, "error");
    }
    const token = await SecureStore.getItemAsync("AccessToken");
    setIsLoading(true);
    const res = await fetch("http://192.168.1.15:3000/api/questions/create", {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        symptoms,
        triggers,
        endTime,
        startTime,
        region,
        severity,
        medicine,
        medicinesList,
        recurrence,
        relieve,
        relievedMedicine,
        selectedSense,
      }),
    });

    const data = await res.json();
    if (data.status === 200) {
      showToast(toast, data.message, CheckIcon, 1500);
      router.replace("/home");
      clearData();
      setIsLoading(false);
      return;
    } else {
      showToast(toast, data.message, X, 1500, "error");
      setIsLoading(false);
      return;
    }
  };
  const rotateValue = useRef(new Animated.Value(0)).current;

  // useEffect(() => {
  //   setupHourlyReminder();
  // }, [handleRemindMeLater, clearData]);

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const text: Record<number, string> = {
    1: "Do you know when it started?",
    2: "Highlight the area of Pain",
    3: "Severity of pain",
    4: "Triggers",
    5: "Symptoms",
    6: "Did you sense the headache coming?",
    7: "What did you do to relieve the headache?",
    8: "Are you taking any Precribed medicines?",
    9: "In how much time headache was relieved?",
    10: "Is there any recurrence of headache in 24 hours?",
    11: "Summary",
  };
  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#F59A6E", "#FFCE4E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="absolute top-0 left-0 w-full"
        style={{
          height:
            currentPage === 6 ||
            currentPage === 7 ||
            currentPage === 8 ||
            currentPage === 9 ||
            currentPage === 10
              ? 120
              : currentPage === 11
              ? 160
              : 80,
        }}
      />
      {currentPage === 11 ? (
        <View className="items-center justify-center flex -mt-5">
          <Text className="text-[#00748D] font-semibold text-2xl px-6 text-center my-4 border-[#00748D] p-2 w-40 rounded-xl border">
            {text[currentPage]}
          </Text>
          <View className="flex flex-row items-center gap-2 -mt-2">
            <Calendar color={"#00748D"} />
            <Text className="text-[#00748D] font-semibold">DURATION</Text>
          </View>
          {endTime === "Not yet Finished" ? (
            <Text className="text-[#00748D] text-lg font-semibold">
              Not yet Finished
            </Text>
          ) : (
            <Text className="text-[#00748D] font-semibold">
              {(() => {
                const end = endTime instanceof Date ? endTime : new Date();
                const start = new Date(startTime);

                const hours = differenceInHours(end, start);
                const minutes = differenceInMinutes(end, start) % 60;

                return `${hours}H : ${minutes}M`;
              })()}
            </Text>
          )}
          <View className="flex flex-row gap-20">
            <View className="bg-white rounded-xl px-7 items-center">
              <Text className="text-[#00748D] font-semibold">START TIME</Text>
              <Text className="font-semibold">
                {startTime ? format(new Date(startTime), "hh:mm:a") : "--:--"}
              </Text>
              <Text>
                {startTime
                  ? format(new Date(startTime), "dd/MM/yy")
                  : "--/--/--"}
              </Text>
            </View>
            <View className="bg-white rounded-xl px-7">
              <Text className="text-[#00748D] font-semibold">END TIME</Text>
              {endTime === "Not yet Finished" ? (
                <Text>Not yet Finished</Text>
              ) : (
                <>
                  <Text className="font-semibold">
                    {endTime ? format(new Date(endTime), "hh:mm:a") : "--:--"}
                  </Text>
                  <Text>
                    {endTime
                      ? format(new Date(endTime), "dd/MM/yy")
                      : "--/--/--"}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
      ) : (
        <Text className="text-[#00748D] font-semibold text-2xl px-6 text-center my-2">
          {text[currentPage]}
        </Text>
      )}
      {currentPage === 1 ? (
        <StartedEndedComponent />
      ) : currentPage === 2 ? (
        <RegionComponent />
      ) : currentPage === 3 ? (
        <SeverityComponent />
      ) : currentPage === 4 ? (
        <TriggerComponent />
      ) : currentPage === 5 ? (
        <SymptomComponent />
      ) : currentPage === 6 ? (
        <SenseComponent />
      ) : currentPage === 7 ? (
        <RelieveComponent />
      ) : currentPage === 8 ? (
        <MedicineComponent />
      ) : currentPage === 9 ? (
        <MedicineRelieve />
      ) : currentPage === 10 ? (
        <RecurrenceComponent />
      ) : (
        <SummaryComponent />
      )}
      <View>
        <TouchableOpacity
          onPress={() => {
            if (currentPage === 11) {
              setShowAlertDialog(true);
            } else {
              handleRemindMeLater();
            }
          }}
        >
          <LinearGradient
            colors={["#00748D", "#00BFBF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="absolute bottom-0 left-0 w-1/2"
            style={{ height: 80 }} // ensure height is applied
          />

          {currentPage === 11 ? (
            <View className="flex items-center flex-row gap-2 justify-center absolute w-1/2 -top-14">
              <Trash2 className="text-white text-lg" color={"white"} />
              <Text className="text-white">Delete</Text>
            </View>
          ) : (
            <View className="flex items-center flex-row gap-2 justify-center absolute w-1/2 -top-14">
              <ClockPlus className="text-white text-lg" color={"white"} />
              <Text className="text-white">Remind me later</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (currentPage < 11) {
              handleNext();
            } else {
              handleSubmit();
            }
          }}
        >
          <LinearGradient
            colors={["#00748D", "#00BFBF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="absolute bottom-0 right-0 w-1/2"
            style={{ height: 80 }} // ensure height is applied
          />
          {currentPage === 11 ? (
            <View className="flex items-center flex-row justify-center right-0 absolute w-1/2 -top-14">
              {isLoading ? (
                <View className="flex flex-row items-center gap-2">
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Loader2
                      color={"white"}
                      className="animate-spin text-white"
                    />
                  </Animated.View>
                  <Text className="text-white">Submitting</Text>
                </View>
              ) : (
                <View className="flex flex-row items-center">
                  <Text className="text-white text-lg">Confirm</Text>
                  <ChevronRight className="text-white" color={"white"} />
                </View>
              )}
            </View>
          ) : (
            <View className="flex items-center flex-row justify-center right-0 absolute w-1/2 -top-14">
              <Text className="text-white text-lg">Next</Text>
              <ChevronsRight className="text-white" color={"white"} />
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View>
        <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
          <AlertDialogBackdrop />
          <AlertDialogContent>
            <AlertDialogHeader>
              <Text className="text-typography-950 font-semibold py-5">
                Are you sure you want to exit?
              </Text>
            </AlertDialogHeader>
            <AlertDialogFooter className="">
              <Button
                variant="outline"
                action="secondary"
                onPress={handleClose}
                size="sm"
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                size="sm"
                onPress={() => {
                  router.replace("/home");
                  clearData();
                }}
              >
                <ButtonText>Exit</ButtonText>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </View>
    </SafeAreaView>
  );
};

export default questions;
