import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  name: string;
  dueDate: string;
}

const VaccinationRow = ({ name, dueDate }: Props) => {
  return (
    <View style={styles.listRow}>
      <View>
        <Text style={styles.listTitle}>{name}</Text>
        <Text style={styles.listSub}>{dueDate}</Text>
      </View>
    </View>
  );
};

export default VaccinationRow;

const styles = StyleSheet.create({
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 12,
    borderBottomColor: "#f0f0f0",
    borderBottomWidth: 1,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0c1d1a",
  },
  listSub: {
    fontSize: 13,
    color: "#6e7d78",
  },
  reminderButton: {
    backgroundColor: "#f1f5f4",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  reminderButtonText: {
    fontSize: 13,
    color: "#0c1d1a",
    fontWeight: "600",
  },
});