import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  title: string;
  date: string;
  location: string;
}

const EventRow = ({ title, date, location }: Props) => {
  return (
    <View style={styles.eventRow}>
      <View style={styles.eventIcon}>
        <Ionicons name="calendar-outline" size={20} color="#0c1d1a" />
      </View>
      <View>
        <Text style={styles.listTitle}>{title}</Text>
        <Text style={styles.listSub}>{date}</Text>
        <Text style={styles.listSub}>{location}</Text>
      </View>
    </View>
  );
};

export default EventRow;

const styles = StyleSheet.create({
  eventRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    paddingVertical: 12,
    borderBottomColor: "#f0f0f0",
    borderBottomWidth: 1,
  },
  eventIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#e6f4f2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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