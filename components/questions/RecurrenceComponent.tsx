import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobal } from "@/store/useQuestions";

const RecurrenceComponent = () => {
  const { recurrence, setRecurrence, endTime } = useGlobal();
  console.log(endTime);
  return (
    <View className="flex-1 bg-gray-100 mb-[80px] items-center px-5">
      <Image
        source={require("@/assets/images/Screen_10.png")}
        className="w-[200px] h-[200px] mt-10"
        resizeMode="contain"
      />
      <View className="flex flex-row gap-5 py-5">
        <TouchableOpacity
          onPress={() => setRecurrence("Yes")}
          className="w-1/2 border-2 rounded-full border-orange-400 p-2"
          style={{
            backgroundColor: recurrence === "Yes" ? "orange" : "transparent",
          }}
        >
          <Text
            className="text-[#00748D] text-center font-semibold text-xl"
            style={{
              color: recurrence === "Yes" ? "#fff" : "orange",
            }}
          >
            YES
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setRecurrence("No")}
          className="rounded-full w-1/2  border-2 border-orange-400 p-2"
          style={{
            backgroundColor: recurrence === "No" ? "orange" : "transparent",
          }}
        >
          <Text
            className="text-[#00748D] text-center font-semibold text-xl"
            style={{
              color: recurrence === "No" ? "#fff" : "orange",
            }}
          >
            NO
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RecurrenceComponent;
