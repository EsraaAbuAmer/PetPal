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

interface VaccinationData {
  id?: number;
  name: string;
  dueDate: string;
}

interface AddVaccinationModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (vaccination: VaccinationData) => void;
  defaultDate: Date;
  existingVaccination?: VaccinationData | null;
}

const AddVaccinationModal: React.FC<AddVaccinationModalProps> = ({
  visible,
  onClose,
  onSave,
  defaultDate,
  existingVaccination = null,
}) => {
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      if (existingVaccination) {
        setName(existingVaccination.name);
        setSelectedDate(new Date(existingVaccination.dueDate));
      } else {
        setName("");
        setSelectedDate(defaultDate || new Date());
      }
    }
  }, [visible, existingVaccination, defaultDate]);

  const handleSave = () => {
    const formattedDate = selectedDate.toISOString().split("T")[0];
    const trimmedName = name.trim();

    if (!trimmedName || !formattedDate) return;

    const payload: VaccinationData = {
      name: trimmedName,
      dueDate: formattedDate,
    };

    if (existingVaccination?.id) {
      payload.id = existingVaccination.id;
    }

    onSave(payload);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {existingVaccination ? "Update Vaccination" : "Add Vaccination"}
          </Text>

          <TextInput
            placeholder="Vaccine Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
            autoFocus
          />

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ color: "#0c1d1a" }}>
              {selectedDate.toISOString().split("T")[0]}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setSelectedDate(date);
              }}
            />
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                !(name.trim() && selectedDate) && { opacity: 0.5 },
              ]}
              onPress={handleSave}
              disabled={!name.trim() || !selectedDate}
            >
              <Text style={styles.buttonText}>
                {existingVaccination ? "Update" : "Save"}
              </Text>
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