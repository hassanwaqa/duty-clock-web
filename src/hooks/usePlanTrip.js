import { useMutation, useQueryClient } from '@tanstack/react-query'
import { planTrip } from '../api/trips'
import { tripQueryKey } from './useTripPlan'

export const PLAN_TRIP_MUTATION_KEY = ['plan-trip']

export function usePlanTrip() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: PLAN_TRIP_MUTATION_KEY,
    mutationFn: planTrip,
    onSuccess: (trip) => queryClient.setQueryData(tripQueryKey(trip.id), trip),
  })
}
