import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { triggerImages } from "@/constants/imageNames";
import TextIcon from "@/components/custom/TextIcon";
import { useGlobal } from "@/store/useQuestions";

const triggers = () => {
  const { triggers, setTriggers } = useGlobal();
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
        <View className="flex flex-row flex-wrap h-full items-center justify-center gap-x-5">
          {triggerImages.map(({ name, src }) => (
            <TextIcon
              key={name}
              data={name}
              name={triggers}
              setData={setTriggers}
              img={src}
              imgsize={105}
              overLaySize={98}
              overLayTop={3}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default triggers;
