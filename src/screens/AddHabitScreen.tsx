import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  View,
  Platform,
} from "react-native";
import { useTheme } from "../utils/ThemeContext";
import { router } from "expo-router";
import { addHabit } from "../api/habit";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";

export default function AddHabitScreen() {
  const { theme } = useTheme();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("general");
  const [priority, setPriority] = useState("1");
  const [goal, setGoal] = useState("1");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("daily");
  const [reminderTime, setReminderTime] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // 🔔 Notification izin kontrolü
  React.useEffect(() => {
    (async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    })();
  }, []);

  const handleAdd = async () => {
    if (!title) return Alert.alert("Uyarı", "Lütfen bir başlık girin");
    try {
      // 🧠 Backend’e gönderilecek payload
      await addHabit({
        title,
        category,
        priority: parseInt(priority),
        goalPerPeriod: parseInt(goal),
        frequency,
        reminderTime: reminderTime
          ? `${reminderTime.getHours()}:${reminderTime.getMinutes()}`
          : null,
      });

      // 🔔 Bildirim planla (local notification)
      if (reminderTime) {
        const triggerHour = reminderTime.getHours();
        const triggerMinute = reminderTime.getMinutes();

        let triggerConfig: any = {};

        if (frequency === "daily") {
          triggerConfig = { hour: triggerHour, minute: triggerMinute, repeats: true };
        } else if (frequency === "weekly") {
          triggerConfig = {
            weekday: new Date().getDay() || 1, // 0 = Pazar -> 1 yap
            hour: triggerHour,
            minute: triggerMinute,
            repeats: true,
          };
        } else if (frequency === "monthly") {
          triggerConfig = {
            day: new Date().getDate(),
            hour: triggerHour,
            minute: triggerMinute,
            repeats: true,
          };
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: "🧠 Hatırlatma Zamanı!",
            body: `${title} zamanı geldi!`,
            sound: true,
          },
          trigger: triggerConfig,
        });
      }

      Alert.alert("Başarılı 🎯", "Yeni alışkanlık eklendi!");
      router.back();
    } catch (err) {
      console.log("Add habit error:", err);
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

      <Text style={[styles.label, { color: theme.colors.text }]}>Hedef (örnek: 8 defa)</Text>
      <TextInput
        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
        value={goal}
        keyboardType="numeric"
        onChangeText={setGoal}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Sıklık</Text>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        {["daily", "weekly", "monthly"].map((freq) => (
          <TouchableOpacity
            key={freq}
            style={[
              styles.freqButton,
              {
                backgroundColor:
                  frequency === freq ? theme.colors.primary : theme.colors.card,
              },
            ]}
            onPress={() => setFrequency(freq as any)}
          >
            <Text
              style={{
                color: frequency === freq ? "#fff" : theme.colors.textSecondary,
                fontWeight: frequency === freq ? "bold" : "normal",
              }}
            >
              {freq === "daily"
                ? "Günlük"
                : freq === "weekly"
                ? "Haftalık"
                : "Aylık"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.label, { color: theme.colors.text }]}>Hatırlatma Saati</Text>
      <TouchableOpacity
        style={[styles.input, { justifyContent: "center" }]}
        onPress={() => setShowPicker(true)}
      >
        <Text style={{ color: theme.colors.text }}>
          {reminderTime
            ? reminderTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "Saat seç"}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={reminderTime || new Date()}
          mode="time"
          is24Hour={true}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setReminderTime(date);
          }}
        />
      )}

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
  freqButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  button: {
    marginTop: 24,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
