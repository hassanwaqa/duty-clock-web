import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

const MAX_MESSAGE_LENGTH = 300

function readApiMessage(data) {
  if (!data) return null
  if (typeof data === 'string') {
    const trimmed = data.trim()
    if (!trimmed || trimmed.startsWith('<') || trimmed.length > MAX_MESSAGE_LENGTH) return null
    return trimmed
  }
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
      const { status } = error.response
      const message = readApiMessage(error.response.data)
      error.message =
        message ??
        (status >= 500
          ? `The planning service hit an unexpected error (HTTP ${status}). Please try again.`
          : `Request failed with status ${status}`)
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Could not reach the planning service. Check that the API is running.'
    }
    return Promise.reject(error)
  },
)

export function shouldRetryRequest(failureCount, error, maxRetries = 1) {
  if (error?.code === 'ERR_CANCELED' || error?.name === 'CanceledError') return false

  const status = error?.response?.status
  if (status >= 400 && status < 500) return false

  return failureCount < maxRetries
}
