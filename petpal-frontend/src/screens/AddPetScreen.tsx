import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Animated,
  ActivityIndicator,
  Platform,
  Switch,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { uploadPet } from "../utils/UploadPet";

const genderOptions = ["Male", "Female"];

const AddPetScreen = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isNeutered, setIsNeutered] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const navigation = useNavigation();
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const [buttonScale] = useState(new Animated.Value(1));

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const onSubmit = async (data: any) => {
    if (!imageUri) {
      Alert.alert("Image Required", "Please select an image for your pet");
      return;
    }
    if (!selectedGender) {
      Alert.alert("Gender Required", "Please select your pet's gender");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("breed", data.breed);
    formData.append("weight", data.weight);
    formData.append("type", data.type);
    formData.append("birth_date", birthDate.toISOString().split("T")[0]);
    formData.append("neutered", isNeutered ? "1" : "0");
    formData.append("gender", selectedGender.toLowerCase());
    formData.append("image", {
      uri: imageUri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);

    try {
      setIsLoading(true);
      await uploadPet(formData);
      Alert.alert("Success", "Pet added!");
      reset();
      setImageUri(null);
      setSelectedGender(null);
      setIsNeutered(false);
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Could not add pet");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>🐾 Add Your Pet</Text>

        {/* IMAGE */}
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {imageUri ? (
            <Animated.Image
              source={{ uri: imageUri }}
              style={[styles.previewImage, { opacity: imageOpacity }]}
            />
          ) : (
            <Text style={styles.imagePickerText}>Pick Profile Image</Text>
          )}
        </TouchableOpacity>

        <View style={styles.card}>
          {/* Name */}
          <Text style={styles.sectionTitle}>Basic Info</Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Pet Name"
                style={styles.input}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}

          {/* Breed */}
          <Controller
            control={control}
            name="breed"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Breed (e.g. Golden Retriever)"
                style={styles.input}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          {/* Type */}
          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Type (Dog, Cat, etc.)"
                style={styles.input}
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          {/* Weight */}
          <Controller
            control={control}
            name="weight"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Weight (kg)"
                style={styles.input}
                keyboardType="numeric"
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          {/* Birth Date */}
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text style={{ color: "#0c1d1a", fontSize: 16 }}>
              {birthDate ? birthDate.toDateString() : "Birth Date"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
              maximumDate={new Date()}
            />
          )}

          {/* Neutered */}
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Neutered / Spayed</Text>
            <Switch
              value={isNeutered}
              onValueChange={setIsNeutered}
              thumbColor={isNeutered ? "#00d1b2" : "#ccc"}
              trackColor={{ true: "#b9f4ec", false: "#e6f4f2" }}
            />
          </View>

          {/* Gender */}
          <Text style={styles.sectionTitle}>Gender</Text>
          <View style={styles.genderRow}>
            {genderOptions.map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.genderButton,
                  selectedGender === gender && styles.genderButtonSelected,
                ]}
                onPress={() => setSelectedGender(gender)}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    selectedGender === gender && { color: "#fff" },
                  ]}
                >
                  {gender}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit */}
        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            style={styles.button}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Add Pet</Text>
            )}
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddPetScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fcfb",
  },
  container: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    color: "#0c1d1a",
    textAlign: "center",
  },
  imagePicker: {
    backgroundColor: "#e6f4f2",
    padding: 14,
    borderRadius: 999,
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "center",
    width: 160,
    height: 160,
    justifyContent: "center",
  },
  previewImage: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: "#00d1b2",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0c1d1a",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#e6f4f2",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    fontSize: 16,
    color: "#0c1d1a",
  },
  errorText: {
    color: "#ff4d4f",
    marginBottom: 12,
    marginLeft: 4,
    fontSize: 14,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: "#0c1d1a",
  },
  genderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  genderButton: {
    flex: 1,
    backgroundColor: "#e6f4f2",
    borderRadius: 999,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: "center",
  },
  genderButtonSelected: {
    backgroundColor: "#00d1b2",
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0c1d1a",
  },
  button: {
    backgroundColor: "#00d1b2",
    padding: 16,
    borderRadius: 999,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});