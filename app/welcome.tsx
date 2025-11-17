import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Asset } from "expo-asset";

export default function App() {
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function preloadAssets() {
      await Asset.loadAsync([
        require("../assets/images/background.png"),
        require("../assets/images/logo.png"),
      ]);
    }
    preloadAssets();
  }, []);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: -200, // move logo up
      duration: 1000,
      useNativeDriver: true,
    }).start();
    Animated.timing(scale, {
      toValue: 1.5,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/background.png")} // background image
      className="flex-1"
      resizeMode="cover"
    >
      <SafeAreaView className="flex-1 items-center justify-center">
        <Animated.View style={{ transform: [{ translateY }] }}>
          <Image
            source={require("../assets/images/logo.png")} // foreground logo
            className="h-[150px] w-[150px]"
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.View
          style={{ transform: [{ scale }, { translateY: -70 }] }}
          className={"flex flex-col gap-3 items-center"}
        >
          <Text className="mb-10 font-bold text-blue-700 text-xl font-inter">
            WELCOME
          </Text>
          <TouchableOpacity
            className="border-2 rounded-full border-blue-500 p-1.5 min-w-36 items-center"
            onPress={() => router.push("/login")}
          >
            <Text className="text-blue-600">LOG IN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="border-2 rounded-full border-blue-500 p-1.5 min-w-36 items-center"
            onPress={() => router.push("/signUp")}
          >
            <Text className="text-blue-600">SIGN UP</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}
