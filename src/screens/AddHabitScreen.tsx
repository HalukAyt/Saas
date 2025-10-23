import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Notifications from "expo-notifications";
import { addHabit } from "../api/habit";
import { useTheme } from "../utils/ThemeContext";
import { router } from "expo-router";

// 🔹 Bildirim izinlerini ayarlayalım (bir kereye mahsus)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function AddHabitScreen() {
  const { theme } = useTheme();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("1");
  const [goal, setGoal] = useState("1");
  const [duration, setDuration] = useState("30");
  const [frequency, setFrequency] = useState("daily");

  // 🔹 Bildirim izni iste (ilk açılışta)
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Bildirim izni reddedildi", "Hatırlatmalar devre dışı kalabilir.");
      }
    })();
  }, []);

  // 🔹 Yeni alışkanlık ekleme
  const handleAdd = async () => {
    if (!title.trim()) return Alert.alert("Uyarı", "Lütfen bir başlık girin");

    try {
      // ✅ Backend'e kaydet
      await addHabit({
        title,
        category,
        priority: parseInt(priority),
        goalPerPeriod: parseInt(goal),
        frequency,
        durationDays: parseInt(duration),
      });

      // ✅ Bildirimi planla (her sabah 09:00)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🧠 Hatırlatma",
          body: `${title} zamanı geldi!`,
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
        } as Notifications.CalendarTriggerInput,
      });

      Alert.alert("Başarılı 🎯", "Yeni alışkanlık eklendi!");
      router.replace("/dashboard");
    } catch (err) {
      console.error("Habit Add Error:", err);
      Alert.alert("Hata", "Alışkanlık eklenemedi. Bağlantı veya sunucu hatası.");
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

      <Text style={[styles.label, { color: theme.colors.text }]}>Hedef (günlük miktar)</Text>
      <TextInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
        value={goal}
        keyboardType="numeric"
        onChangeText={setGoal}
      />

      {/* 🔹 Süre seçimi */}
      <Text style={[styles.label, { color: theme.colors.text }]}>Hedef Süresi</Text>
      <View style={[styles.pickerContainer, { borderColor: theme.colors.border }]}>
        <Picker
          selectedValue={duration}
          onValueChange={(val) => setDuration(val.toString())}
          style={{ color: theme.colors.text }}
        >
          <Picker.Item label="1 Hafta" value="7" />
          <Picker.Item label="1 Ay" value="30" />
          <Picker.Item label="3 Ay" value="90" />
          <Picker.Item label="6 Ay" value="180" />
          <Picker.Item label="1 Yıl" value="365" />
        </Picker>
      </View>

      {/* 🔹 Sıklık */}
      <Text style={[styles.label, { color: theme.colors.text }]}>Sıklık</Text>
      <View style={{ flexDirection: "row", marginVertical: 8 }}>
        {["daily", "weekly", "monthly"].map((freq) => (
          <TouchableOpacity
            key={freq}
            style={[
              styles.freqButton,
              { backgroundColor: frequency === freq ? theme.colors.primary : theme.colors.card },
            ]}
            onPress={() => setFrequency(freq)}
          >
            <Text
              style={{
                color: frequency === freq ? "#fff" : theme.colors.textSecondary,
              }}
            >
              {freq === "daily" ? "Günlük" : freq === "weekly" ? "Haftalık" : "Aylık"}
            </Text>
          </TouchableOpacity>
        ))}
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
  freqButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginRight: 10,
  },
  button: {
    marginTop: 24,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
