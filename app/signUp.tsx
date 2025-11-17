import {
  View,
  Text,
  ImageBackground,
  Animated,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, router } from "expo-router";
import { Input, InputField } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import {
  User,
  Phone,
  Mail,
  Lock,
  Cake,
  Smartphone,
  LockOpen,
  CircleIcon,
  CircleAlert,
  CheckIcon,
  AlertCircle,
  X,
  Loader2,
} from "lucide-react-native";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerationSchema } from "../schema/authSchema";
import showToast from "./utils/showToast";
import { useToast } from "@/components/ui/toast";
import * as SecureStore from "expo-secure-store";
import { useUserStore } from "@/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";

const signUp = () => {
  const [accepted, setAccepted] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<z.infer<typeof registerationSchema>>({
    resolver: zodResolver(registerationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      age: "",
      doctor: "",
      email: "",
      gender: undefined,
      mobile: "",
      name: "",
      password: "",
    },
  });
  const toast = useToast();
  const { setName, setGender, setCreatedAt, setEmail } = useUserStore();

  useEffect(() => {
    const tokenExists = async () => {
      const token = await SecureStore.getItemAsync("AccessToken");
      if (token) {
        router.replace("/home");
      }
    };
    tokenExists();
  }, []);

  const signUp = async (data: z.infer<typeof registerationSchema>) => {
    try {
      if (!accepted) {
        return new Promise((resolve) => setTimeout(resolve, 1000));
      }
      const res = await fetch("http://192.168.1.15:3000/api/auth/register", {
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
      showToast(toast, error.message, CheckIcon, 1500);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/register-background.png")}
      className="flex h-full w-full"
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView className="flex items-center justify-center">
            <View>
              <Image
                source={require("../assets/images/logo.png")}
                className="h-[150px] w-[150px] py-5"
                resizeMode="contain"
              />
            </View>
            <View className={"flex flex-col gap-3 items-center"}>
              <Text className="my-5 font-semibold text-blue-700 text-xl font-inter">
                REGISTER
              </Text>
            </View>
          </SafeAreaView>
          <View className="px-10 gap-5">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="underlined"
                  size="md"
                  isDisabled={false}
                  isInvalid={false}
                  isReadOnly={false}
                  className="gap-3"
                >
                  <Icon
                    as={User}
                    className="text-blue-500 no-underline h-8 w-8"
                  />
                  <InputField
                    placeholder="Username"
                    className="font-semibold"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                  {errors.name && (
                    <View className="flex flex-row gap-1 items-center">
                      <Icon as={AlertCircle} className="text-red-500 h-4 w-4" />
                      <Text className="text-red-500 text-sm max-w-32">
                        {errors.name.message}
                      </Text>
                    </View>
                  )}
                </Input>
              )}
            />

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
                    className="text-blue-500 no-underline  h-8 w-8"
                  />
                  <InputField
                    placeholder="Mobile number"
                    className="font-semibold"
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
              name="email"
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
                    as={Mail}
                    className="text-blue-500 no-underline h-8 w-8"
                  />
                  <InputField
                    placeholder="Email"
                    className="font-semibold"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="email-address"
                  />
                  {errors.email && (
                    <View className="flex flex-row gap-1 items-center">
                      <Icon as={AlertCircle} className="text-red-500 h-4 w-4" />
                      <Text className="text-red-500 text-sm max-w-32">
                        {errors.email.message}
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
                  className="gap-3"
                >
                  <Icon
                    as={Lock}
                    className="text-blue-500 no-underline h-8 w-8"
                  />
                  <InputField
                    placeholder="Password"
                    className="font-semibold"
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

            <Controller
              control={control}
              name="age"
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
                    as={Cake}
                    className="text-blue-500 no-underline h-8 w-8"
                  />
                  <InputField
                    placeholder="Age"
                    className="font-semibold"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="number-pad"
                  />
                  {errors.age && (
                    <View className="flex flex-row gap-1 items-center">
                      <Icon as={AlertCircle} className="text-red-500 h-4 w-4" />
                      <Text className="text-red-500 text-sm max-w-32">
                        {errors.age.message}
                      </Text>
                    </View>
                  )}
                </Input>
              )}
            />
            <Controller
              control={control}
              name="doctor"
              render={({ field: { onChange, onBlur, value } }: any) => (
                <Input
                  variant="underlined"
                  size="md"
                  isDisabled={false}
                  isInvalid={false}
                  isReadOnly={false}
                  className="gap-3"
                >
                  <Image
                    source={require("../assets/icons/doctor.png")}
                    className="w-8 h-8"
                    resizeMode="contain"
                  />
                  <InputField
                    placeholder="Doctor name"
                    className="font-semibold"
                    value={value}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                  {errors.doctor && (
                    <View className="flex flex-row gap-1 items-center">
                      <Icon as={AlertCircle} className="text-red-500 h-4 w-4" />
                      <Text className="text-red-500 text-sm max-w-32">
                        {errors.doctor.message}
                      </Text>
                    </View>
                  )}
                </Input>
              )}
            />
            <View className="py-1">
              <Controller
                control={control}
                name="gender"
                render={({ field: { onChange, value } }) => (
                  <RadioGroup
                    className="flex flex-row justify-between px-1 w-full"
                    onChange={onChange}
                    value={value}
                  >
                    <Radio value="male">
                      <Image
                        source={require("../assets/icons/male.png")}
                        className="w-7 h-7"
                        resizeMode="contain"
                      />
                      <RadioIndicator
                        className="
                        border-blue-500 
                        data-[state=checked]:border-blue-500 
                        data-[state=checked]:bg-blue-500
                        "
                      >
                        <RadioIcon
                          as={CircleIcon}
                          className="fill-blue-400 data-[state=checked]:border-none border-none"
                        />
                      </RadioIndicator>
                      <RadioLabel className="text-blue-500 data-[state=checked]:text-blue-500">
                        Male
                      </RadioLabel>
                    </Radio>

                    <Radio value="female">
                      <Image
                        source={require("../assets/icons/female.png")}
                        className="w-7 h-7"
                        resizeMode="contain"
                      />
                      <RadioIndicator
                        className="
                border-blue-500 
                data-[state=checked]:border-blue-500 
                data-[state=checked]:bg-blue-500
                "
                      >
                        <RadioIcon
                          as={CircleIcon}
                          className="fill-blue-400 border-blue-500"
                        />
                      </RadioIndicator>
                      <RadioLabel className="text-blue-500 data-[state=checked]:text-blue-500">
                        Female
                      </RadioLabel>
                    </Radio>
                  </RadioGroup>
                )}
              />
              {errors.gender && (
                <View className="flex flex-row gap-1 items-center pt-2">
                  <Icon as={AlertCircle} className="text-red-500" />
                  <Text className="text-red-500">{errors.gender.message}</Text>
                </View>
              )}
            </View>
            <Checkbox value="accept" onChange={(e) => setAccepted(!accepted)}>
              <CheckboxIndicator className="border-blue-400 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500">
                <CheckboxIcon
                  as={CheckIcon}
                  className="text-white bg-blue-500 border-none "
                />
              </CheckboxIndicator>
              <CheckboxLabel className="text-blue-500 data-[state=checked]:text-blue-600">
                I Accept Terms and Conditions
              </CheckboxLabel>
            </Checkbox>
            {!accepted && isSubmitting && (
              <View className="flex flex-row items-center gap-1 -mt-5">
                <Icon as={AlertCircle} className="text-red-500 h-4 w-4" />
                <Text className="text-red-500 text-sm">
                  Kindly Accept the Terms and Conditions first.
                </Text>
              </View>
            )}
            <TouchableOpacity
              className={`border-2 rounded-full border-blue-500 p-1.5 w-40 self-center items-center ${
                isSubmitting && accepted ? "bg-blue-400" : "bg-transparent"
              }`}
              onPress={handleSubmit(signUp)}
            >
              {isSubmitting && accepted ? (
                <View className="flex flex-row items-center gap-1 ">
                  <Icon as={Loader2} className="animate-spin" color="white" />
                  <Text className="text-white">Submitting</Text>
                </View>
              ) : (
                <Text className="text-blue-600 font-bold text-xl">SIGN UP</Text>
              )}
            </TouchableOpacity>
            <Text className="text-center">
              Already Have An Account ?{" "}
              <Link href={"/login"} className="text-blue-500">
                LOGIN
              </Link>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default signUp;
