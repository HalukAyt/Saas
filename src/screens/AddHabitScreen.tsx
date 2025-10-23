import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  View
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { addHabit } from "../api/habit";
import { useTheme } from "../utils/ThemeContext";
import { router } from "expo-router";

export default function AddHabitScreen() {
  const { theme } = useTheme();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("1");
  const [goal, setGoal] = useState("1");
  const [duration, setDuration] = useState("30"); // 🔹 30 gün varsayılan

  const handleAdd = async () => {
    if (!title) return Alert.alert("Uyarı", "Lütfen bir başlık girin");

    try {
      await addHabit({
        title,
        category,
        priority: parseInt(priority),
        goalPerPeriod: parseInt(goal),
        frequency: "daily",
        durationDays: parseInt(duration), // ✅ yeni alan
      });
      Alert.alert("Başarılı 🎯", "Yeni alışkanlık eklendi!");
      router.replace("/dashboard");
    } catch (err) {
      console.log(err);
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

      {/* 🔹 Yeni alan: Süre seçimi */}
      <Text style={[styles.label, { color: theme.colors.text }]}>Hedef Süresi</Text>
      <View style={[styles.pickerContainer, { borderColor: theme.colors.border }]}>
        <Picker
          selectedValue={duration}
          onValueChange={(val:any) => setDuration(val)}
          style={{ color: theme.colors.text }}
        >
          <Picker.Item label="1 Hafta" value="7" />
          <Picker.Item label="1 Ay" value="30" />
          <Picker.Item label="3 Ay" value="90" />
          <Picker.Item label="6 Ay" value="180" />
          <Picker.Item label="1 Yıl" value="365" />
        </Picker>
      </View>

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
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 6,
    overflow: "hidden",
  },
  button: {
    marginTop: 24,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
