import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import { getFriends, sendFriendRequest } from "../api/friends";
import { useTheme } from "../utils/ThemeContext";

export default function FriendsScreen() {
  const { theme } = useTheme();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [email, setEmail] = useState("");

  interface Friend {
  id: string;
  name: string;
  email?: string;
}

  const loadFriends = async () => {
    const data = await getFriends();
    setFriends(data);
  };

  const handleInvite = async () => {
    if (!email) return;
    try {
      await sendFriendRequest(email);
      Alert.alert("Gönderildi", "Arkadaş isteği yollandı.");
      setEmail("");
    } catch {
      Alert.alert("Hata", "Davet başarısız oldu.");
    }
  };

  useEffect(() => {
    loadFriends();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Arkadaşlarım</Text>

      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={[styles.friend, { color: theme.colors.text }]}>{item.name}</Text>
        )}
      />

      <TextInput
        style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
        placeholder="Arkadaşının email adresi"
        placeholderTextColor={theme.colors.textSecondary}
        value={email}
        onChangeText={setEmail}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        onPress={handleInvite}
      >
        <Text style={styles.buttonText}>Davet Et</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  friend: { fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 16,
  },
  button: {
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
