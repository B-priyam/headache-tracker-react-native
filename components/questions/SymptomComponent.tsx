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

const SymptomComponent = () => {
  const { symptoms, setSymptoms } = useGlobal();
  const [selectedSymptoms, setSelectedSymptoms] = useState(symptoms);

  useEffect(() => {
    setSymptoms(selectedSymptoms);
  }, [selectedSymptoms]);

  return (
    <View className="flex-1 bg-gray-100 mb-[80px]">
      <View className="flex flex-row flex-wrap h-full items-center justify-center gap-x-10 mt-2">
        {symptomImages.map(({ name, src }) => (
          <TextIcon
            key={name}
            data={name}
            name={selectedSymptoms}
            setData={setSelectedSymptoms}
            img={src}
            imgsize={80}
            overLaySize={75}
            overLayTop={3}
          />
        ))}
      </View>
    </View>
  );
};

export default SymptomComponent;
