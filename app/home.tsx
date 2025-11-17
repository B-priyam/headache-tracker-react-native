import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import { MenuIcon } from "lucide-react-native";
import {
  useFonts,
  Nunito_600SemiBold,
  Nunito_500Medium,
} from "@expo-google-fonts/nunito";
import Report from "@/components/custom/temp";
import MyRecords from "@/components/custom/MyRecords";
import { useUserStore } from "@/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppDrawer } from "@/components/custom/Drawer";
import Main from "@/components/custom/Main";
import DailyTracker from "@/components/custom/dailyTracker";

const Home = () => {
  const [allData, setAllData] = useState<any[]>([]);
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState<
    "Daily Tracker" | "Report" | "My Records" | ""
  >("");
  const [showDrawer, setShowDrawer] = useState(false);
  const {
    name,
    gender,
    createdAt,
    setCreatedAt,
    setEmail,
    setGender,
    setName,
  } = useUserStore();
  const [lastDate, setLastDate] = useState<Date>();

  const [fontsLoaded] = useFonts({
    Nunito_600SemiBold,
    Nunito_500Medium,
  });

  useEffect(() => {
    const tokenExists = async () => {
      const token = await SecureStore.getItemAsync("AccessToken");
      if (!token) {
        router.replace("/login");
      }
      setToken(token || "");
    };
    tokenExists();
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      const res = await fetch(
        "http://192.168.1.15:3000/api/questions/getQuestions",
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      let tempDate: any;

      if (data?.data?.length) {
        data.data.forEach((item: any) => {
          if (!tempDate || item.timestamp >= tempDate) {
            tempDate = item.timestamp;
          }
        });
      }
      if (!tempDate) {
        tempDate = createdAt!;
      }
      setLastDate(tempDate);
      setAllData(data);
    };
    fetchAllData();
  }, [token]);

  if (!fontsLoaded || !token) {
    return null; // or <LoadingScreen />
  }

  const logout = async () => {
    await SecureStore.deleteItemAsync("AccessToken");
    setName("");
    setGender("");
    setCreatedAt(null);
    setEmail("");
    router.replace("/login");
  };

  return (
    <>
      <SafeAreaView className="h-full w-full">
        <View className="bg-[#47C5D3] h-24 w-full flex flex-row items-center px-5 shadow-black drop-shadow-2xl justify-between">
          <View className="flex flex-row gap-5 items-center">
            <MenuIcon
              size={40}
              color={"white"}
              onPress={() => setShowDrawer(true)}
            />
            <Text
              className="text-2xl text-white"
              style={{ fontFamily: "Nunito_600SemiBold" }}
            >
              Free The Head
            </Text>
          </View>
          <View>
            <Image
              source={require("@/assets/icons/birds-icon.png")}
              className="h-10 w-14"
            />
          </View>
        </View>
        <View className="flex flex-row w-full justify-between h-16">
          <TouchableOpacity
            onPress={() => setActiveTab("Report")}
            className={`flex items-center justify-center  ${
              activeTab === "Report" ? "bg-[#297F80]" : "bg-[#97F2F7]"
            }
          w-1/3`}
          >
            <Text
              className={`${
                activeTab === "Report" ? "text-white" : "text-[#297F80]"
              }  text-xl font-semibold`}
            >
              Report
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("Daily Tracker")}
            className={`flex items-center justify-center  ${
              activeTab === "Daily Tracker" ? "bg-[#297F80]" : "bg-[#97F2F7]"
            }
          w-1/3`}
          >
            <Text
              className={`${
                activeTab === "Daily Tracker" ? "text-white" : "text-[#297F80]"
              }  text-xl font-semibold`}
            >
              Daily Tracker
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("My Records")}
            className={`flex items-center justify-center  ${
              activeTab === "My Records" ? "bg-[#297F80]" : "bg-[#97F2F7]"
            }
          w-1/3`}
          >
            <Text
              className={`${
                activeTab === "My Records" ? "text-white" : "text-[#297F80]"
              }  text-xl font-semibold`}
            >
              My Records
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          {activeTab === "Report" ? (
            <Report data={allData} />
          ) : activeTab === "My Records" ? (
            <MyRecords data={allData} />
          ) : activeTab === "Daily Tracker" ? (
            <DailyTracker data={allData} />
          ) : (
            <Main lastDate={lastDate!} />
          )}
        </View>
        <View className="flex flex-row w-full">
          <TouchableOpacity
            onPress={() => setActiveTab("")}
            className="bg-[#00B8BA] h-20 flex items-center justify-center"
            style={{
              width: activeTab ? "50%" : 0,
            }}
          >
            <Text className="text-xl font-semibold text-gray-200 ">HOME</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/questions")}
            className="bg-[#00B8BA] h-20 flex items-center justify-center border-l"
            style={{
              width: activeTab ? "50%" : "100%",
            }}
          >
            <Text className="text-xl font-semibold text-gray-200 ">
              RECORD AN ATTACK
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <AppDrawer
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        logout={logout}
      />
    </>
  );
};

export default Home;
