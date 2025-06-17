import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SwipeableItem, { OpenDirection } from "react-native-swipeable-item";
import Animated from "react-native-reanimated";
import VaccinationRow from "./VaccinationRow";

const screenWidth = Dimensions.get("window").width;

interface Vaccination {
  id: number;
  name: string;
  dueDate: string;
}

interface Props {
  vaccinations: Vaccination[];
  onAddPress: () => void;
  onEditPress: (vaccination: Vaccination) => void;
  onDeletePress: (id: number) => void;
}

const VaccinationHistorySection = ({
  vaccinations,
  onAddPress,
  onEditPress,
  onDeletePress,
}: Props) => {
  const itemRefs = useRef(new Map<number, SwipeableItem<Vaccination>>());

  const renderUnderlayRight = (item: Vaccination) => (
    <Animated.View style={[styles.underlayRight, { alignSelf: "flex-end" }]}>
      <TouchableOpacity onPress={() => onDeletePress(item.id)}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Vaccination History</Text>
        <TouchableOpacity onPress={onAddPress}>
          <Ionicons name="add-circle-outline" size={24} color="#00d1b2" />
        </TouchableOpacity>
      </View>

      {vaccinations.length === 0 ? (
        <Text style={styles.emptyText}>No vaccinations yet.</Text>
      ) : (
        vaccinations.map((item) => (
          <View style={styles.fullWidth} key={item.id}>
            <SwipeableItem
              item={item}
              ref={(ref) => {
                if (ref && !itemRefs.current.get(item.id)) {
                  itemRefs.current.set(item.id, ref);
                }
              }}
              overSwipe={20}
              snapPointsLeft={[80]} // Disable swipe from left
              renderUnderlayLeft={() => renderUnderlayRight(item)}
              onChange={({ openDirection }) => {
                if (openDirection !== OpenDirection.NONE) {
                  [...itemRefs.current.entries()].forEach(([key, ref]) => {
                    if (key !== item.id && ref?.close) ref.close();
                  });
                }
              }}
            >
              <TouchableOpacity
                onPress={() => onEditPress(item)}
                activeOpacity={0.8}
              >
                <View style={styles.rowContainer}>
                  <VaccinationRow name={item.name} dueDate={item.dueDate} />
                </View>
              </TouchableOpacity>
            </SwipeableItem>
          </View>
        ))
      )}
    </View>
  );
};

export default VaccinationHistorySection;

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 16,
    paddingHorizontal: 8,
    marginLeft: 15,
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
