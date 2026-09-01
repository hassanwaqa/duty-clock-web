import { apiClient } from './client'

export async function searchLocations(query, signal) {
  const { data } = await apiClient.get('/api/trips/locations', {
    params: { q: query },
    signal,
  })
  return Array.isArray(data?.results) ? data.results : []
}
