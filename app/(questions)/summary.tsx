import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import SummaryCard from "@/components/custom/SummaryCard";
import { summaryCard } from "@/constants/imageNames";
import { useGlobal } from "@/store/useQuestions";
import { useLocalSearchParams } from "expo-router";

const summary = () => {
  const { data } = useLocalSearchParams();
  const parsedData = data ? JSON.parse(data) : null;

  console.log(parsedData);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [accordianField, setAccordianField] = useState("");

  // const getData = (fieldName: string) => {
  //   switch (fieldName) {
  //     case "region":
  //       return region.join(", ").replaceAll("-", " ");
  //     case "triggers":
  //       return triggers.join(", ").replaceAll("-", " ");
  //     case "severity":
  //       return severity;
  //     case "symptoms":
  //       return symptoms.join(", ").replaceAll("-", " ");
  //     case "selectedSense":
  //       return selectedSense.join(", ").replaceAll("-", " ");
  //     case "relieve":
  //       return relieve.join(", ").replaceAll("-", " ");
  //     case "medicine":
  //       return medicine === "Yes"
  //         ? medicinesList.join(", ").replaceAll("-", " ")
  //         : "NO";
  //     case "relievedMedicine":
  //       return relievedMedicine;
  //     case "recurrence":
  //       return recurrence;
  //     default:
  //       break;
  //   }
  // };

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
        className="px-2 max-w-[96%]"
      >
        {/* {summaryCard.map(({ fieldName, src, text, dataKey }) => {
          const data = getData(dataKey);
          return (
            <SummaryCard
              key={fieldName}
              activeField={accordianField}
              containerHeight={containerHeight}
              currentField={fieldName}
              data={data}
              img={src}
              setActiveField={setAccordianField}
            />
          );
        })} */}
      </View>
    </View>
  );
};

export default summary;
