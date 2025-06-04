import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const upcoming = [
  {
    id: '1',
    name: 'Sunny',
    type: 'Checkup',
    image: { uri: 'https://placedog.net/300/300?id=20' },
    time: 'in 2d',
  },
  {
    id: '2',
    name: 'Rocket',
    type: 'Checkup',
    image: { uri: 'https://placedog.net/300/300?id=15' },
    time: 'in 6d',
  },

];

const pets = [
  {
    id: '1',
    name: 'Sunny',
    age: 2,
    image: { uri: 'https://placedog.net/300/300?id=20' },
  },
  {
    id: '2',
    name: 'Rocket',
    age: 1,
    image: { uri: 'https://placedog.net/300/300?id=15' },
  },
];

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Home</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#0c1d1a" />
        </TouchableOpacity>
      </View>

      {/* Upcoming */}
      <Text style={styles.sectionTitle}>Upcoming</Text>
      <FlatList
        data={upcoming}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.rowItem}>
            <Image source={item.image} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.subtitle}>{item.type}</Text>
            </View>
            <Text style={styles.time}>{item.time}</Text>
          </View>
        )}
        contentContainerStyle={styles.listPadding}
      />

      {/* Your Pets */}
      <Text style={styles.sectionTitle}>Your Pets</Text>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.rowItem}>
            <Image source={item.image} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
            </View>
            <Text style={styles.time}>Age: {item.age}</Text>
          </View>
        )}
        contentContainerStyle={styles.listPadding}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fcfb',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0c1d1a',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0c1d1a',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  listPadding: {
    paddingHorizontal: 20,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0c1d1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#6e7d78',
    marginTop: 2,
  },
  time: {
    fontSize: 14,
    color: '#a1a8a4',
  },
});