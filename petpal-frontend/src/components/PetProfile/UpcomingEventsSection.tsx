import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Animated from "react-native-reanimated";
import SwipeableItem, { OpenDirection } from "react-native-swipeable-item";
import { Ionicons } from "@expo/vector-icons";
import EventRow from "./EventRow";

const screenWidth = Dimensions.get("window").width;

interface Event {
  id: number;
  title: string;
  date: string;
  notes: string;
}

interface Props {
  events: Event[];
  onAddPress: () => void;
  onDeletePress: (eventId: number) => void;
  onEditPress?: (event: Event) => void;
}

const UpcomingEventsSection = ({
  events,
  onAddPress,
  onDeletePress,
  onEditPress,
}: Props) => {
  const itemRefs = useRef(new Map<number, SwipeableItem<Event>>());

  const renderUnderlayRight = (event: Event) => (
    <Animated.View style={[styles.underlayRight, { alignSelf: "flex-end" }]}>
      <TouchableOpacity onPress={() => onDeletePress(event.id)}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );

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
        events.map((event) => (
          <View key={event.id} style={styles.fullWidth}>
            <SwipeableItem
              item={event}
              ref={(ref) => {
                if (ref && !itemRefs.current.get(event.id)) {
                  itemRefs.current.set(event.id, ref);
                }
              }}
              overSwipe={20}
              snapPointsLeft={[80]} // disable left swipe
              renderUnderlayLeft={() => renderUnderlayRight(event)}
              onChange={({ openDirection }) => {
                if (openDirection !== OpenDirection.NONE) {
                  [...itemRefs.current.entries()].forEach(([key, ref]) => {
                    if (key !== event.id && ref?.close) ref.close();
                  });
                }
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onEditPress?.(event)}
              >
                <View style={styles.rowContainer}>
                  <EventRow
                    title={event.title}
                    date={event.date}
                    notes={event.notes}
                  />
                </View>
              </TouchableOpacity>
            </SwipeableItem>
          </View>
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
    marginBottom: 10,
    marginTop: 16,
    paddingHorizontal: 8,
    width: "100%",
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
  rowContainer: {
    width: "100%",
    height: 64,
    justifyContent: "center",
    paddingHorizontal: 8,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: "#e6f4f2",
    marginLeft: 20,
  },
  underlayRight: {
    backgroundColor: "#ff5c5c",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: 64,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
  },
  fullWidth: {
    width: screenWidth,
  },
});
