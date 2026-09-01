import { describe, expect, it, vi } from 'vitest'
import { apiClient, shouldRetryRequest } from './client'
import { getTrip } from './trips'

describe('shouldRetryRequest', () => {
  it('does not retry a cancelled request', () => {
    expect(shouldRetryRequest(0, { code: 'ERR_CANCELED' })).toBe(false)
    expect(shouldRetryRequest(0, { name: 'CanceledError' })).toBe(false)
  })

  it('does not retry any 4xx response', () => {
    for (const status of [400, 404, 422]) {
      expect(shouldRetryRequest(0, { response: { status } })).toBe(false)
    }
  })

  it('retries a 5xx response once', () => {
    expect(shouldRetryRequest(0, { response: { status: 500 } })).toBe(true)
    expect(shouldRetryRequest(1, { response: { status: 500 } })).toBe(false)
  })

  it('retries a transport error once', () => {
    expect(shouldRetryRequest(0, { code: 'ERR_NETWORK' })).toBe(true)
    expect(shouldRetryRequest(1, { code: 'ERR_NETWORK' })).toBe(false)
  })
})

describe('getTrip', () => {
  it('forwards the abort signal to axios', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({ data: { id: 7 } })
    const controller = new AbortController()

    await getTrip('7', controller.signal)

    expect(get).toHaveBeenCalledWith('/api/trips/7', { signal: controller.signal })
  })

  it('rejects a malformed id before calling axios', async () => {
    const get = vi.spyOn(apiClient, 'get')

    await expect(getTrip('not-an-id')).rejects.toMatchObject({
      message: 'Invalid trip ID.',
      response: { status: 400 },
    })

    expect(get).not.toHaveBeenCalled()
  })
})
