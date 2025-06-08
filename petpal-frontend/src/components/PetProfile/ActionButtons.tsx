import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ActionButtonsProps {
  onEditPress: () => void;
  onAddPetPress?: () => void; // optional
}

const ActionButtons = ({ onEditPress, onAddPetPress }: ActionButtonsProps) => {
  return (
    <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Text style={styles.editButtonText}>Edit profile</Text>
        </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={onAddPetPress}>
        <Text style={styles.addButtonText}>Add pet</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionButtons;

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  editButton: {
    backgroundColor: "#f1f5f4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  editButtonText: {
    color: "#0c1d1a",
    fontWeight: "600",
    fontSize: 14,
  },
  addButton: {
    backgroundColor: "#00d1b2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
