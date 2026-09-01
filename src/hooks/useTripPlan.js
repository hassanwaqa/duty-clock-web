import { useQuery } from '@tanstack/react-query'
import { getTrip } from '../api/trips'

// One definition of the key, so a trip seeded by the planner and a trip read by
// the result page can never land in two different cache entries.
export const tripQueryKey = (id) => ['trip', String(id)]

export function useTripPlan(id) {
  return useQuery({
    queryKey: tripQueryKey(id),
    // Taking `signal` is what makes the request cancellable: React Query only
    // aborts a fetch on unmount if the query function actually consumed it.
    queryFn: ({ signal }) => getTrip(id, signal),
    enabled: Boolean(id),
    // A planned trip is immutable — the API creates and reads them, never
    // updates them — so cached trip data never needs refetching, including the
    // copy the plan mutation just seeded.
    staleTime: Infinity,
  })
}
