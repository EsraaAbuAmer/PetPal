import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { useGetPetQuery } from "../features/pet/petApi";

import Header from "../components/PetProfile/Header";
import ActionButtons from "../components/PetProfile/ActionButtons";
import AvatarSection from "../components/PetProfile/AvatarSection";
import InfoRow from "../components/PetProfile/InfoRow";
import VaccinationHistorySection from "../components/PetProfile/VaccinationHistorySection";
import UpcomingEventsSection from "../components/PetProfile/UpcomingEventsSection";

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

// TEMP placeholders
const vaccinations = [
  { name: "Rabies", dueDate: "2023-01-10" },
  { name: "DAPPv", dueDate: "2023-01-10" },
];

const events = [
  { title: "Grooming", date: "Jan 10, 2023", location: "Pawsh Wash" },
  { title: "Grooming", date: "Feb 15, 2023", location: "Pet Spa" },
];

const PetProfileScreen = () => {
  const route = useRoute();
  const { petId }: any = route.params;

  const { data: pet, error, isLoading, refetch } = useGetPetQuery(petId);

  useEffect(() => {
    refetch();
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
          name={pet.name}
          details={`Golden Retriever · Female · ${calculateAge(pet.birth_date)}`}
        />
        <ActionButtons />
        <Text style={styles.sectionTitle}>Information</Text>
        <InfoRow label="Spayed/Neutered" value="Yes" />
        <InfoRow label="Birthday" value={new Date(pet.birth_date).toDateString()} />
        <InfoRow label="Weight" value="47 lbs" />
        <VaccinationHistorySection vaccinations={vaccinations} />
        <UpcomingEventsSection events={events} />
        <View style={{ height: 30 }} />
      </ScrollView>
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