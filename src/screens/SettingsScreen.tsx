import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { getSubscriptionStatus, cancelSubscription } from "../api/subscription";
import { useTheme } from "../utils/ThemeContext";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const [premium, setPremium] = useState(false);
  const [plan, setPlan] = useState("");

  const load = async () => {
    const res = await getSubscriptionStatus();
    setPremium(res.premium);
    setPlan(res.plan || "");
  };

  const handleCancel = async () => {
    const res = await cancelSubscription();
    Alert.alert(res.message);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Ayarlar</Text>
      <Text style={[styles.text, { color: theme.colors.text }]}>
        Premium: {premium ? "Aktif" : "Pasif"}
      </Text>
      {premium && (
        <>
          <Text style={[styles.text, { color: theme.colors.textSecondary }]}>Plan: {plan}</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={handleCancel}
          >
            <Text style={styles.buttonText}>Aboneliği İptal Et</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  text: { fontSize: 16, marginVertical: 6 },
  button: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
