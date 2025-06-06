import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VaccinationRow from "./VaccinationRow";

interface Props {
  vaccinations: { name: string; dueDate: string }[];
}

const VaccinationHistorySection = ({ vaccinations }: Props) => {
  return (
    <>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Vaccination History</Text>
        <TouchableOpacity onPress={() => { /* Add Vaccination logic */ }}>
          <Ionicons name="add-circle-outline" size={24} color="#00d1b2" />
        </TouchableOpacity>
      </View>
      {vaccinations.map((v, index) => (
        <VaccinationRow key={index} name={v.name} dueDate={v.dueDate} />
      ))}
    </>
  );
};

export default VaccinationHistorySection;

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