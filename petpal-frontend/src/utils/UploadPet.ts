import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig?.extra?.API_URL;

export const uploadPet = async (formData: FormData) => {
  const token = await AsyncStorage.getItem('token');
console.log("data",formData,API_URL)
  return axios.post(`${API_URL}/pets`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
};