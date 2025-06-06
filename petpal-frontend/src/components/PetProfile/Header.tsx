import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Header = () => {
  return (
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => {}}>
        <Ionicons name="arrow-back" size={24} color="#0c1d1a" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Pet Profile</Text>
      <View style={{ width: 24 }} />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingTop: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0c1d1a",
  },
});