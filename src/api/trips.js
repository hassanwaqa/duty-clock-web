import { apiClient } from './client'

export async function planTrip({ payload, idempotencyKey }) {
  const { data } = await apiClient.post('/api/trips/plan', payload, {
    headers: { 'Idempotency-Key': idempotencyKey },
  })
  return data
}

export async function getTrip(id, signal) {
  const normalizedId = String(id)
  if (!/^\d+$/.test(normalizedId)) {
    const error = new Error('Invalid trip ID.')
    error.response = { status: 400, data: { detail: error.message } }
    throw error
  }

  const { data } = await apiClient.get(`/api/trips/${normalizedId}`, { signal })
  return data
}
