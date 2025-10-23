import React, { useEffect, useState } from "react";
import { View, Text, Modal, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getXPLogs } from "../api/xp";
import { useTheme } from "../utils/ThemeContext";

interface XPHistoryModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function XPHistoryModal({ visible, onClose }: XPHistoryModalProps) {
  const { theme } = useTheme();
  const [logs, setLogs] = useState<any[]>([]);

  

  useEffect(() => {
    if (visible) load();
  }, [visible]);

  const load = async () => {
    const data = await getXPLogs();
    setLogs(data);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={[styles.modal, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>XP Geçmişi</Text>
        <FlatList
          data={logs}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={[styles.text, { color: theme.colors.text }]}>
                {item.description || item.source}
              </Text>
              <Text
                style={[
                  styles.text,
                  { color: item.xpChange >= 0 ? "green" : "red", fontWeight: "bold" },
                ]}
              >
                {item.xpChange >= 0 ? "+" : ""}
                {item.xpChange}
              </Text>
            </View>
          )}
        />
        <TouchableOpacity style={styles.close} onPress={onClose}>
          <Text style={styles.closeText}>Kapat</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    marginTop: 100,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
  },
  text: { fontSize: 15 },
  close: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#444",
    alignItems: "center",
  },
  closeText: { color: "#fff" },
});
