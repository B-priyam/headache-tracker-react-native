import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { triggerImages } from "@/constants/imageNames";
import TextIcon from "@/components/custom/TextIcon";
import { useGlobal } from "@/store/useQuestions";

const TriggerComponent = () => {
  const { triggers, setTriggers } = useGlobal();
  return (
    <View className="flex-1 bg-gray-100 mb-[80px]">
      <View className="flex flex-row flex-wrap h-full items-center justify-center gap-x-5">
        {triggerImages.map(({ name, src }) => (
          <TextIcon
            key={name}
            data={name}
            name={triggers}
            setData={setTriggers}
            img={src}
            imgsize={105}
            overLaySize={96}
            overLayTop={4}
          />
        ))}
      </View>
    </View>
  );
};

export default TriggerComponent;
