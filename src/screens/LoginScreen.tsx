import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { login } from "../api/auth";
import { useTheme } from "../utils/ThemeContext";

export default function LoginScreen() {
  const { theme } = useTheme();
  const [email, setEmail] = useState("halukaytis@gmail.com");
  const [password, setPassword] = useState("Ha151725");

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Eksik bilgi", "Lütfen email ve şifre girin.");
    try {
      const res = await login(email, password);
      await AsyncStorage.setItem("token", res.token);
      Alert.alert("Giriş Başarılı ✅", `Hoş geldin ${res.user.name}!`);
      router.replace("/dashboard");
    } catch {
      Alert.alert("Hata", "Giriş başarısız. Bilgileri kontrol edin.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Giriş Yap</Text>
      <TextInput
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
      />
      <TextInput
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={{ color: theme.colors.textSecondary, marginTop: 10 }}>
          Hesabın yok mu? Kayıt Ol
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },
  button: { padding: 14, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
