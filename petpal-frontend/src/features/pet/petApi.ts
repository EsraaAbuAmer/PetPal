import { api } from "../../services/api";

export const petApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addPet: builder.mutation({
      query: (formData) => ({
        url: "/pets",
        method: "POST",
        body: formData,
      }),
    }),
    getPets: builder.query({
      query: () => {
        return {
          url: "/pets",
          method: "GET",
        };
      },
    }),
    getPet: builder.query({
      query: (petId) => ({
        url: `/pets/${petId}`,
        method: "GET",
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useAddPetMutation, useGetPetsQuery, useGetPetQuery } = petApi;
