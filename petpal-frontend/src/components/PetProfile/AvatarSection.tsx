import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

interface Props {
  image: string;
  name: string;
  details: string;
}

const AvatarSection = ({ image, name, details }: Props) => {
  return (
    <>
      <Image source={{ uri: image }} style={styles.avatar} />
      <Text style={styles.petName}>{name}</Text>
      <Text style={styles.petDetails}>{details}</Text>
    </>
  );
};

export default AvatarSection;

const styles = StyleSheet.create({
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  petName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0c1d1a",
  },
  petDetails: {
    fontSize: 14,
    color: "#6e7d78",
    marginBottom: 16,
  },
});