import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface AddVaccinationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (vaccination: { name: string; dueDate: string }) => void;
  defaultDate: Date;
}

const AddVaccinationModal: React.FC<AddVaccinationModalProps> = ({
  visible,
  onClose,
  onSave,
  defaultDate,
}) => {
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setSelectedDate(defaultDate || new Date());
    }
  }, [visible, defaultDate]);

  const handleSave = () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    if (name && formattedDate) {
      onSave({ name, dueDate: formattedDate });
      setName("");
      setSelectedDate(new Date());
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Add Vaccination</Text>
          <TextInput
            placeholder="Vaccine Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: selectedDate ? "#0c1d1a" : "#45a193" }}>
              {selectedDate
                ? selectedDate.toISOString().split("T")[0]
                : "Select Due Date"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) {
                  setSelectedDate(date);
                }
              }}
            />
          )}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddVaccinationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    width: "85%",
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0c1d1a",
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#e6f4f2",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#0c1d1a",
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: "#f1f5f4",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  saveButton: {
    backgroundColor: "#00d1b2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
  },
  buttonText: {
    color: "#0c1d1a",
    fontWeight: "600",
    fontSize: 14,
  },
});