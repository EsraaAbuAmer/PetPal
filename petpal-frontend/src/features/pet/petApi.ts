import { api } from "../../services/api";

export const petApi = api.injectEndpoints({
  tagTypes: ["Pets", "Events"], // ✅ Important: enable cache invalidation

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
      invalidatesTags: ["Events"],
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
    getUpcomingEvents: builder.query({
      query: () => `/events/upcoming`,
      providesTags: ["Events"],
    }),
    updateVaccination: builder.mutation({
      query: ({ vaccinationId, updatedVaccination }) => ({
        url: `/vaccinations/${vaccinationId}`,
        method: "PATCH",
        body: updatedVaccination,
      }),
      invalidatesTags: ["Pets"], // So pet data refreshes
    }),

    deleteVaccination: builder.mutation({
      query: (vaccinationId) => ({
        url: `/vaccinations/${vaccinationId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pets"],
    }),
    updateEvent: builder.mutation({
      query: ({ eventId, updatedEvent }) => ({
        url: `/events/${eventId}`,
        method: "PATCH",
        body: updatedEvent,
      }),
      invalidatesTags: ["Events"],
    }),

    deleteEvent: builder.mutation({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),
    deletePet: builder.mutation({
      query: (petId) => ({
        url: `/pets/${petId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Pets", "Events"],
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
  useGetUpcomingEventsQuery,
  useUpdateVaccinationMutation,
  useDeleteVaccinationMutation,
  useUpdateEventMutation, // ✅ NEW
  useDeleteEventMutation,
  useDeletePetMutation
} = petApi;
