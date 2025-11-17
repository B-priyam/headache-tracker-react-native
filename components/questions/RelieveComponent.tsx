import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { relieveImages } from "@/constants/imageNames";
import TextIcon from "@/components/custom/TextIcon";
import { useGlobal } from "@/store/useQuestions";

const RelieveComponent = () => {
  const { relieve, setRelieve } = useGlobal();

  return (
    <View className="flex-1 bg-gray-100 mb-[80px]">
      <View className="flex flex-row flex-wrap h-full items-center justify-center gap-x-5">
        {relieveImages.map(({ name, src }) => (
          <TextIcon
            key={name}
            data={name}
            name={relieve}
            setData={setRelieve}
            img={src}
            imgsize={100}
            overLaySize={90}
            overLayTop={5}
          />
        ))}
      </View>
    </View>
  );
};

export default RelieveComponent;
