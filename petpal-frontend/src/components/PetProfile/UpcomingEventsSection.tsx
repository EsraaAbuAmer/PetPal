import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EventRow from "./EventRow";

interface Props {
  events: { event_title: string; event_date: string; location: string }[];
  onAddPress: () => void;
}

const UpcomingEventsSection = ({ events, onAddPress }: Props) => {
  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <TouchableOpacity onPress={onAddPress}>
          <Ionicons name="add-circle-outline" size={24} color="#00d1b2" />
        </TouchableOpacity>
      </View>

      {events.length === 0 ? (
        <Text style={styles.emptyText}>No upcoming events yet.</Text>
      ) : (
        events.map((ev, index) => (
          <EventRow
            key={index}
            title={ev.title}
            date={new Date(ev.date).toDateString()} // Convert to readable date
          />
        ))
      )}
    </>
  );
};

export default UpcomingEventsSection;

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0c1d1a",
  },
  emptyText: {
    fontSize: 14,
    color: "#6e7d78",
    fontStyle: "italic",
    paddingVertical: 4,
    paddingLeft: 8,
    alignSelf: "flex-start",
  },
});