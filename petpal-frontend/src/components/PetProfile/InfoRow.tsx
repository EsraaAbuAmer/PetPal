import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  label: string;
  value: string;
}

const InfoRow = ({ label, value }: Props) => {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

export default InfoRow;

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 8,
    borderBottomColor: "#f0f0f0",
    borderBottomWidth: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: "#0c1d1a",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    color: "#0c1d1a",
  },
});