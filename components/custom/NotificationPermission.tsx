import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true, // ✅ new field
    shouldShowList: true, // ✅ new field
  }),
});

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState("");

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) setExpoPushToken(token);
      console.log("Expo Push Token:", token);
    });
  }, []);

  return null;
}

export async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Failed to get permission!");
    return null;
  }

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: "07e8202e-7328-42eb-aae0-5963de649366",
    })
  ).data;
  return token;
}

export async function setupHourlyReminder() {
  const remind = await SecureStore.getItemAsync("remindMeLater");
  // If user disabled reminders — cancel all reminders

  if (remind !== "true") {
    await Notifications.cancelAllScheduledNotificationsAsync();
    return;
  }

  // Clear any old reminders before scheduling new ones
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Schedule hourly reminder
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Reminder",
      body: "Don't forget to log your headache details.",
      sound: "default",
      data: {
        redirectTo: "/questions",
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60, // 1 hour
      repeats: true,
    },
  });
}
