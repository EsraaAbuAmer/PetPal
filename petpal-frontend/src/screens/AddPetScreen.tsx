import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { useAddPetMutation } from '../features/pet/petApi';
import { useNavigation } from '@react-navigation/native';
import { uploadPet } from '../utils/UploadPet';
const AddPetScreen = () => {
  const { control, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const navigation = useNavigation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };
  const onSubmit = async (data: any) => {
    if (!imageUri) {
      Alert.alert('Image Required', 'Please select an image for your pet');
      return;
    }
  
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('age', data.age);
    formData.append('image', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);
  
    try {
      setIsLoading(true);
      await uploadPet(formData);
      Alert.alert('Success', 'Pet added!');
      reset();
      setImageUri(null);
      navigation.goBack();
    } catch (err) {
      console.log("Upload error", err);
      Alert.alert('Error', 'Could not add pet');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Pet</Text>

      <Controller
        control={control}
        name="name"
        rules={{ required: 'Name required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="Pet Name" style={styles.input} onChangeText={onChange} value={value} />
        )}
      />

      <Controller
        control={control}
        name="age"
        rules={{ required: 'Age required' }}
        render={({ field: { onChange, value } }) => (
          <TextInput placeholder="Pet Age" style={styles.input} keyboardType="numeric" onChangeText={onChange} value={value} />
        )}
      />

      {/* Select Image */}
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        <Text style={styles.imagePickerText}>{imageUri ? 'Change Image' : 'Pick Image from Gallery'}</Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
      )}

      {/* Submit */}
      <TouchableOpacity onPress={handleSubmit(onSubmit)} style={styles.button}>
        <Text style={styles.buttonText}>{isLoading ? 'Adding...' : 'Add Pet'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddPetScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fcfb' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#0c1d1a' },
  input: {
    backgroundColor: '#e6f4f2',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    color: '#0c1d1a',
  },
  button: {
    backgroundColor: '#00d1b2',
    padding: 14,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  imagePicker: {
    backgroundColor: '#e6f4f2',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePickerText: {
    color: '#0c1d1a',
    fontWeight: '500',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
});