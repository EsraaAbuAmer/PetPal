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
    getVaccinations: builder.query({
      query: (petId: number) => `/pets/${petId}/vaccinations`,
    }),
    addVaccination: builder.mutation({
      query: ({ petId, vaccination }) => ({
        url: `/pets/${petId}/vaccinations`,
        method: "POST",
        body: vaccination,
      }),
    }),
    getEvents: builder.query({
      query: (petId: number) => `/pets/${petId}/events`,
    }),
    addEvent: builder.mutation({
      query: ({ petId, event }) => ({
        url: `/pets/${petId}/events`,
        method: "POST",
        body: event,
      }),
    }),
  }),

  overrideExisting: true,
});

export const {
  useAddPetMutation,
  useGetPetsQuery,
  useGetPetQuery,
  useGetVaccinationsQuery,
  useAddVaccinationMutation,
  useGetEventsQuery,
  useAddEventMutation,
} = petApi;