import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { Bird } from "lucide-react-native";
import {
  differenceInHours,
  differenceInMinutes,
  format,
  parseISO,
} from "date-fns";
import { useRouter } from "expo-router";

const MyRecords = (data: any) => {
  const severity: Record<string, number> = {
    "Worst Possible Pain": 5,
    "Very Severe Pain": 4,
    "Severe Pain": 3,
    "Moderate Pain": 2,
    "Mild Pain": 1,
  };

  const router = useRouter();
  return (
    <ScrollView className="flex h-full w-full">
      <View className="bg-[#47C5D3] flex justify-between flex-row w-full px-2 py-1">
        <Text className="w-8"></Text>
        <Text className="text-white font-semibold text-lg">Date</Text>
        <Text className="text-white font-semibold text-lg">Severity</Text>
        <Text className="text-white font-semibold text-lg">Duration</Text>
      </View>
      <View className="py-1">
        {data.data.data && data.data.data.length > 0 ? (
          data.data.data.map((d: any, index: number) => (
            <View className="px-2" key={index}>
              <TouchableOpacity
                className="py-2 items-center flex justify-between flex-row w-full px-2 "
                key={index}
                onPress={() =>
                  router.push({
                    pathname: "/summary",
                    params: { data: JSON.stringify(d) },
                  })
                }
              >
                <Image
                  source={require("@/assets/icons/birds-blue.png")}
                  className="w-10 h-10"
                  resizeMode="contain"
                />
                <Text className="text-center w-1/4">
                  {format(new Date(d.timestamp), "dd/MM/yy")}
                </Text>
                <Text className="text-center w-1/4">
                  {severity[d.severity]}/5
                </Text>
                {d.endTime === "present" ? (
                  <Text>Not Finished</Text>
                ) : (
                  <Text className="text-center w-1/4">
                    {(() => {
                      // console.log(d);
                      const end = new Date(d.endTime);
                      const start = new Date(d.startTime);
                      const hours = differenceInHours(end, start);
                      const minutes = differenceInMinutes(end, start) % 60;
                      return `${hours}H : ${minutes}M`;
                    })()}
                  </Text>
                )}
              </TouchableOpacity>
              <View className="border border-gray-400 px-2" />
            </View>
          ))
        ) : (
          <View className="flex-1 items-center justify-center h-[60vh]">
            <Text className="font-bold text-2xl text-gray-600">
              No Records Found
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default MyRecords;
