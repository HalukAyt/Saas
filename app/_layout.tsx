import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "../src/utils/ThemeContext";
import { AuthProvider } from "../src/context/AuthContext";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="dashboard" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="store" />
          <Stack.Screen name="addHabit" />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
