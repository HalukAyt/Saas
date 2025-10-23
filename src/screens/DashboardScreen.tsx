import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet,
} from "react-native";
import { useTheme } from "../utils/ThemeContext";
import { getHabits, completeHabit } from "../api/habit";
import { getXPLogs } from "../api/xp";
import { router } from "expo-router";
import XPBar from "../utils/XpBar";
import { useFocusEffect } from "@react-navigation/native";

export default function DashboardScreen() {
  const { theme } = useTheme();
  const [habits, setHabits] = useState<any[]>([]);
  const [xp, setXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  interface XPLog {
    id: string;
    xpChange: number;
    description: string;
    source: string;
  }

  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getHabits();
      console.log("Habits response:", data);
      setHabits(data);
      const xpLogs = await getXPLogs();
      const totalXp = xpLogs.reduce((acc: number, x: XPLog) => acc + x.xpChange, 0);
      setXp(totalXp);
      setLevel(Math.floor(totalXp / 100) + 1);
    } catch (err) {
      console.log("Error loading habits:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHabits();
    }, [loadHabits])
  );

  const handleComplete = async (id: string, title: string) => {
    try {
      const result = await completeHabit(id);
      if (result.success) {
        if (result.xpEarned > 0) {
          Alert.alert("🎉 Tebrikler!", result.message);
        } else {
          Alert.alert("✅ Güncellendi", result.message);
        }
        loadHabits();
      } else {
        Alert.alert("Bilgi", result.message);
      }
    } catch {
      Alert.alert("Hata", "Bağlantı hatası, tekrar deneyin.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  useEffect(() => {
    loadHabits();
  }, []);

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  // 👇 Eğer hiç alışkanlık yoksa boş ekran
  if (habits.length === 0) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          Henüz hiç alışkanlığın yok 😅
        </Text>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push("/addHabit")}
        >
          <Text style={styles.addButtonText}>Yeni Alışkanlık Ekle ➕</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 👇 Alışkanlıklar varsa listeyi göster
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>🏆 Level {level}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>XP: {xp}</Text>

      {/* XP Bar */}
      <XPBar xp={xp} level={level} />

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => {
          const remainingDays = item.endDate
            ? Math.max(0, Math.floor((new Date(item.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
            : null;

          const progressPercent = Math.min(100, (item.progress / item.goalPerPeriod) * 100);
          const isGoalCompleted = item.progress >= item.goalPerPeriod;

          return (
            <View
              style={[
                styles.card,
                { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.habitTitle, { color: theme.colors.text }]}>
                  {item.title}
                </Text>
                <Text style={[styles.habitCategory, { color: theme.colors.textSecondary }]}>
                  {item.category} | 🔥 {item.streak} gün streak
                </Text>
                <Text style={[styles.habitCategory, { color: theme.colors.textSecondary }]}>
                  🎯 En iyi seri: {item.bestStreak}
                  {remainingDays !== null ? ` | 🏁 ${remainingDays} gün kaldı` : ""}
                </Text>

                {/* İlerleme çubuğu */}
                <View
                  style={[
                    styles.progressBar,
                    { backgroundColor: theme.colors.border, marginTop: 6 },
                  ]}
                >
                  <View
                    style={{
                      width: `${progressPercent}%`,
                      height: 6,
                      borderRadius: 4,
                      backgroundColor: isGoalCompleted
                        ? theme.colors.success || "#4CAF50"
                        : theme.colors.primary,
                    }}
                  />
                </View>
                <Text
                  style={[
                    styles.progressText,
                    { color: theme.colors.textSecondary, marginTop: 4 },
                  ]}
                >
                  {item.progress}/{item.goalPerPeriod} tamamlandı
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: isGoalCompleted
                      ? theme.colors.disabled || "#777"
                      : theme.colors.primary,
                  },
                ]}
                disabled={isGoalCompleted}
                onPress={() => handleComplete(item.id, item.title)}
              >
                <Text style={styles.buttonText}>
                  {isGoalCompleted ? "Tamamlandı" : "Tamamla"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {/* + FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => router.push("/addHabit")}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  subtitle: { fontSize: 16, marginBottom: 16 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 12,
  },
  habitTitle: { fontSize: 18, fontWeight: "600" },
  habitCategory: { fontSize: 14, marginTop: 4 },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  progressBar: { width: "100%", height: 6, borderRadius: 4 },
  progressText: { fontSize: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, marginBottom: 12 },
  addButton: { padding: 12, borderRadius: 10 },
  addButtonText: { color: "#fff", fontWeight: "bold" },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  fabText: { fontSize: 30, color: "#fff", marginTop: -2 },
});
