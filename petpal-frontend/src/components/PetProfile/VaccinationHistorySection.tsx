import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VaccinationRow from "./VaccinationRow";

interface Props {
  vaccinations: { name: string; dueDate: string }[];
  onAddPress: () => void;
}

const VaccinationHistorySection = ({ vaccinations, onAddPress }: Props) => {
  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Vaccination History</Text>
        <TouchableOpacity onPress={onAddPress}>
          <Ionicons name="add-circle-outline" size={24} color="#00d1b2" />
        </TouchableOpacity>
      </View>

      {vaccinations.length === 0 ? (
        <Text style={styles.emptyText}>No vaccinations yet.</Text>
      ) : (
        vaccinations.map((v, index) => (
          <VaccinationRow key={index} name={v.name} dueDate={v.dueDate}  />
        ))
      )}
    </>
  );
};

export default VaccinationHistorySection;

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