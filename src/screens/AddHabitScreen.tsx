import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { addHabit } from "../api/habit";
import { useTheme } from "../utils/ThemeContext";
import { router } from "expo-router";

export default function AddHabitScreen() {
  const { theme } = useTheme();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("1");
  const [goal, setGoal] = useState("1");

  const handleAdd = async () => {
    if (!title) return Alert.alert("Uyarı", "Lütfen bir başlık girin");
    try {
      await addHabit({
        title,
        category,
        priority: parseInt(priority),
        goalPerPeriod: parseInt(goal),
        frequency: "daily",
      });
      Alert.alert("Başarılı 🎯", "Yeni alışkanlık eklendi!");
      router.back();
    } catch {
      Alert.alert("Hata", "Alışkanlık eklenemedi.");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Text style={[styles.label, { color: theme.colors.text }]}>Başlık</Text>
      <TextInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
        placeholder="Örn: Günde 8 bardak su iç"
        placeholderTextColor={theme.colors.textSecondary}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Kategori</Text>
      <TextInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
        value={category}
        onChangeText={setCategory}
        placeholder="health, reading, sleep..."
        placeholderTextColor={theme.colors.textSecondary}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Öncelik (1–5)</Text>
      <TextInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
        value={priority}
        keyboardType="numeric"
        onChangeText={setPriority}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Günlük Hedef</Text>
      <TextInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
        value={goal}
        keyboardType="numeric"
        onChangeText={setGoal}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleAdd}
      >
        <Text style={styles.buttonText}>Ekle</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontWeight: "600", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
  },
  button: {
    marginTop: 24,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
