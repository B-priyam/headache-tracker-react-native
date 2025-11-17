import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Redirect, router, Stack, usePathname, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import "react-native-reanimated";
import "@/global.css";
import "react-native-gesture-handler";

import { useColorScheme } from "@/components/useColorScheme";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { ToastProvider } from "@gluestack-ui/core/toast/creator";
import * as SecureStore from "expo-secure-store";
import { SafeAreaView } from "react-native-safe-area-context";
import { setupHourlyReminder } from "@/components/custom/NotificationPermission";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  initialRouteName: "(questions)/triggers.tsx",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });
  const [token, setToken] = useState<string | null>(null);
  const path = usePathname();

  if (path === "/") {
    return <Redirect href="/welcome" />;
  }

  const segments = useSegments(); // ✅ full current route as an array

  // useEffect(() => {
  //   const currentRoute = "/" + segments.join("/");

  //   // ✅ The route where notifications should be paused
  //   const ACTIVE_ROUTE = "/questions";

  //   if (currentRoute === ACTIVE_ROUTE) {
  //     Notifications.cancelAllScheduledNotificationsAsync();
  //   } else {
  //     setupHourlyReminder();
  //   }
  // }, [segments]);

  useEffect(() => {
    const checkToken = async () => {
      const savedToken = await SecureStore.getItemAsync("AccessToken");
      if (!savedToken) router.replace("/welcome");
      setToken(savedToken);
    };
    checkToken();
  }, []);

  useEffect(() => {
    setupHourlyReminder();
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GluestackUIProvider mode="light">
      <ThemeProvider value={DefaultTheme}>
        <ToastProvider>
          <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName="welcome"
          >
            <Stack.Screen
              name="welcome"
              options={{ presentation: "fullScreenModal" }}
            />
            <Stack.Screen
              name="home"
              options={{
                presentation: "card",
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                presentation: "fullScreenModal",
              }}
            />
            <Stack.Screen
              name="signUp"
              options={{ presentation: "fullScreenModal" }}
            />
            <Stack.Screen
              name="(questions)"
              options={{ presentation: "card" }}
            />
            <Stack.Screen name="questions" options={{ presentation: "card" }} />
            <Stack.Screen name="summary" options={{ presentation: "card" }} />
          </Stack>
        </ToastProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
