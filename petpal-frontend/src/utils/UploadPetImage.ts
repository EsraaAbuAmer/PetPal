// utils/UploadPetImage.ts

import axios from 'axios';
import * as FileSystem from 'expo-file-system';

export const uploadPetImage = async (imageUri: string): Promise<string> => {
  const formData = new FormData();

  formData.append('image', {
    uri: imageUri,
    name: 'photo.jpg',
    type: 'image/jpeg',
  } as any);

  const response = await axios.post(
    'http://192.168.1.XYZ:5002/api/pets/upload-image', 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.imageUrl;
};