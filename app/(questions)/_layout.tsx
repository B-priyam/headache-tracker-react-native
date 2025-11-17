import React, { useEffect, useState } from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Calendar,
  ChevronRight,
  ChevronsRight,
  ClockPlus,
  Delete,
  Trash2,
} from "lucide-react-native";
import { useFocusEffect } from "expo-router";
import { BackHandler } from "react-native";
import { useCallback } from "react";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { Button, ButtonText } from "@/components/ui/button";
import { GlobalProvider, useGlobal } from "@/store/useQuestions";
import {
  format,
  differenceInHours,
  differenceInMinutes,
  parseISO,
} from "date-fns";

export default function Layout() {
  const screenTitles: Record<string, string> = {
    "/triggers": "Triggers",
    "/started-ended": "Do you know when it started?",
    "/severity": "Severity of pain",
    "/sense-headache": "Did you sense the headache coming?",
    "/symptoms": "Symptoms",
    "/relieve": "What did you do to relieve the headache?",
    "/select-region": "Highlight the area of Pain",
    "/medicines": "Are you taking any Precribed medicines?",
    "/relief-after-medicine": "In how much time headache was relieved?",
    "/recurrence": "Is there any recurrence of headache in 24 hours?",
    "/summary": "Summary",
  };

  const pathname = usePathname();
  const router = useRouter();
  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const handleClose = () => setShowAlertDialog(false);

  const paths = [
    "/select-region",
    "/started-ended",
    "/triggers",
    "/severity",
    "/sense-headache",
    "/symptoms",
    "/relieve",
    "/medicines",
    "/relief-after-medicine",
    "/recurrence",
    "/summary",
  ];
  const pathIndex = paths.indexOf(pathname);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        if (pathIndex > 0) router.push(paths[pathIndex - 1] as any);
        else setShowAlertDialog(true);
        return true;
      });
      return () => sub.remove();
    }, [pathIndex])
  );

  useEffect(() => {
    if (pathIndex < paths.length - 1)
      router.prefetch(paths[pathIndex + 1] as any);
  }, [pathIndex]);

  const text = screenTitles[pathname] || "Default";

  const { endTime, startTime } = useGlobal();

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#F59A6E", "#FFCE4E"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="absolute top-0 left-0 w-full "
        style={{ height: 150 }} // ensure height is applied
      />
      {pathname === "/summary" ? (
        <View className="items-center justify-center flex -mt-5">
          <Text className="text-[#00748D] font-semibold text-2xl px-6 text-center my-4 border-[#00748D] p-2 w-40 rounded-xl border">
            {text}
          </Text>
          <View className="flex flex-row items-center gap-2 -mt-2">
            <Calendar color={"#00748D"} />
            <Text className="text-[#00748D] font-semibold">DURATION</Text>
          </View>
          <Text className="text-[#00748D] font-semibold">
            {`${differenceInHours(
              parseISO(
                endTime instanceof Date
                  ? endTime.toISOString()
                  : new Date(Date.now()).toISOString()
              ),
              parseISO(startTime.toISOString())
            )}H : ${differenceInMinutes(
              parseISO(
                endTime instanceof Date
                  ? endTime.toISOString()
                  : new Date(Date.now()).toISOString()
              ),
              parseISO(startTime.toISOString())
            )}M`}
          </Text>
          <View className="flex flex-row gap-20">
            <View className="bg-white rounded-xl px-7 items-center">
              <Text className="text-[#00748D] font-semibold">START TIME</Text>
              <Text className="font-semibold">
                {format(startTime, "hh:mm:a")}
              </Text>
              <Text>{format(startTime, "dd/MM/yy")}</Text>
            </View>
            <View className="bg-white rounded-xl px-7">
              <Text className="text-[#00748D] font-semibold">END TIME</Text>
              <Text className="font-semibold ">
                {endTime instanceof Date ? format(endTime, "hh:mm:a") : endTime}
              </Text>
              <Text>
                {endTime instanceof Date
                  ? format(endTime, "dd/MM/yy")
                  : endTime}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text className="text-[#00748D] font-semibold text-2xl px-6 text-center my-2">
          {text}
        </Text>
      )}

      <Stack
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="triggers"
      >
        <Stack.Screen name="triggers" options={{ presentation: "card" }} />
        <Stack.Screen name="started-ended" options={{ presentation: "card" }} />
        <Stack.Screen name="severity" options={{ presentation: "card" }} />
        <Stack.Screen
          name="sense-headache"
          options={{ presentation: "card" }}
        />
        <Stack.Screen name="symptoms" options={{ presentation: "card" }} />
        <Stack.Screen name="relieve" options={{ presentation: "card" }} />
        <Stack.Screen name="select-region" options={{ presentation: "card" }} />
        <Stack.Screen name="medicines" options={{ presentation: "card" }} />
        <Stack.Screen
          name="relief-after-medicine"
          options={{ presentation: "card" }}
        />
        <Stack.Screen name="recurrence" options={{ presentation: "card" }} />
        <Stack.Screen name="summary" options={{ presentation: "card" }} />
      </Stack>
      <View>
        <TouchableOpacity
          onPress={() => pathname === "/summary" && setShowAlertDialog(true)}
        >
          <LinearGradient
            colors={["#00748D", "#00BFBF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="absolute bottom-0 left-0 w-1/2"
            style={{ height: 80 }} // ensure height is applied
          />

          {pathname === "/summary" ? (
            <View className="flex items-center flex-row gap-2 justify-center absolute w-1/2 -top-14">
              <Trash2 className="text-white text-lg" color={"white"} />
              <Text className="text-white">Delete</Text>
            </View>
          ) : (
            <View className="flex items-center flex-row gap-2 justify-center absolute w-1/2 -top-14">
              <ClockPlus className="text-white text-lg" color={"white"} />
              <Text className="text-white">Remind me later</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            if (pathIndex < 10) {
              router.push(paths[pathIndex + 1] as any);
            }
          }}
        >
          <LinearGradient
            colors={["#00748D", "#00BFBF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="absolute bottom-0 right-0 w-1/2"
            style={{ height: 80 }} // ensure height is applied
          />
          {pathname === "/summary" ? (
            <View className="flex items-center flex-row justify-center right-0 absolute w-1/2 -top-14">
              <Text className="text-white text-lg">Confirm</Text>
              <ChevronRight className="text-white" color={"white"} />
            </View>
          ) : (
            <View className="flex items-center flex-row justify-center right-0 absolute w-1/2 -top-14">
              <Text className="text-white text-lg">Next</Text>
              <ChevronsRight className="text-white" color={"white"} />
            </View>
          )}
        </TouchableOpacity>
      </View>
      <View>
        <AlertDialog isOpen={showAlertDialog} onClose={handleClose} size="md">
          <AlertDialogBackdrop />
          <AlertDialogContent>
            <AlertDialogHeader>
              <Text className="text-typography-950 font-semibold py-5">
                Are you sure you want to exit?
              </Text>
            </AlertDialogHeader>
            <AlertDialogFooter className="">
              <Button
                variant="outline"
                action="secondary"
                onPress={handleClose}
                size="sm"
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button size="sm" onPress={() => router.replace("/home")}>
                <ButtonText>Exit</ButtonText>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </View>
    </SafeAreaView>
  );
}
