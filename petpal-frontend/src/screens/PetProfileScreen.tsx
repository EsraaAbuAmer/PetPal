import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";

import {
  useGetPetQuery,
  useGetVaccinationsQuery,
  useAddVaccinationMutation,
  useUpdateVaccinationMutation,
  useDeleteVaccinationMutation,
  useGetEventsQuery,
  useAddEventMutation,
  useDeleteEventMutation,
  useUpdateEventMutation,
} from "../features/pet/petApi";

import Header from "../components/PetProfile/Header";
import ActionButtons from "../components/PetProfile/ActionButtons";
import AvatarSection from "../components/PetProfile/AvatarSection";
import InfoRow from "../components/PetProfile/InfoRow";
import VaccinationHistorySection from "../components/PetProfile/VaccinationHistorySection";
import UpcomingEventsSection from "../components/PetProfile/UpcomingEventsSection";
import AddVaccinationModal from "../components/AddVaccinationModal";
import AddOrEditEventModal from "../components/AddOrEditEventModal";
import EditPetModal from "../components/EditPetModal";

const capitalize = (str: string) =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const calculateAge = (birthDateString: string) => {
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  if (months < 0) {
    years--;
    months += 12;
  }
  const ageParts = [];
  if (years > 0) ageParts.push(`${years} year${years !== 1 ? "s" : ""}`);
  if (months > 0) ageParts.push(`${months} month${months !== 1 ? "s" : ""}`);
  return ageParts.length === 0 ? "Newborn" : ageParts.join(" ");
};

