import { useMutation, useQueryClient } from '@tanstack/react-query'
import { planTrip } from '../api/trips'
import { tripQueryKey } from './useTripPlan'

export function usePlanTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: planTrip,
    // The response already is the trip the result page asks for, so seeding the
    // cache lets /trips/:id render on arrival instead of refetching what we hold.
    onSuccess: (trip) => queryClient.setQueryData(tripQueryKey(trip.id), trip),
  })
}
