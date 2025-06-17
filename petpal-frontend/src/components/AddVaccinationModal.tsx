import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
  Dimensions,
  ScrollView,
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
      setShowDatePicker(false);
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

  const handleOpenDatePicker = () => {
    Keyboard.dismiss();
    setShowDatePicker(true);
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={[styles.modal, { width: screenWidth * 0.9 }]}>
            <ScrollView keyboardShouldPersistTaps="handled">
              <Text style={styles.title}>
                {existingVaccination ? "Update Vaccination" : "Add Vaccination"}
              </Text>

              <TextInput
                placeholder="Vaccine Name"
                placeholderTextColor="#666"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />

              <Pressable onPress={handleOpenDatePicker}>
                <View style={styles.input}>
                  <Text style={{ color: "#0c1d1a" }}>
                    {selectedDate.toISOString().split("T")[0]}
                  </Text>
                </View>
              </Pressable>

              {showDatePicker && (
                <View style={styles.pickerWrapper}>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "spinner"}
                    themeVariant="light"
                    onChange={(_, date) => {
                      if (date) setSelectedDate(date);
                      setShowDatePicker(false);
                    }}
                    style={{ width: "100%" }}
                  />
                </View>
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
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
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
    padding: 16,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    maxHeight: "90%",
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
  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
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