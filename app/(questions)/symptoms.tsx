import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import TextIcon from "@/components/custom/TextIcon";
import { symptomImages } from "@/constants/imageNames";
import { useGlobal } from "@/store/useQuestions";

const synptoms = () => {
  const { symptoms, setSymptoms } = useGlobal();
  const [containerHeight, setContainerHeight] = useState<number>(
    Dimensions.get("window").height
  );

  const [selectedSymptoms, setSelectedSymptoms] = useState(symptoms);

  useEffect(() => {
    setSymptoms(selectedSymptoms);
  }, [selectedSymptoms]);

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
        <View className="flex flex-row flex-wrap h-full items-center justify-center gap-x-10 mt-2">
          {symptomImages.map(({ name, src }) => (
            <TextIcon
              key={name}
              data={name}
              name={selectedSymptoms}
              setData={setSelectedSymptoms}
              img={src}
              imgsize={80}
              overLaySize={70}
              overLayTop={5}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default synptoms;
