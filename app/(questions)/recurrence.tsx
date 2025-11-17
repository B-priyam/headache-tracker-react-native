import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useGlobal } from "@/store/useQuestions";

const recurrence = () => {
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [isRecurrence, setIsRecurrence] = useState("");
  const { setRecurrence } = useGlobal();

  useEffect(() => {
    setRecurrence(isRecurrence);
  }, [isRecurrence]);
  return (
    <View
      className="flex-1 bg-gray-100"
      onLayout={(e) => {
        setContainerHeight(e.nativeEvent.layout.height);
      }}
    >
      <View
        style={{
          height: containerHeight ? containerHeight - 80 : "auto",
        }}
        className="flex items-center px-5 pt-20 gap-10"
      >
        <Image
          source={require("@/assets/images/Screen_10.png")}
          className="w-[200px] h-[200px]"
          resizeMode="contain"
        />
        <View className="flex flex-row gap-5 mr-5">
          <TouchableOpacity
            onPress={() => setIsRecurrence("Yes")}
            className="w-1/2 border-2 rounded-full border-[#00748D] p-2"
            style={{
              backgroundColor:
                isRecurrence === "Yes" ? "#00748D" : "transparent",
            }}
          >
            <Text
              className="text-[#00748D] text-center font-semibold text-xl"
              style={{
                color: isRecurrence === "Yes" ? "#fff" : "#00748D",
              }}
            >
              YES
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsRecurrence("No")}
            className="rounded-full w-1/2  border-2 border-[#00748D] p-2"
            style={{
              backgroundColor:
                isRecurrence === "No" ? "#00748D" : "transparent",
            }}
          >
            <Text
              className="text-[#00748D] text-center font-semibold text-xl"
              style={{
                color: isRecurrence === "No" ? "#fff" : "#00748D",
              }}
            >
              NO
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default recurrence;
