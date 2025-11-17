import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { useGlobal } from "@/store/useQuestions";

const severity = () => {
  const { severity, setSeverity } = useGlobal();
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState(0);
  return (
    <View
      className="flex-1 bg-gray-100"
      onLayout={(e) => {
        setContainerHeight(e.nativeEvent.layout.height);
        setContainerWidth(e.nativeEvent.layout.width);
      }}
    >
      <View
        style={{
          height: containerHeight ? containerHeight - 80 : "auto",
        }}
      >
        <TouchableOpacity
          className={`flex flex-row w-full ${
            severity === "Worst Possible Pain"
              ? "bg-[#A91919]"
              : "bg-transparent"
          }`}
          style={{
            minHeight: (containerHeight - 80) / 5,
            maxHeight: (containerHeight - 80) / 5,
          }}
          onPress={() => setSeverity("Worst Possible Pain")}
        >
          <View className="bg-[#A91919] w-28 flex items-center justify-center">
            <Text className="text-white text-3xl">5</Text>
          </View>
          <View className="flex items-center justify-center">
            <Text
              className={`px-5 ${
                severity === "Worst Possible Pain"
                  ? "text-white"
                  : "text-[#00748D]"
              } font-bold max-w-36 text-center`}
            >
              Worst Possible Pain
            </Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/severity/Worst Possible Pain.png")} // foreground logo
              className="h-[130px] w-[130px] rounded-lg"
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            minHeight: (containerHeight - 80) / 5,
            maxHeight: (containerHeight - 80) / 5,
          }}
          className={`flex flex-row w-full ${
            severity === "Very Severe Pain" ? "bg-[#EB3A2A]" : "bg-transparent"
          }`}
          onPress={() => setSeverity("Very Severe Pain")}
        >
          <View className="bg-[#EB3A2A] w-28 flex items-center justify-center">
            <Text className="text-white text-3xl">5</Text>
          </View>
          <View className="flex items-center justify-center">
            <Text
              className={`px-5 ${
                severity === "Very Severe Pain"
                  ? "text-white"
                  : "text-[#00748D]"
              } font-bold max-w-36 text-center min-w-36`}
            >
              Very Severe Pain
            </Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/severity/Very Severe Pain.png")} // foreground logo
              className="h-[130px] w-[130px] rounded-lg"
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            minHeight: (containerHeight - 80) / 5,
            maxHeight: (containerHeight - 80) / 5,
          }}
          className={`flex flex-row w-full ${
            severity === "Severe Pain" ? "bg-[#FF9700]" : "bg-transparent"
          }`}
          onPress={() => setSeverity("Severe Pain")}
        >
          <View className="bg-[#FF9700] w-28 flex items-center justify-center">
            <Text className="text-white text-3xl">5</Text>
          </View>
          <View className="flex items-center justify-center">
            <Text
              className={`px-5 ${
                severity === "Severe Pain" ? "text-white" : "text-[#00748D]"
              } font-bold max-w-36 text-center min-w-36`}
            >
              Severe Pain
            </Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/severity/Severe Pain.png")} // foreground logo
              className="h-[130px] w-[130px] rounded-lg"
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            minHeight: (containerHeight - 80) / 5,
            maxHeight: (containerHeight - 80) / 5,
          }}
          className={`flex flex-row w-full ${
            severity === "Moderate Pain" ? "bg-[#FDD154]" : "bg-transparent"
          }`}
          onPress={() => setSeverity("Moderate Pain")}
        >
          <View className="bg-[#FDD154] w-28 flex items-center justify-center">
            <Text className="text-white text-3xl">5</Text>
          </View>
          <View className="flex items-center justify-center">
            <Text
              className={`px-5 ${
                severity === "Moderate Pain" ? "text-white" : "text-[#00748D]"
              } font-bold max-w-36 text-center min-w-36`}
            >
              Moderate Pain
            </Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/severity/Moderate Pain.png")} // foreground logo
              className="h-[130px] w-[130px] rounded-lg"
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            minHeight: (containerHeight - 80) / 5,
            maxHeight: (containerHeight - 80) / 5,
          }}
          className={`flex flex-row w-full ${
            severity === "Mild Pain" ? "bg-[#4FC854]" : "bg-transparent"
          }`}
          onPress={() => setSeverity("Mild Pain")}
        >
          <View className="bg-[#4FC854] w-28 flex items-center justify-center">
            <Text className="text-white text-3xl">5</Text>
          </View>
          <View className="flex items-center justify-center">
            <Text
              className={`px-5 ${
                severity === "Mild Pain" ? "text-white" : "text-[#00748D]"
              } font-bold max-w-36 text-center min-w-36`}
            >
              Mild Pain
            </Text>
          </View>
          <View>
            <Image
              source={require("@/assets/images/severity/Mild Pain.png")} // foreground logo
              className="h-[130px] w-[130px] rounded-lg"
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default severity;
