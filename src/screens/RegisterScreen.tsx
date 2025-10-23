import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { register } from "../api/auth";
import { router } from "expo-router";
import { useTheme } from "../utils/ThemeContext";

export default function RegisterScreen() {
  const { theme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !name)
      return Alert.alert("Eksik Bilgi", "Tüm alanları doldurmanız gerekir.");
    try {
      await register(name, email, password);
      Alert.alert("Kayıt Başarılı 🎉", "Şimdi giriş yapabilirsiniz.");
      router.replace("/login");
    } catch {
      Alert.alert("Hata", "Kayıt işlemi başarısız.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Kayıt Ol</Text>
      <TextInput
        placeholder="Ad Soyad"
        value={name}
        onChangeText={setName}
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
      />
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
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { borderWidth: 1, padding: 12, borderRadius: 8, marginBottom: 14 },
  button: { padding: 14, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
