import { View, Text, Image, ImageBackground } from "react-native";
import React from "react";

const ReportLabel = ({ text, img }: { text: string; img?: any }) => {
  return (
    <View className="py-5">
      <ImageBackground
        source={require("@/assets/icons/Report-label-patch.png")}
        resizeMode="contain"
        className="items-center aspect-[910/163] justify-center w-full"
      >
        <Image
          source={img}
          className="w-9 h-9 absolute left-safe-or-[13.5px]"
          resizeMode="contain"
        />
        <View className="flex flex-row text-left px-10 ml-14">
          <Text className="text-white font-semibold text-xl px-6">{text}</Text>
          {text !== "Frequency" && (
            <Text className="text-white font-semibold text-xl px-6 text-center -ml-5">
              (Most Common)
            </Text>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

export default ReportLabel;
