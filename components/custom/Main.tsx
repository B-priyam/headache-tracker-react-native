import { View, Text, Image, ImageBackground } from "react-native";
import React, { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { differenceInDays, parseISO } from "date-fns";

const Main = ({ lastDate }: { lastDate: Date }) => {
  const { name, gender } = useUserStore();
  const numberOfDays = lastDate
    ? differenceInDays(new Date(), parseISO(new Date(lastDate).toISOString()))
    : 0;
  return (
    <SafeAreaView className="h-full w-full items-center py-16 flex gap-10">
      <View className="w-full flex items-center justify-center">
        <Image
          source={
            gender === "male"
              ? require("@/assets/icons/male-circle.png")
              : require("@/assets/icons/female-circle.png")
          }
          className="w-64 h-64"
        />
      </View>
      <View className="w-full flex items-center justify-center px-5 gap-8">
        <ImageBackground
          source={require("@/assets/images/text-patch.png")}
          resizeMode="contain"
          className="items-center aspect-[910/163] justify-center w-full "
        >
          <Text className="text-[#297F80] font-semibold text-xl px-6 text-center">
            You have been headache free for {numberOfDays ?? 1} days
          </Text>
        </ImageBackground>
        <ImageBackground
          source={require("@/assets/images/text-patch.png")}
          resizeMode="contain"
          className="items-center aspect-[910/163] w-full justify-center"
        >
          <Text className="text-[#297F80] font-semibold text-xl px-7 text-center">
            Wishing you a great day !!
          </Text>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default Main;
