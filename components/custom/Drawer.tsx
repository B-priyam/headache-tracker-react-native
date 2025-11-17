// DrawerComponent.tsx
import React from "react";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Button, ButtonText } from "@/components/ui/button";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "@/store/userStore";
import { LogOut } from "lucide-react-native";

export const AppDrawer = React.memo(
  ({
    showDrawer,
    setShowDrawer,
    logout,
  }: {
    showDrawer: boolean;
    setShowDrawer: any;
    logout: any;
  }) => {
    const { name, gender } = useUserStore();
    return (
      <SafeAreaView>
        <Drawer
          isOpen={showDrawer}
          size="lg"
          anchor="left"
          onClose={() => setShowDrawer(false)}
        >
          <DrawerBackdrop />
          <DrawerContent className="w-80 px-0">
            <DrawerHeader className="px-2">
              <Text></Text>
              <DrawerCloseButton>
                <Icon as={CloseIcon} />
              </DrawerCloseButton>
            </DrawerHeader>
            <DrawerBody
              contentContainerStyle={{
                display: "flex",
                width: "100%",
              }}
              className="flex-1 h-full flex-col "
            >
              <View className="flex-1 h-full flex-row items-center gap-5 px-5">
                <View>
                  <Image
                    source={
                      gender === "male"
                        ? require("@/assets/icons/male-circle.png")
                        : require("@/assets/icons/female-circle.png")
                    }
                    className="w-14 h-14"
                  />
                </View>
                <Text className="font-semibold text-xl">{name}</Text>
              </View>
              <View className="border border-black my-2 w-full" />
              {/* <View>
                <Button
                  onPress={logout}
                  className="flex self-end absolute bottom-0"
                >
                  <ButtonText>Logout</ButtonText>
                </Button>
              </View> */}
            </DrawerBody>
            <DrawerFooter className="mb-10 flex flex-col">
              {/* <Button className="w-full" variant="solid" onPress={logout}>
                <ButtonText>Logout</ButtonText>
              </Button> */}
              <View className="border border-gray-400 my-2 w-full px-5" />
              <View className="flex-row justify-end w-full items-start flex px-5 gap-3">
                <View />
                <TouchableOpacity
                  className="flex-row flex gap-3 items-center"
                  onPress={logout}
                >
                  <LogOut />
                  <Text className="font-semibold">Logout</Text>
                </TouchableOpacity>
              </View>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </SafeAreaView>
    );
  }
);
