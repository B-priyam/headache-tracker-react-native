import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Input, InputField } from "@/components/ui/input";
import {
  AlertCircle,
  CheckIcon,
  Loader2,
  Lock,
  LockOpen,
  Smartphone,
  X,
} from "lucide-react-native";
import { Link, router } from "expo-router";
import { Icon } from "@/components/ui/icon";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { loginSchema } from "../schema/authSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/toast";
import showToast from "./utils/showToast";
import * as SecureStore from "expo-secure-store";
import { useUserStore } from "@/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";

const login = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      mobile: "",
      password: "",
    },
  });

  const [showDrawer, setShowDrawer] = useState(false);

  const toast = useToast();
  const { setName, setGender, setCreatedAt, setEmail } = useUserStore();

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    try {
      if (!isValid) {
        console.log("working");
        return;
      }
      const res = await fetch("http://192.168.1.15:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();
      if (response.status === 200) {
        showToast(toast, response.message, CheckIcon, 1500);
        await SecureStore.setItemAsync("AccessToken", response.token);
        setName(response.user.name);
        setGender(response.user.gender);
        setCreatedAt(response.user.createdAt);
        setEmail(response.user.email);
        router.push("/home");
      } else {
        showToast(toast, response.message, X, 1500, "error");
      }
    } catch (error: any) {
      console.log(error.message);
      showToast(toast, error.message, CheckIcon, 1500);
    }
  };

  useEffect(() => {
    const tokenExists = async () => {
      const token = await SecureStore.getItemAsync("AccessToken");
      if (token) {
        router.replace("/home");
      }
    };
    tokenExists();
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/register-background.png")} // background image
      className="flex h-full w-full py-16 "
      resizeMode="cover"
    >
      <SafeAreaView className="flex items-center justify-center">
        <View>
          <Image
            source={require("../assets/images/logo.png")} // foreground logo
            className="h-[150px] w-[150px] py-5"
            resizeMode="contain"
          />
        </View>
        <View className={"flex flex-col gap-3 items-center"}>
          <Text className="my-5 font-semibold text-blue-700 text-xl font-inter">
            LOGIN
          </Text>
        </View>
      </SafeAreaView>
      <View className="px-10 gap-5">
        <Controller
          control={control}
          name="mobile"
          render={({ field: { onChange, onBlur, value } }: any) => (
            <Input
              variant="underlined"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
              className="gap-3"
            >
              <Icon
                as={Smartphone}
                size={"xl"}
                className="text-blue-500 no-underline"
              />
              <InputField
                placeholder="Mobile number"
                className="font-semibold dark:text-black"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="number-pad"
                maxLength={10}
              />
              {errors.mobile && (
                <View className="flex flex-row gap-1 items-center">
                  <Icon as={AlertCircle} className="text-red-500 h-4 w-4" />
                  <Text className="text-red-500 text-sm max-w-32">
                    {errors.mobile.message}
                  </Text>
                </View>
              )}
            </Input>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }: any) => (
            <Input
              variant="underlined"
              size="md"
              isDisabled={false}
              isInvalid={false}
              isReadOnly={false}
              className="gap-3 text-black"
            >
              <Icon
                as={Lock}
                size={"md"}
                className="text-blue-500 no-underline"
              />
              <InputField
                placeholder="Password"
                className="font-semibold dark:text-black"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                type="password"
              />
              {errors.password && (
                <View className="flex flex-row gap-1 items-center">
                  <Icon as={AlertCircle} className="text-red-500 h-4 w-4" />
                  <Text className="text-red-500 text-sm max-w-32">
                    {errors.password.message}
                  </Text>
                </View>
              )}
            </Input>
          )}
        />

        <TouchableOpacity
          className={`border-2 py-2 rounded-full border-blue-500 p-1.5 w-40 self-center items-center ${
            isSubmitting ? "bg-blue-500" : "bg-transparent disabled:bg-blue-500"
          }`}
          onPress={handleSubmit(handleLogin)}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View className="flex flex-row items-center gap-1 ">
              <Icon as={Loader2} className="animate-spin" color="white" />
              <Text className="text-white font-bold">Submitting</Text>
            </View>
          ) : (
            <Text className="text-blue-600 font-bold text-xl ">LOG IN</Text>
          )}
        </TouchableOpacity>
        <Text className="text-center">
          Create An Account.{" "}
          <Link href={"/signUp"} className="text-blue-500">
            CREATE
          </Link>
        </Text>
      </View>
    </ImageBackground>
  );
};

export default login;
