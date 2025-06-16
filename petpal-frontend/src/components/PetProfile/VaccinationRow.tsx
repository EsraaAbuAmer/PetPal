import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  name: string;
  dueDate: string;
}

const VaccinationRow = ({ name, dueDate }: Props) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View style={styles.listRow}>
      <View>
        <Text style={styles.listTitle}>{name}</Text>
        <Text style={styles.listSub}>{formatDate(dueDate)}</Text>
      </View>
    </View>
  );
};

export default VaccinationRow;

const styles = StyleSheet.create({
  listRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  listTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0c1d1a",
  },
  listSub: {
    fontSize: 13,
    color: "#6e7d78",
    marginTop: 4,
  },
});