import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import React, { useEffect } from "react";
import { ThemeProvider } from "../utils/ThemeContext";

import DashboardScreen from "../screens/DashboardScreen";
import FeedScreen from "../screens/FeedScreen";
import FriendsScreen from "../screens/FriendsScreen";
import StoreScreen from "../screens/StoreScreen";
import SettingsScreen from "./SettingsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  // 🔔 Bildirim davranışlarını ayarla
  Notifications.setNotificationHandler({
    handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true, // ✅ SDK 53 için eklendi
      shouldShowList: true,   // ✅ SDK 53 için eklendi
    }),
  });

  // 🔹 Kullanıcıdan bildirim izni iste
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        console.log("Bildirim izni verilmedi 🚫");
      }
    })();
  }, []);
  useEffect(() => {
  (async () => {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      await Notifications.requestPermissionsAsync();
    }
  })();
}, []);


  return (
    <ThemeProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              let icon: keyof typeof Ionicons.glyphMap = "home";
              if (route.name === "Dashboard") icon = "home";
              else if (route.name === "Friends") icon = "people";
              else if (route.name === "Feed") icon = "trophy";
              else if (route.name === "Store") icon = "cart";
              else if (route.name === "Settings") icon = "settings";

              return <Ionicons name={icon} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#4a90e2",
            tabBarInactiveTintColor: "gray",
          })}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
          <Tab.Screen name="Friends" component={FriendsScreen} />
          <Tab.Screen name="Feed" component={FeedScreen} />
          <Tab.Screen name="Store" component={StoreScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
