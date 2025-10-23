import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { getFeed } from "../api/achievements";
import { useTheme } from "../utils/ThemeContext";

export default function FeedScreen() {
  const { theme } = useTheme();
  const [feed, setFeed] = useState<FeedItem[]>([]);

  interface FeedItem {
  id: string;
  userName: string;
  title: string;
  photoUrl?: string;
  xpReward: number;
}


  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getFeed();
    setFeed(data);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={feed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              {item.userName}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {item.title}
            </Text>
            {item.photoUrl && (
              <Image source={{ uri: item.photoUrl }} style={styles.image} />
            )}
            <Text style={{ color: theme.colors.textSecondary }}>
              +{item.xpReward} XP
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  title: { fontWeight: "600", fontSize: 16 },
  subtitle: { marginVertical: 4 },
  image: { width: "100%", height: 180, borderRadius: 8, marginBottom: 6 },
});
