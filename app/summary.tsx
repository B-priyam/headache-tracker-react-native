import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react-native";
import SummaryCard from "@/components/custom/SummaryCard";
import { summaryCard } from "@/constants/imageNames";
import { useGlobal } from "@/store/useQuestions";
import { useLocalSearchParams } from "expo-router";
import { differenceInHours, differenceInMinutes, format } from "date-fns";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const summary = () => {
  const { data } = useLocalSearchParams();
  const parsedData = data ? JSON.parse(data as string) : null;

  const [containerHeight, setContainerHeight] = useState<number>(0);
  const [accordianField, setAccordianField] = useState("");
  const startTime = parsedData.startTime;
  const endTime = parsedData.endTime;

  const getData = (fieldName: string) => {
    switch (fieldName) {
      case "region":
        return parsedData.region.join(", ").replaceAll("-", " ");
      case "triggers":
        return parsedData.triggers.join(", ").replaceAll("-", " ");
      case "severity":
        return parsedData.severity;
      case "symptoms":
        return parsedData.symptoms.join(", ").replaceAll("-", " ");
      case "selectedSense":
        return parsedData.sensations.join(", ").replaceAll("-", " ");
      case "relieve":
        return parsedData.relievers.join(", ").replaceAll("-", " ");
      case "medicine":
        return parsedData.medicines.length > 0
          ? parsedData.medicines.join(", ").replaceAll("-", " ")
          : "NO";
      case "relievedMedicine":
        return !parsedData.relieveAfterMedicine
          ? "No Medicine Taken"
          : parsedData.relieveAfterMedicine;
      case "recurrence":
        return parsedData.recurrence;
      default:
        break;
    }
  };

  return (
    <SafeAreaView
      className="flex-1 bg-gray-100"
      onLayout={(e) => {
        setContainerHeight(e.nativeEvent.layout.height - 120);
      }}
    >
      <LinearGradient
        colors={["#F59A6E", "#FFCE4E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="absolute top-0 left-0 w-full"
        style={{
          height: 160,
        }}
      />
      <View className="items-center justify-center flex -mt-5">
        <Text className="text-[#00748D] font-semibold text-2xl px-6 text-center my-4 border-[#00748D] p-2 w-40 rounded-xl border">
          {"Summary"}
        </Text>
        <View className="flex flex-row items-center gap-2 -mt-2">
          <Calendar color={"#00748D"} />
          <Text className="text-[#00748D] font-semibold">DURATION</Text>
        </View>
        <Text className="text-[#00748D] font-semibold">
          {(() => {
            const end = endTime instanceof Date ? endTime : new Date();
            const start = new Date(startTime);

            const hours = differenceInHours(end, start);
            const minutes = differenceInMinutes(end, start) % 60;

            return `${hours}H : ${minutes}M`;
          })()}
        </Text>
        <View className="flex flex-row gap-20">
          <View className="bg-white rounded-xl px-7 items-center">
            <Text className="text-[#00748D] font-semibold">START TIME</Text>
            <Text className="font-semibold">
              {startTime ? format(new Date(startTime), "hh:mm:a") : "--:--"}
            </Text>
            <Text>
              {startTime ? format(new Date(startTime), "dd/MM/yy") : "--/--/--"}
            </Text>
          </View>
          <View className="bg-white rounded-xl px-7">
            <Text className="text-[#00748D] font-semibold">END TIME</Text>
            <Text className="font-semibold">
              {endTime
                ? format(
                    endTime instanceof Date ? endTime : new Date(),
                    "hh:mm:a"
                  )
                : "--:--"}
            </Text>
            <Text>
              {endTime
                ? format(
                    endTime instanceof Date ? endTime : new Date(),
                    "dd/MM/yy"
                  )
                : "--/--/--"}
            </Text>
          </View>
        </View>
      </View>
      <View className="px-2">
        {summaryCard.map(({ fieldName, src, text, dataKey }) => {
          const data = getData(dataKey);
          return (
            <SummaryCard
              key={fieldName}
              activeField={accordianField}
              containerHeight={containerHeight - 10}
              currentField={fieldName}
              data={data}
              img={src}
              setActiveField={setAccordianField}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default summary;