const PetProfileScreen = () => {
  const { petId }: any = useRoute().params;
  const navigation = useNavigation();
  const userToken = useSelector((state: any) => state.auth.token);

  const { data: pet, isLoading, error, refetch } = useGetPetQuery(petId);
  const { data: vaccinationsList = [], refetch: refetchVaccinations } =
    useGetVaccinationsQuery(petId);
  const { data: eventsList = [], refetch: refetchEvents } =
    useGetEventsQuery(petId);

  const [addVaccination] = useAddVaccinationMutation();
  const [updateVaccination] = useUpdateVaccinationMutation();
  const [deleteVaccination] = useDeleteVaccinationMutation();
  const [addEvent] = useAddEventMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [deleteEvent] = useDeleteEventMutation();

  const [vaccinationModalVisible, setVaccinationModalVisible] = useState(false);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const [selectedPet, setSelectedPet] = useState<any>(null);
  const [editingVaccination, setEditingVaccination] = useState<any>(null);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  const [defaultVaccinationDate, setDefaultVaccinationDate] = useState(new Date());
  const [defaultEventDate, setDefaultEventDate] = useState(new Date());

  const handleOpenEditModal = () => {
    setSelectedPet(pet);
    setEditModalVisible(true);
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await deleteEvent(eventId).unwrap();
      refetchEvents();
    } catch (err) {
      Alert.alert("Error", "Could not delete event");
    }
  };

  const handleEditPet = async (updatedPet: any, newImageUri: string | null) => {
    try {
      const formData = new FormData();
      formData.append("name", updatedPet.name);
      formData.append("breed", updatedPet.breed);
      formData.append("weight", updatedPet.weight.toString());
      formData.append("type", updatedPet.type);
      formData.append("birth_date", updatedPet.birth_date);
      formData.append("neutered", updatedPet.neutered ? "1" : "0");
      formData.append("gender", updatedPet.gender);

      const imageIsLocal = newImageUri?.startsWith("file://");
      if (imageIsLocal) {
        formData.append("image", {
          uri: newImageUri,
          name: "photo.jpg",
          type: "image/jpeg",
        } as any);
      } else if (newImageUri) {
        formData.append("image_url", newImageUri);
      }

      await fetch(`http://localhost:5002/api/pets/${updatedPet.id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${userToken}` },
        body: formData,
      });

      refetch();
      setEditModalVisible(false);
      Alert.alert("Success", "Pet updated successfully!");
    } catch (err) {
      console.error("Failed to update pet:", err);
      Alert.alert("Error", "Failed to update pet");
    }
  };

  const handleAddOrUpdateVaccination = async (vaccination: {
    id?: number;
    name: string;
    dueDate: string;
    notes?: string;
  }) => {
    try {
      if (vaccination.id) {
        await updateVaccination({
          vaccinationId: vaccination.id,
          updatedVaccination: {
            vaccine_name: vaccination.name,
            date_administered: vaccination.dueDate,
            notes: vaccination.notes || "",
          },
        }).unwrap();
      } else {
        await addVaccination({
          petId,
          vaccination: {
            vaccine_name: vaccination.name,
            date_administered: vaccination.dueDate,
            notes: vaccination.notes || "",
          },
        }).unwrap();
      }

      refetchVaccinations();
      setVaccinationModalVisible(false);
      setEditingVaccination(null);
    } catch (err) {
      console.error("Failed to save vaccination:", err);
    }
  };

  const handleDeleteVaccination = async (id: number) => {
    try {
      await deleteVaccination(id).unwrap();
      refetchVaccinations();
    } catch (err) {
      console.error("Failed to delete vaccination:", err);
      Alert.alert("Error", "Could not delete vaccination");
    }
  };

  const handleSaveEvent = async (eventData) => {
    try {
      if (editingEvent?.id) {
        await updateEvent({
          eventId: editingEvent.id,
          updatedEvent: eventData,
        }).unwrap();
      } else {
        await addEvent({ petId, event: eventData }).unwrap();
      }

      setEventModalVisible(false);
      setEditingEvent(null);
      refetchEvents();
    } catch (err) {
      console.error("Failed to save event:", err);
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
          details={`${capitalize(pet.type)} · ${capitalize(
            pet.gender
          )} · ${calculateAge(pet.birth_date)}`}
        />
        <ActionButtons
          onEditPress={handleOpenEditModal}
          onAddPetPress={() =>
            navigation.navigate("MainTabs", { screen: "AddPet" })
          }
        />
        <Text style={styles.sectionTitle}>Information</Text>
        <InfoRow label="Breed" value={capitalize(pet.breed)} />
        <InfoRow label="Spayed/Neutered" value={pet.neutered ? "Yes" : "No"} />
        <InfoRow
          label="Birthday"
          value={new Date(pet.birth_date).toDateString()}
        />
        <InfoRow label="Weight" value={`${pet.weight} kg`} />

        <VaccinationHistorySection
          vaccinations={vaccinationsList.map((v: any) => ({
            id: v.id,
            name: capitalize(v.vaccine_name),
            dueDate: new Date(v.date_administered).toISOString().split("T")[0],
          }))}
          onAddPress={() => {
            setEditingVaccination(null);
            setDefaultVaccinationDate(new Date());
            setVaccinationModalVisible(true);
          }}
          onEditPress={(v) => {
            setEditingVaccination(v);
            setDefaultVaccinationDate(new Date(v.dueDate));
            setVaccinationModalVisible(true);
          }}
          onDeletePress={handleDeleteVaccination}
        />

        <UpcomingEventsSection
          events={eventsList.map((e: any) => ({
            id: e.id,
            title: capitalize(e.event_title),
            date: new Date(e.event_date).toISOString().split("T")[0],
            notes: e.notes,
          }))}
          onAddPress={() => {
            setEditingEvent(null);
            setDefaultEventDate(new Date());
            setEventModalVisible(true);
          }}
          onEditPress={(ev) => {
            setEditingEvent(ev);
            setDefaultEventDate(new Date(ev.date));
            setEventModalVisible(true);
          }}
          onDeletePress={handleDeleteEvent}
        />

        <View style={{ height: 30 }} />
      </ScrollView>

      <AddVaccinationModal
        visible={vaccinationModalVisible}
        onClose={() => {
          setVaccinationModalVisible(false);
          setEditingVaccination(null);
        }}
        onSave={handleAddOrUpdateVaccination}
        defaultDate={defaultVaccinationDate}
        existingVaccination={editingVaccination}
      />
      <AddOrEditEventModal
        visible={eventModalVisible}
        onClose={() => {
          setEventModalVisible(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        defaultDate={defaultEventDate}
        existingEvent={editingEvent}
      />

      <EditPetModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        petData={selectedPet}
        onSave={handleEditPet}
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
