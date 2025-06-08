import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  Switch,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

interface EditPetModalProps {
  visible: boolean;
  onClose: () => void;
  petData: any;
  onSave: (updatedPet: any, newImageUri: string | null) => void;
}

const EditPetModal: React.FC<EditPetModalProps> = ({
  visible,
  onClose,
  petData,
  onSave,
}) => {
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");
  const [neutered, setNeutered] = useState(false);
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [imageUri, setImageUri] = useState<string>("");

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (petData) {
      setName(petData.name || "");
      setBreed(petData.breed || "");
      setWeight(petData.weight?.toString() || "");
      setType(petData.type || "");
      setGender(petData.gender || "");
      setNeutered(!!petData.neutered);
      setBirthDate(
        petData.birth_date ? new Date(petData.birth_date) : new Date()
      );
      setImageUri(petData.image || "");
    }
  }, [petData]);

  const handleDateChange = (_event: any, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      setBirthDate(selected);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!petData) return;
    onSave(
      {
        id: petData.id,
        name,
        breed,
        weight: parseFloat(weight) || 0,
        type,
        birth_date: birthDate.toISOString().split("T")[0],
        neutered,
        gender,
      },
      imageUri
    );
    onClose();
  };

  return (
    <Modal
      key={petData?.id || "new-pet"}
      visible={!!visible && !!petData}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 8 }}
          >
            <Text style={styles.title}>Edit Pet Profile</Text>

            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.imagePicker}
            >
              {imageUri && typeof imageUri === "string" ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.previewImage}
                />
              ) : (
                <Text style={styles.imagePickerText}>Pick Image</Text>
              )}
            </TouchableOpacity>

            <TextInput
              placeholder="Pet Name"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Breed"
              style={styles.input}
              value={breed}
              onChangeText={setBreed}
            />
            <TextInput
              placeholder="Weight (kg)"
              style={styles.input}
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
            <TextInput
              placeholder="Type (e.g. Dog, Cat)"
              style={styles.input}
              value={type}
              onChangeText={setType}
            />
            <TextInput
              placeholder="Gender (Male/Female)"
              style={styles.input}
              value={gender}
              onChangeText={setGender}
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Neutered:</Text>
              <Switch
                value={neutered}
                onValueChange={setNeutered}
                trackColor={{ false: "#ccc", true: "#00d1b2" }}
                thumbColor={
                  Platform.OS === "android"
                    ? neutered
                      ? "#00d1b2"
                      : "#f4f3f4"
                    : undefined
                }
              />
            </View>

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[styles.input, { justifyContent: "center" }]}
            >
              <Text style={{ color: "#0c1d1a" }}>
                {isNaN(birthDate.getTime())
                  ? "Select Birth Date"
                  : birthDate.toDateString()}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={birthDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDateChange}
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
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default EditPetModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    width: "100%",
    maxWidth: 500,
    maxHeight: "90%",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0c1d1a",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f7fafa",
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: "#0c1d1a",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#d8e1e0",
  },
  imagePicker: {
    alignSelf: "center",
    marginBottom: 16,
  },
  imagePickerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00d1b2",
    textAlign: "center",
  },
  previewImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: "#00d1b2",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f7fafa",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#d8e1e0",
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0c1d1a",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "#f1f5f4",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: "#00d1b2",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 999,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: "#0c1d1a",
    fontWeight: "700",
    fontSize: 15,
    textAlign: "center",
  },
});