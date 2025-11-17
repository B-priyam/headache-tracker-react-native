import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const page = () => {
  const { username,password } = useLocalSearchParams();
  return (
    <View>
      <Text>Hello Mr.{username}</Text>
    </View>
  );
};

export default page;
