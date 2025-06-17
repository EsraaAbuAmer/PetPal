// Header.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Header = ({ onDeletePress }: { onDeletePress?: () => void }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#0c1d1a" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Pet Profile</Text>
      <TouchableOpacity onPress={onDeletePress}>
        <Feather name="trash-2" size={22} color="#ef4444" />
      </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0c1d1a",
  },
});