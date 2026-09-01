import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

// DRF reports failures as {detail}, {error}, or {field: [messages]} depending on
// where they were raised. Flattening them here means every screen can just show
// error.message instead of re-guessing the shape.
function readApiMessage(data) {
  if (!data) return null
  if (typeof data === 'string') return data
  if (data.detail) return data.detail
  if (data.error) return data.error
  if (data.message) return data.message

  const fieldErrors = Object.entries(data).flatMap(([field, messages]) =>
    [].concat(messages).map((message) => `${field}: ${message}`),
  )
  return fieldErrors.length ? fieldErrors.join(' · ') : null
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = readApiMessage(error.response.data)
      error.message = message ?? `Request failed with status ${error.response.status}`
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Could not reach the planning service. Check that the API is running.'
    }
    return Promise.reject(error)
  },
)

// A cancelled request is an intentional teardown and a 4xx is a deterministic
// answer; retrying either only doubles the traffic and the time to show an error.
export function shouldRetryRequest(failureCount, error, maxRetries = 1) {
  if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError') return false

  const status = error?.response?.status
  if (status >= 400 && status < 500) return false

  return failureCount < maxRetries
}
