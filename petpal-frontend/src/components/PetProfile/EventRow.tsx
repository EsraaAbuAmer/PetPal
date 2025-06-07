import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  title: string;
  date: string;
}

const EventRow = ({ title, date }: Props) => {
  return (
    <View style={styles.listRow}>
      <View>
        <Text style={styles.listTitle}>{title}</Text>
        <Text style={styles.listSub}>{date}</Text>

      </View>
    </View>
  );
};

export default EventRow;

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
});