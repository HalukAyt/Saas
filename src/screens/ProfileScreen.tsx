// src/screens/ProfileScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "../utils/useAuth";
import { useTheme } from "../utils/ThemeContext";
import { getOwnedRewards } from "../api/rewards";

export default function ProfileScreen() {
  const { user, loading, signOut, refreshProfile } = useAuth();
  const { theme } = useTheme();
  const [rewards, setRewards] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      loadRewards();
    }
  }, [user]);

  const loadRewards = async () => {
    try {
      const data = await getOwnedRewards();
      setRewards(data);
    } catch (e) {
      console.log("Failed to load rewards");
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Giriş yapılmamış.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{user.name}</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        {user.email}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        XP: {user.xp ?? 0} | Level: {user.level ?? 1}
      </Text>
      <Text
        style={[
          styles.subtitle,
          { color: user.premium ? theme.colors.primary : theme.colors.textSecondary },
        ]}
      >
        {user.premium ? "🌟 Premium Üye" : "Normal Üye"}
      </Text>

      <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20 }]}>
        🎁 Kazanılan Ödüller
      </Text>
      {rewards.length === 0 ? (
        <Text style={{ color: theme.colors.textSecondary }}>Henüz ödül kazanılmadı.</Text>
      ) : (
        rewards.map((r) => (
          <Text key={r.id} style={{ color: theme.colors.text }}>
            • {r.rewardItem.name}
          </Text>
        ))
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary, marginTop: 40 }]}
        onPress={signOut}
      >
        <Text style={styles.buttonText}>Çıkış Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.refreshBtn, { borderColor: theme.colors.primary }]}
        onPress={refreshProfile}
      >
        <Text style={{ color: theme.colors.primary }}>Profili Yenile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold" },
  subtitle: { fontSize: 16, marginVertical: 4 },
  sectionTitle: { fontWeight: "600", marginBottom: 6 },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  refreshBtn: {
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
