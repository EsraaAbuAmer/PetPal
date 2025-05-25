import { configureStore } from '@reduxjs/toolkit';
import { petPalApi } from './services/api';

export const store = configureStore({
  reducer: {
    [petPalApi.reducerPath]: petPalApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(petPalApi.middleware),
});