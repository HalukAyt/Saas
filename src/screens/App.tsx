import React from "react";
import { ThemeProvider } from "../utils/ThemeContext";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import DashboardScreen from "../screens/DashboardScreen";
import FriendsScreen from "../screens/FriendsScreen";
import FeedScreen from "../screens/FeedScreen";
import StoreScreen from "../screens/StoreScreen";
import SettingsScreen from "./SettingsScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
              let icon = "home";
              if (route.name === "Dashboard") icon = "home";
              else if (route.name === "Friends") icon = "people";
              else if (route.name === "Feed") icon = "trophy";
              else if (route.name === "Store") icon = "cart";
              else if (route.name === "Settings") icon = "settings";
              return <Ionicons name={icon as any} size={size} color={color} />;
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
