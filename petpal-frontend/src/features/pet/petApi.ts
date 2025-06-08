import { api } from "../../services/api";

export const petApi = api.injectEndpoints({
  tagTypes: ["Pets"], // ✅ Important: enable cache invalidation

  endpoints: (builder) => ({
    addPet: builder.mutation({
      query: (formData) => ({
        url: "/pets",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Pets"], // ✅ When adding a pet → invalidate pets list
    }),

    getPets: builder.query({
      query: () => {
        return {
          url: "/pets",
          method: "GET",
        };
      },
      providesTags: ["Pets"], // ✅ Tag the pets list → so cache knows about it
    }),

    getPet: builder.query({
      query: (petId) => ({
        url: `/pets/${petId}`,
        method: "GET",
      }),
      providesTags: (result, error, petId) => [{ type: "Pets", id: petId }],
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

    updatePet: builder.mutation({
      query: ({ petId, updatedPet }) => ({
        url: `/pets/${petId}`,
        method: "PATCH",
        body: updatedPet,
      }),
      invalidatesTags: (result, error, { petId }) => [
        { type: "Pets", id: petId },
        "Pets",
      ],
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
  useUpdatePetMutation,
} = petApi;