import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useGetPetsQuery } from "../features/pet/petApi";

const upcoming = [
  {
    id: "1",
    name: "Sunny",
    type: "🩺 Checkup",
    image: { uri: "https://placedog.net/300/300?id=20" },
    time: "in 2d",
  },
  {
    id: "2",
    name: "Rocket",
    type: "💊 Medication",
    image: { uri: "https://placedog.net/300/300?id=15" },
    time: "in 6d",
  },
];



const healthTips = [
  "🧼 Bathe your dog monthly to keep their coat clean and healthy.",
  "🪥 Brush your pet’s teeth 2-3 times per week to prevent dental issues.",
  "🏃 Regular exercise helps prevent obesity and keeps your pet happy.",
  "💧 Always keep fresh water available throughout the day.",
  "🦴 Provide proper chew toys to support dental hygiene.",
];

const HomeScreen = () => {

  
  const { data: pets = [], error, isLoading } = useGetPetsQuery(undefined);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Home</Text>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={24} color="#0c1d1a" />
          </TouchableOpacity>
        </View>

        {/* Upcoming */}
        <Text style={styles.sectionTitle}>Upcoming</Text>
        <Text style={styles.sectionSubtitle}>
          Don’t forget these important tasks 🗓️
        </Text>
        {upcoming.map((item) => (
          <View style={styles.card} key={item.id}>
            <Image source={item.image} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.subtitle}>{item.type}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.time}</Text>
            </View>
          </View>
        ))}

        {/* Your Pets */}
        <Text style={styles.sectionTitle}>Your Pets</Text>
        <Text style={styles.sectionSubtitle}>
          Say hello to your furry family 🐾
        </Text>
        {isLoading ? (
          <Text>Loading pets...</Text>
        ) : pets.length === 0 ? (
          <Text style={{ color: "#6e7d78" }}>No pets yet. Add one!</Text>
        ) : (
          pets.map((item: any) => (
            <View style={styles.card} key={item.id}>
              <Image
                source={{ uri: item.image }}
                style={styles.avatarBordered}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
              </View>
              <Text style={styles.time}>Age: {item.age}</Text>
            </View>
          ))
        )}

        
        {/* Health Tips */}
        <Text style={styles.sectionTitle}>Health Tips</Text>
        <Text style={styles.sectionSubtitle}>
          Daily care makes happy pets 🧠
        </Text>
        {healthTips.map((tip, index) => (
          <View style={styles.tipCard} key={index}>
            <Text style={styles.subtitle}>{tip}</Text>
          </View>
        ))}

        {/* Bottom Padding */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fcfb",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0c1d1a",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0c1d1a",
    marginTop: 24,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#6e7d78",
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 12,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarBordered: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#00d1b2",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0c1d1a",
  },
  subtitle: {
    fontSize: 14,
    color: "#6e7d78",
    marginTop: 2,
  },
  time: {
    fontSize: 14,
    color: "#45a193",
    fontWeight: "500",
  },
  badge: {
    backgroundColor: "#e6f4f2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#00b89c",
  },
  tipCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
});
