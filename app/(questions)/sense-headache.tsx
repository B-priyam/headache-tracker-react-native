import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { senseHeadacheImages } from "@/constants/imageNames";
import TextIcon from "@/components/custom/TextIcon";
import { useGlobal } from "@/store/useQuestions";

const senseHeadache = () => {
  const { selectedSense, setSelectedSense } = useGlobal();
  const [containerHeight, setContainerHeight] = useState<number>(0);
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
      >
        <View className="flex flex-row flex-wrap h-full mt-2 items-center justify-center gap-x-5">
          {senseHeadacheImages.map(({ name, src }) => (
            <TextIcon
              key={name}
              data={name}
              name={selectedSense}
              setData={setSelectedSense}
              img={src}
              imgsize={100}
              overLaySize={87}
              overLayTop={7}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default senseHeadache;
