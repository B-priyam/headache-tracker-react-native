import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useGlobal } from "@/store/useQuestions";
import DateTimePicker from "@react-native-community/datetimepicker";
import { formatDistanceToNow } from "date-fns";

const MedicineRelieve = () => {
  const { relievedMedicine, setRelievedMedicine } = useGlobal();
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  return (
    <View className="flex-1 bg-gray-100 justify-evenly mb-[80px]">
      <TouchableOpacity
        className="flex flex-row items-center justify-center bg-orange-300 py-2"
        onPress={() => setRelievedMedicine("15 min")}
        style={{
          backgroundColor:
            relievedMedicine === "15 min" ? "#fdba74" : "transparent",
        }}
      >
        <Text className="text-[#00748D] text-xl font-semibold">15 min</Text>
        <Image
          source={require("@/assets/images/started-ended-screen/15 min Ago.png")}
          className="w-[130px] h-[130px]"
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        className="flex flex-row items-center justify-center"
        onPress={() => setRelievedMedicine("30 min")}
        style={{
          backgroundColor:
            relievedMedicine === "30 min" ? "#fdba74" : "transparent",
        }}
      >
        <Text className="text-[#00748D] text-xl font-semibold">30 min</Text>
        <Image
          source={require("@/assets/images/started-ended-screen/30 min Ago.png")}
          className="w-[130px] h-[130px]"
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        className="flex flex-row items-center justify-center"
        onPress={() => setRelievedMedicine("1 hour")}
        style={{
          backgroundColor:
            relievedMedicine === "1 hour" ? "#fdba74" : "transparent",
        }}
      >
        <Text className="text-[#00748D] text-xl font-semibold">1 hour</Text>
        <Image
          source={require("@/assets/images/started-ended-screen/1 hour Ago.png")}
          className="w-[130px] h-[130px]"
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setShowDateTimePicker(true);
        }}
        className="flex flex-row items-center justify-center "
        style={{
          backgroundColor:
            relievedMedicine &&
            relievedMedicine !== "15 min" &&
            relievedMedicine !== "30 min" &&
            relievedMedicine !== "1 hour"
              ? "#fdba74"
              : "transparent",
        }}
      >
        <Text className="text-[#00748D] text-xl font-semibold max-w-20">
          {relievedMedicine &&
          relievedMedicine !== "30 min" &&
          relievedMedicine !== "15 min" &&
          relievedMedicine !== "1 hour"
            ? relievedMedicine
            : "Other Time"}
        </Text>
        <Image
          source={require("@/assets/images/started-ended-screen/Other Time.png")}
          className="w-[130px] h-[130px] -ml-2"
          resizeMode="contain"
        />
      </TouchableOpacity>
      {showDateTimePicker && (
        <DateTimePicker
          value={(() => {
            const match = relievedMedicine.match(/(\d+)\s*hour.*?(\d+)\s*min/i);
            const hours = match ? parseInt(match[1], 10) : 0;
            const minutes = match ? parseInt(match[2], 10) : 0;

            return new Date(new Date().setHours(hours, minutes, 0, 0));
          })()}
          mode="time"
          display="spinner"
          is24Hour={true}
          onChange={(event, selectedDate) => {
            if (event.type === "set" && selectedDate) {
              const hours = selectedDate.getHours();
              const minutes = selectedDate.getMinutes();

              setRelievedMedicine(
                `${hours.toString().padStart(2, "0")} hour${
                  hours !== 1 ? "s" : ""
                } ${minutes.toString().padStart(2, "0")} min${
                  minutes !== 1 ? "s" : ""
                }`
              );
            }
            setShowDateTimePicker(false);
          }}
        />
      )}
    </View>
  );
};

export default MedicineRelieve;
