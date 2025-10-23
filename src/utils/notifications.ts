import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export async function scheduleReminder(title: string, body: string, seconds: number) {
  await Notifications.scheduleNotificationAsync({
  content: {
    title: "🎯 StudyDuck Reminder",
    body: "Yeni görevini tamamlamayı unutma!",
  },
  trigger: {
    seconds: 5,
    repeats: false
  } as Notifications.TimeIntervalTriggerInput,
});
}

export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) return;
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Bildirim izni gerekli!");
    return;
  }
}
