import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import {
  useGetPetQuery,
  useGetVaccinationsQuery,
  useAddVaccinationMutation,
  useGetEventsQuery,
  useAddEventMutation,
} from "../features/pet/petApi";

import Header from "../components/PetProfile/Header";
import ActionButtons from "../components/PetProfile/ActionButtons";
import AvatarSection from "../components/PetProfile/AvatarSection";
import InfoRow from "../components/PetProfile/InfoRow";
import VaccinationHistorySection from "../components/PetProfile/VaccinationHistorySection";
import UpcomingEventsSection from "../components/PetProfile/UpcomingEventsSection";
import AddVaccinationModal from "../components/AddVaccinationModal";
import AddEventModal from "../components/AddEventModal";

// Helper function
const capitalize = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const calculateAge = (birthDateString: string) => {
  const birthDate = new Date(birthDateString);
  const today = new Date();

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  let ageParts = [];
  if (years > 0) ageParts.push(`${years} year${years !== 1 ? "s" : ""}`);
  if (months > 0) ageParts.push(`${months} month${months !== 1 ? "s" : ""}`);
  if (ageParts.length === 0) return "Newborn";

  return ageParts.join(" ");
};

const PetProfileScreen = () => {
  const route = useRoute();
  const { petId }: any = route.params;

  const { data: pet, error, isLoading, refetch } = useGetPetQuery(petId);
  const { data: vaccinationsList = [], refetch: refetchVaccinations } =
    useGetVaccinationsQuery(petId);

  const { data: eventsList = [], refetch: refetchEvents } =
    useGetEventsQuery(petId);

  const [addVaccination] = useAddVaccinationMutation();
  const [addEvent] = useAddEventMutation();

  const [vaccinationModalVisible, setVaccinationModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);

  const handleAddVaccination = async (vaccination: {
    name: string;
    dueDate: string;
    notes?: string;
  }) => {
    try {
      await addVaccination({
        petId,
        vaccination: {
          vaccine_name: vaccination.name,
          date_administered: vaccination.dueDate,
          notes: vaccination.notes || "",
        },
      }).unwrap();

      refetchVaccinations();
      setVaccinationModalVisible(false);
    } catch (err) {
      console.error("Failed to add vaccination:", err);
    }
  };

  const handleAddEvent = async (event: {
    event_title: string;
    event_date: string;
    notes: string;
  }) => {
    try {
      await addEvent({
        petId,
        event, // keys are correct
      }).unwrap();

      refetchEvents();
      setEventModalVisible(false);
    } catch (err) {
      console.error("Failed to add event:", err);
    }
  };

  useEffect(() => {
    refetch();
    refetchVaccinations();
    refetchEvents();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00d1b2" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>Error loading pet profile.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Header />
        <AvatarSection
          image={pet.image}
          name={capitalize(pet.name)}
          details={`${capitalize(pet.type || "Unknown Type")} · ${capitalize(
            pet.gender || "Unknown Gender"
          )} · ${calculateAge(pet.birth_date)}`}
        />
        <ActionButtons />
        <Text style={styles.sectionTitle}>Information</Text>

        <InfoRow label="Breed" value={capitalize(pet.breed || "Unknown")} />
        <InfoRow label="Spayed/Neutered" value={pet.neutered ? "Yes" : "No"} />
        <InfoRow
          label="Birthday"
          value={new Date(pet.birth_date).toDateString()}
        />
        <InfoRow
          label="Weight"
          value={pet.weight ? `${pet.weight} kg` : "Unknown"}
        />
        <VaccinationHistorySection
          vaccinations={vaccinationsList.map((v: any) => ({
            name: capitalize(v.vaccine_name),
            dueDate: new Date(v.date_administered).toISOString().split("T")[0],
          }))}
          onAddPress={() => setVaccinationModalVisible(true)}
        />

        <UpcomingEventsSection
          events={eventsList.map((e: any) => ({
            title: capitalize(e.event_title),
            date: new Date(e.event_date).toISOString().split("T")[0],
            location: e.notes,
          }))}
          onAddPress={() => setEventModalVisible(true)}
        />

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* MODALS */}
      <AddVaccinationModal
        visible={vaccinationModalVisible}
        onClose={() => setVaccinationModalVisible(false)}
        onSave={handleAddVaccination}
      />

      <AddEventModal
        visible={eventModalVisible}
        onClose={() => setEventModalVisible(false)}
        onSave={handleAddEvent}
      />
    </SafeAreaView>
  );
};

export default PetProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaf7f6",
  },
  scrollContent: {
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0c1d1a",
    alignSelf: "flex-start",
    marginBottom: 10,
    marginTop: 16,
  },
});