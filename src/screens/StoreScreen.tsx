import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getStoreItems, buyReward } from "../api/rewards";
import { useTheme } from "../utils/ThemeContext";

export default function StoreScreen() {
  const { theme } = useTheme();
  const [items, setItems] = useState<RewardItem[]>([]);

  interface RewardItem {
  id: string;
  name: string;
  description: string;
  costXP: number;
  imageUrl?: string;
}

  const load = async () => {
    const data = await getStoreItems();
    setItems(data);
  };

  const handleBuy = async (id: string, name: string) => {
    try {
      const res = await buyReward(id);
      if (res.success) Alert.alert("Başarılı", `${name} satın alındı!`);
      else Alert.alert("Uyarı", res.message);
    } catch {
      Alert.alert("Hata", "Satın alma başarısız oldu.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Image source={{ uri: item.imageUrl }} style={styles.image} />
            <Text style={[styles.name, { color: theme.colors.text }]}>{item.name}</Text>
            <Text style={[styles.desc, { color: theme.colors.textSecondary }]}>
              {item.description}
            </Text>
            <Text style={[styles.xp, { color: theme.colors.primary }]}>
              {item.costXP} XP
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={() => handleBuy(item.id, item.name)}
            >
              <Text style={styles.buttonText}>Satın Al</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderRadius: 10, padding: 12, marginBottom: 14, alignItems: "center" },
  image: { width: 100, height: 100, borderRadius: 8 },
  name: { fontWeight: "600", fontSize: 16, marginTop: 6 },
  desc: { textAlign: "center", fontSize: 13 },
  xp: { marginVertical: 4, fontWeight: "bold" },
  button: { padding: 10, borderRadius: 8, marginTop: 6 },
  buttonText: { color: "#fff" },
});
