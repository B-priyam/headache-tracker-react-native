import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { senseHeadacheImages } from "@/constants/imageNames";
import TextIcon from "@/components/custom/TextIcon";
import { useGlobal } from "@/store/useQuestions";
import { SafeAreaView } from "react-native-safe-area-context";

const SenseComponent = () => {
  const { selectedSense, setSelectedSense } = useGlobal();
  return (
    <SafeAreaView className="flex-1 bg-gray-100 mb-[80px]">
      <View className="flex flex-row flex-wrap h-full items-center justify-center gap-x-5">
        {senseHeadacheImages.map(({ name, src }) => (
          <TextIcon
            key={name}
            data={name}
            name={selectedSense}
            setData={setSelectedSense}
            img={src}
            imgsize={100}
            overLaySize={94}
            overLayTop={3}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default SenseComponent;
