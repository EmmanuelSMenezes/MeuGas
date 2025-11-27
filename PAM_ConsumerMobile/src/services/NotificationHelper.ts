import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from "expo-device";

const registerForPushNotificationsAsync = async () =>{
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      // alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    // alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const send = async (title: string, body: string, timerTrigger: number) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
    },
    trigger: { seconds: timerTrigger },
  });
}

// Esquema de notificação remoto
const registerForPushNotificationsAsyncRemoto = async (expoPushToken: string) => {

  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Remoto via fetch',
    body: 'Teste body!',
    data: {data: "goes here"}
  }

  await fetch('https://exemplo.com.br', {
    method: 'POST',
    headers: {
      Accept: "application/json",
      "accept-encoding": 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export default {
  registerForPushNotificationsAsync,
  registerForPushNotificationsAsyncRemoto,
  send,
};
