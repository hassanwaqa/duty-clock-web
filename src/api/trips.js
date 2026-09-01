import { apiClient } from './client'

export async function planTrip(payload) {
  const { data } = await apiClient.post('/api/trips/plan', payload)
  return data
}

export async function getTrip(id, signal) {
  const { data } = await apiClient.get(`/api/trips/${id}`, { signal })
  return data
}
