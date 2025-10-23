import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export default function XPBar({ xp, level }: { xp: number; level: number }) {
  const progress = (xp % 100) / 100;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Level {level}</Text>
      <View style={styles.bar}>
        <Animated.View style={[styles.fill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.xpText}>{xp % 100}/100 XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 12 },
  label: { fontWeight: "600" },
  bar: {
    width: "100%",
    height: 10,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginTop: 6,
    overflow: "hidden",
  },
  fill: { backgroundColor: "#4a90e2", height: "100%" },
  xpText: { fontSize: 12, marginTop: 4, textAlign: "right", color: "#555" },
});
