import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Clock5 } from "lucide-react-native";
import { format } from "date-fns";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobal } from "@/store/useQuestions";

const startedEnded = () => {
  //   const [startTime, setStartTime] = useState(new Date());
  //   const [endTime, setEndTime] = useState<Date | string>(new Date());
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [mode, setMode] = useState("date");
  const [current, setCurrent] = useState("");

  const { endTime, setEndTime, setStartTime, startTime } = useGlobal();

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) return;

    if (current === "startDate") setStartTime(selectedDate);
    else if (current === "endDate") setEndTime(selectedDate);

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

  const showDatePicker = () => {
    setMode("date");
    setShowDateTimePicker(true);
  };
  return (
    <SafeAreaView>
      <View>
        <View className="flex flex-row w-full justify-between px-5 items-center">
          <View className="flex flex-row items-center gap-2">
            <Clock5 color={"#00748D"} height={30} width={30} />
            <Text className="text-lg max-w-14 font-semibold text-[#00748D]">
              Start Time
            </Text>
          </View>
          <Text className="text-[#00748D] font-semibold">
            {format(startTime, "dd/MM/yy")}
          </Text>
          <Text className="font-semibold text-[#00748D]">
            {format(startTime, "hh:mm a")}
          </Text>
        </View>
        <View className="my-2 w-full border border-black" />
        <View className="flex flex-row w-full justify-center">
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => setStartTime(new Date())}
          >
            <Image
              source={require("@/assets/images/started-ended-screen/Just Now.png")}
              className="h-[70px] w-[70px] rounded-lg"
              resizeMode="contain"
            />
            <Text className="max-w-16 text-center text-[#00748D] font-semibold">
              Just Now
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setStartTime(new Date(new Date().getTime() - 15 * 60 * 1000));
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
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setStartTime(new Date(new Date().getTime() - 30 * 60 * 1000));
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
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setStartTime(new Date(new Date().getTime() - 60 * 60 * 1000));
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
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setCurrent("startDate");
              showDatePicker();
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
            {endTime instanceof Date ? format(endTime, "dd/MM/yy") : "Present"}
          </Text>
          <Text className="font-semibold text-[#00748D]">
            {endTime instanceof Date ? format(endTime, "hh:mm a") : "Present"}
          </Text>
        </View>
        <View className="my-3 w-full border border-black" />
        <View className="flex flex-row w-full justify-center">
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => setEndTime("present")}
          >
            <Image
              source={require("@/assets/images/started-ended-screen/Not yet Finished.png")}
              className="h-[70px] w-[70px] rounded-lg"
              resizeMode="contain"
            />
            <Text className="max-w-16 text-center text-[#00748D] font-semibold">
              Not yet Finished
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => setEndTime(new Date())}
          >
            <Image
              source={require("@/assets/images/started-ended-screen/Just Now.png")}
              className="h-[70px] w-[70px] rounded-lg"
              resizeMode="contain"
            />
            <Text className="max-w-16 text-center text-[#00748D] font-semibold">
              Just Now
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setEndTime(new Date(new Date().getTime() - 15 * 60 * 1000));
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
          </TouchableOpacity>
          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setEndTime(new Date(new Date().getTime() - 30 * 60 * 1000));
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
          </TouchableOpacity>

          <TouchableOpacity
            className="flex flex-col items-center"
            onPress={() => {
              setCurrent("endDate");
              showDatePicker();
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
          </TouchableOpacity>
        </View>
      </View>
      {showDateTimePicker && (
        <DateTimePicker
          value={current === "startDate" ? startTime : (endTime as Date)}
          mode={mode as any}
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={onDateChange}
        />
      )}
    </SafeAreaView>
  );
};

export default startedEnded;
