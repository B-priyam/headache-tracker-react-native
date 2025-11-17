import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react-native";

interface SummaryCardProps {
  activeField: string;
  img: ImageSourcePropType;
  data: any;
  currentField: string;
  containerHeight: number;
  setActiveField: (data: any) => void;
}

const SummaryCard = ({
  activeField,
  containerHeight,
  img,
  setActiveField,
  data,
  currentField,
}: SummaryCardProps) => {
  return (
    <>
      <View className="border border-gray-500 px-10" />
      <TouchableOpacity
        className="flex flex-row gap-1 px-2"
        onPress={() =>
          currentField === activeField
            ? setActiveField("")
            : setActiveField(currentField)
        }
      >
        <Image
          source={img}
          style={{
            height: containerHeight && (containerHeight - 100) / 9,
            width: containerHeight && (containerHeight - 100) / 9,
          }}
          resizeMode="contain"
        />
        <View className="flex flex-col gap-2">
          <Text>{currentField}</Text>
          <View className="flex flex-row">
            <Text
              // numberOfLines={accordianField !== "AREA OF PAIN" ? 1 : 0}
              className="max-w-[70%] text-wrap w-full"
              style={{
                maxHeight: activeField !== currentField ? 20 : "auto",
              }}
            >
              {data}
            </Text>
            {data &&
              (activeField !== currentField ? <ChevronDown /> : <ChevronUp />)}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};

export default SummaryCard;
