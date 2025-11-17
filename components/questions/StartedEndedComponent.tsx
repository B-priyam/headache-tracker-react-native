import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock5, X } from "lucide-react-native";
import { format } from "date-fns";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobal } from "@/store/useQuestions";
import { useToast } from "../ui/toast";
import showToast from "@/app/utils/showToast";

const StartedEndedComponent = () => {
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [mode, setMode] = useState("date");
  const [current, setCurrent] = useState("");
  const { endTime, setEndTime, setStartTime, startTime } = useGlobal();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) return;

    if (current === "startDate") setStartTime(selectedDate);
    else if (current === "endDate") {
      setEndTime(selectedDate);
    }

    setShowDateTimePicker(false);

    if (Platform.OS === "android") {
      if (mode === "date") {
        setMode("time");
        setShowDateTimePicker(true);
      } else {
        setShowDateTimePicker(false);
        setMode("date");
      }
    }
  };

  const toast = useToast();

  useEffect(() => {
    if (
      startTime instanceof Date &&
      endTime instanceof Date &&
      new Date(endTime) < new Date(startTime)
    ) {
      showToast(
        toast,
        "Endtime cannot be less than Starttime",
        X,
        1500,
        "error"
      );
      setEndTime("");
      setEnd("");
    }
  }, [startTime, endTime]);

  useEffect(() => {
    if (startTime && endTime) {
      setStartTime(startTime !== "" ? new Date(startTime) : "");
      setEndTime(
        endTime !== ""
          ? endTime !== "Not yet Finished"
            ? new Date(endTime)
            : "Not yet Finished"
          : ""
      );
    }
  }, []);

  const showDatePicker = () => {
    setMode("date");
    setShowDateTimePicker(true);
  };
  return (
    <SafeAreaView className="flex-1">
      <View>
        <View className="flex flex-row w-full justify-between px-5 items-center">
          <View className="flex flex-row items-center gap-2">
            <Clock5 color={"#00748D"} height={30} width={30} />
            <Text className="text-lg max-w-14 font-semibold text-[#00748D]">
              Start Time
            </Text>
          </View>
          <Text className="text-[#00748D] font-semibold">
            {startTime && startTime instanceof Date
              ? format(startTime, "dd/MM/yy")
              : ""}
          </Text>
          <Text className="font-semibold text-[#00748D]">
            {startTime && startTime instanceof Date
              ? format(startTime, "hh:mm a")
              : ""}
          </Text>
        </View>
        <View className="my-2 w-full border border-black" />
        <View className="flex flex-row w-full justify-center">
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setStartTime(new Date());
              setStart("Just Now");
            }}
          >
            <Image
              source={require("@/assets/images/started-ended-screen/Just Now.png")}
              className="h-[70px] w-[70px] rounded-lg"
              resizeMode="contain"
            />
            <Text className="max-w-16 text-center text-[#00748D] font-semibold">
              Just Now
            </Text>
            {start === "Just Now" && (
              <View
                className="w-[68px] h-[68px] top-[1px] border-orange-400 border-4  rounded-full flex absolute shadow-black shadow-2xl"
                style={{
                  borderRadius: 50,
                  shadowColor: "orange",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setStartTime(new Date(new Date().getTime() - 15 * 60 * 1000));
              setStart("15 min Ago");
            }}
          >
            <Image
              source={require("@/assets/images/started-ended-screen/15 min Ago.png")}
              className="h-[70px] w-[70px] rounded-lg"
              resizeMode="contain"
            />
            <Text className="max-w-16 text-center text-[#00748D] font-semibold">
              15 min Ago
            </Text>
            {start === "15 min Ago" && (
              <View
                className="w-[68px] h-[68px] top-[1px] border-orange-400 border-4  rounded-full flex absolute shadow-black shadow-2xl"
                style={{
                  borderRadius: 50,
                  shadowColor: "orange",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setStartTime(new Date(new Date().getTime() - 30 * 60 * 1000));
              setStart("30 min Ago");
            }}
          >
            <Image
              source={require("@/assets/images/started-ended-screen/30 min Ago.png")}
              className="h-[70px] w-[70px] rounded-lg"
              resizeMode="contain"
            />
            <Text className="max-w-16 text-center text-[#00748D] font-semibold">
              30 min Ago
            </Text>
            {start === "30 min Ago" && (
              <View
                className="w-[68px] h-[68px] top-[1px] border-orange-400 border-4  rounded-full flex absolute shadow-black shadow-2xl"
                style={{
                  borderRadius: 50,
                  shadowColor: "orange",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setStartTime(new Date(new Date().getTime() - 60 * 60 * 1000));
              setStart("1 hour Ago");
            }}
          >
            <Image
              source={require("@/assets/images/started-ended-screen/1 hour Ago.png")}
              className="h-[70px] w-[70px] rounded-lg"
              resizeMode="contain"
            />
            <Text className="max-w-16 text-center text-[#00748D] font-semibold">
              1 hour Ago
            </Text>
            {start === "1 hour Ago" && (
              <View
                className="w-[68px] h-[68px] top-[1px] border-orange-400 border-4  rounded-full flex absolute shadow-black shadow-2xl"
                style={{
                  borderRadius: 50,
                  shadowColor: "orange",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setCurrent("startDate");
              showDatePicker();
              setStart("Other Time");
            }}
          >
            <Image
              source={require("@/assets/images/started-ended-screen/Other Time.png")}
              className="h-[70px] w-[70px] rounded-lg"
              resizeMode="contain"
            />
            <Text className="max-w-16 text-center text-[#00748D] font-semibold">
              Other Time
            </Text>
            {start === "Other Time" && (
              <View
                className="w-[68px] h-[68px] top-[1px] border-orange-400 border-4  rounded-full flex absolute shadow-black shadow-2xl"
                style={{
                  borderRadius: 50,
                  shadowColor: "orange",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <LinearGradient
        colors={["#F59A6E", "#FFCE4E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className=" top-0 left-0 w-full mt-20 flex items-center justify-center"
        style={{ height: 80 }} // ensure height is applied
      >
        <Text className="text-2xl font-semibold text-[#015866]">
          Do you know when it ended?
        </Text>
      </LinearGradient>
      <View className="pt-6">
        <View className="flex flex-row w-full justify-between px-5 items-center">
          <View className="flex flex-row items-center gap-2">
            <Clock5 color={"#00748D"} height={30} width={30} />
            <Text className="text-lg max-w-14 font-semibold text-[#00748D]">
              End Time
            </Text>
          </View>
          <Text className="text-[#00748D] font-semibold">
            {endTime && endTime instanceof Date
              ? format(endTime, "dd/MM/yy")
              : endTime === "Not yet Finished"
              ? "Not yet Finished"
              : ""}
          </Text>
          <Text className="font-semibold text-[#00748D]">
            {endTime && endTime instanceof Date
              ? format(endTime, "hh:mm a")
              : endTime === "Not yet Finished"
              ? ""
              : ""}
          </Text>
        </View>
        <View className="my-3 w-full border border-black" />
        <View className="flex flex-row w-full justify-center">
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setEndTime("Not yet Finished");
              setEnd("Not yet Finished");
            }}
          >
            <Image
              source={require("@/assets/images/started-ended-screen/Not yet Finished.png")}
              className="h-[70px] w-[70px] rounded-lg"
              resizeMode="contain"
            />
            <Text className="max-w-16 text-center text-[#00748D] font-semibold">
              Not yet Finished
            </Text>
            {end === "Not yet Finished" && (
              <View
                className="w-[68px] h-[68px] top-[1px] border-orange-400 border-4  rounded-full flex absolute "
                style={{
                  borderRadius: 50,
                  shadowColor: "orange",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setEndTime(new Date());
              setEnd("Just Now");
            }}
          >
            <Image
              source={require("@/assets/images/started-ended-screen/Just Now.png")}
              className="h-[70px] w-[70px] rounded-lg"
              resizeMode="contain"
            />
            <Text className="max-w-16 text-center text-[#00748D] font-semibold">
              Just Now
            </Text>
            {end === "Just Now" && (
              <View
                className="w-[68px] h-[68px] top-[1px] border-orange-400 border-4  rounded-full flex absolute "
                style={{
                  borderRadius: 50,
                  shadowColor: "orange",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setEndTime(new Date(new Date().getTime() - 15 * 60 * 1000));
              setEnd("15 min Ago");
            }}
          >
            <Image
              source={require("@/assets/images/started-ended-screen/15 min Ago.png")}
              className="h-[70px] w-[70px] rounded-lg"
              resizeMode="contain"
            />
            <Text className="max-w-16 text-center text-[#00748D] font-semibold">
              15 min Ago
            </Text>
            {end === "15 min Ago" && (
              <View
                className="w-[68px] h-[68px] top-[1px] border-orange-400 border-4  rounded-full flex absolute "
                style={{
                  borderRadius: 50,
                  shadowColor: "orange",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setEndTime(new Date(new Date().getTime() - 30 * 60 * 1000));
              setEnd("30 min Ago");
            }}
          >
            <Image
              source={require("@/assets/images/started-ended-screen/30 min Ago.png")}
              className="h-[70px] w-[70px] rounded-lg"
              resizeMode="contain"
            />
            <Text className="max-w-16 text-center text-[#00748D] font-semibold">
              30 min Ago
            </Text>
            {end === "30 min Ago" && (
              <View
                className="w-[68px] h-[68px] top-[1px] border-orange-400 border-4  rounded-full flex absolute "
                style={{
                  borderRadius: 50,
                  shadowColor: "orange",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                }}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setCurrent("endDate");
              showDatePicker();
              setEnd("Other Time");
            }}
          >
            <Image
              source={require("@/assets/images/started-ended-screen/Other Time.png")}
              className="h-[70px] w-[70px] rounded-lg"
              resizeMode="contain"
            />
            <Text className="max-w-16 text-center text-[#00748D] font-semibold">
              Other Time
            </Text>
            {end === "Other Time" && (
              <View
                className="w-[68px] h-[68px] top-[1px] border-orange-400 border-4  rounded-full flex absolute "
                style={{
                  borderRadius: 50,
                  shadowColor: "orange",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 1,
                  shadowRadius: 10,
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {showDateTimePicker && (
        <DateTimePicker
          value={
            current === "startDate"
              ? startTime instanceof Date
                ? startTime
                : new Date()
              : endTime instanceof Date
              ? endTime
              : new Date(Date.now())
          }
          maximumDate={new Date(Date.now())}
          mode={mode as any}
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={onDateChange}
        />
      )}
    </SafeAreaView>
  );
};

export default StartedEndedComponent;
