import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import EventRow from "./EventRow";

interface Props {
  events: { title: string; date: string; location: string }[];
}

const UpcomingEventsSection = ({ events }: Props) => {
  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        <TouchableOpacity onPress={() => { /* Add Event logic */ }}>
          <Ionicons name="add-circle-outline" size={24} color="#00d1b2" />
        </TouchableOpacity>
      </View>
      {events.map((ev, index) => (
        <EventRow
          key={index}
          title={ev.title}
          date={ev.date}
          location={ev.location}
        />
      ))}
    </>
  );
};

export default UpcomingEventsSection;

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0c1d1a",
  },
});