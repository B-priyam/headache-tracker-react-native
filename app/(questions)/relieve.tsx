import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { relieveImages } from "@/constants/imageNames";
import TextIcon from "@/components/custom/TextIcon";
import { useGlobal } from "@/store/useQuestions";

const relieve = () => {
  const { relieve, setRelieve } = useGlobal();
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  const totalImages = relieveImages.length;

  useEffect(() => {
    if (loadedCount === totalImages) {
      setAllImagesLoaded(true);
    }
  }, [loadedCount, totalImages]);

  const handleImageLoad = () => {
    setLoadedCount((prev) => prev + 1);
  };
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
          {relieveImages.map(({ name, src }) => (
            <TextIcon
              key={name}
              data={name}
              name={relieve}
              setData={setRelieve}
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

export default relieve;
