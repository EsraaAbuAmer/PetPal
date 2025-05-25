// src/services/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const petPalApi = createApi({
  reducerPath: 'petPalApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),
  endpoints: (builder) => ({
    getPets: builder.query<any, void>({
      query: () => '/pets',
    }),
  }),
});

export const { useGetPetsQuery } = petPalApi;