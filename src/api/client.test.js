import { describe, expect, it, vi } from 'vitest'
import { apiClient, shouldRetryRequest } from './client'
import { resetNetwork, stubNetwork } from '../test/networkStub'
import { searchLocations } from './locations'
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

describe('searchLocations', () => {
  it('sends the query and abort signal without exposing a provider key', async () => {
    const get = vi.spyOn(apiClient, 'get').mockResolvedValue({
      data: { results: ['Chicago, IL, USA'] },
    })
    const controller = new AbortController()

    await expect(searchLocations('Chic', controller.signal)).resolves.toEqual([
      'Chicago, IL, USA',
    ])
    expect(get).toHaveBeenCalledWith('/api/trips/locations', {
      params: { q: 'Chic' },
      signal: controller.signal,
    })
  })
})

describe('readApiMessage via the response interceptor', () => {
  const reject = async (status, data) => {
    const stub = stubNetwork({ status, body: data })
    try {
      await getTrip('1')
      throw new Error('expected a rejection')
    } catch (error) {
      return error.message
    } finally {
      resetNetwork()
      void stub
    }
  }

  it('shows a short DRF detail as-is', async () => {
    expect(await reject(404, { detail: 'Trip not found.' })).toBe('Trip not found.')
  })

  it('never renders a server error page, so tracebacks stay out of the UI', async () => {
    const traceback = `BadStatusLine at /api/trips/plan\n${'Traceback line\n'.repeat(80)}`
    expect(await reject(500, traceback)).toBe(
      'The planning service hit an unexpected error (HTTP 500). Please try again.',
    )
  })

  it('never renders an HTML error body', async () => {
    expect(await reject(502, '<html><body>Bad Gateway</body></html>')).toBe(
      'The planning service hit an unexpected error (HTTP 502). Please try again.',
    )
  })
})
