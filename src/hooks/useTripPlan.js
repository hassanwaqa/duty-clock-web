import { useQuery } from '@tanstack/react-query'
import { getTrip } from '../api/trips'

export const tripQueryKey = (id) => ['trip', String(id)]

export function useTripPlan(id) {
  return useQuery({
    queryKey: tripQueryKey(id),
    queryFn: ({ signal }) => getTrip(id, signal),
    enabled: Boolean(id),
    staleTime: Infinity,
  })
}
