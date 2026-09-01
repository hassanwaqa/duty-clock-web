import { apiClient } from '../api/client'

const realAdapter = apiClient.defaults.adapter

// Swaps axios's transport for a controllable one so tests can observe the real
// client -> trips -> hook chain (including abort handling) without a network.
export function stubNetwork({ delayMs = 0, status = 200, body = {} } = {}) {
  const calls = []
  let inFlight = 0
  let maxInFlight = 0

  apiClient.defaults.adapter = (config) =>
    new Promise((resolve, reject) => {
      const call = { url: config.url, method: config.method, aborted: false, settled: false }
      calls.push(call)
      inFlight += 1
      maxInFlight = Math.max(maxInFlight, inFlight)

      const timer = setTimeout(() => {
        inFlight -= 1
        call.settled = true
        if (status >= 400) {
          const error = new Error(`Request failed with status ${status}`)
          error.response = { status, data: body }
          error.config = config
          reject(error)
          return
        }
        resolve({ data: body, status, statusText: 'OK', headers: {}, config })
      }, delayMs)

      config.signal?.addEventListener('abort', () => {
        if (call.settled || call.aborted) return
        clearTimeout(timer)
        inFlight -= 1
        call.aborted = true
        const error = new Error('canceled')
        error.code = 'ERR_CANCELED'
        error.name = 'CanceledError'
        reject(error)
      })
    })

  return {
    calls,
    get maxInFlight() {
      return maxInFlight
    },
    get completed() {
      return calls.filter((call) => call.settled)
    },
  }
}

export function resetNetwork() {
  apiClient.defaults.adapter = realAdapter
}
