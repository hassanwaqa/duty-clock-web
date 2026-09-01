import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { StrictMode } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import { shouldRetryRequest } from '../api/client'
import { resetNetwork, stubNetwork } from '../test/networkStub'
import { tripQueryKey, useTripPlan } from './useTripPlan'

const TRIP = { id: 1, current_location: 'New York, NY', segments: [] }

const settle = (ms = 60) => new Promise((resolve) => setTimeout(resolve, ms))

function makeClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: shouldRetryRequest, retryDelay: 0, refetchOnWindowFocus: false },
    },
  })
}

function TripProbe({ id }) {
  const { data, isPending, isError, error } = useTripPlan(id)
  if (isPending) return <p>loading</p>
  if (isError) return <p>{`error: ${error.message}`}</p>
  return <p>{`trip ${data.id}`}</p>
}

const mount = (client, ui) => render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>)

afterEach(() => {
  cleanup()
  resetNetwork()
})

describe('trip request behaviour', () => {
  it('performs exactly one GET for a direct visit to a trip URL', async () => {
    const net = stubNetwork({ body: TRIP })

    mount(makeClient(), <TripProbe id="1" />)
    await screen.findByText('trip 1')
    await settle()

    expect(net.calls).toHaveLength(1)
    expect(net.calls[0].url).toBe('/api/trips/1')
  })

  it('renders a trip seeded by the planner without an immediate GET', async () => {
    const net = stubNetwork({ body: TRIP })
    const client = makeClient()
    // Seeded with the numeric id the API returns; read with the string id the
    // router provides — the shared key builder has to bridge the two.
    client.setQueryData(tripQueryKey(TRIP.id), TRIP)

    mount(client, <TripProbe id="1" />)
    await screen.findByText('trip 1')
    await settle()

    expect(net.calls).toHaveLength(0)
  })

  it('aborts an in-flight request when the page unmounts, and does not retry it', async () => {
    const net = stubNetwork({ body: TRIP, delayMs: 200 })

    const view = mount(makeClient(), <TripProbe id="1" />)
    await waitFor(() => expect(net.calls).toHaveLength(1))
    view.unmount()

    await waitFor(() => expect(net.calls[0].aborted).toBe(true))
    await settle(250)

    expect(net.calls).toHaveLength(1)
    expect(net.completed).toHaveLength(0)
  })

  it('shares one request between simultaneous readers of the same trip', async () => {
    const net = stubNetwork({ body: TRIP, delayMs: 40 })

    mount(
      makeClient(),
      <>
        <TripProbe id="1" />
        <TripProbe id="1" />
      </>,
    )
    await screen.findAllByText('trip 1')
    await settle()

    expect(net.calls).toHaveLength(1)
  })

  it('never holds two requests in flight across a fast remount', async () => {
    const net = stubNetwork({ body: TRIP, delayMs: 120 })
    const client = makeClient()

    const view = mount(client, <TripProbe id="1" />)
    await waitFor(() => expect(net.calls).toHaveLength(1))
    view.unmount()
    mount(client, <TripProbe id="1" />)

    await screen.findByText('trip 1')
    await settle()

    expect(net.maxInFlight).toBe(1)
    expect(net.completed).toHaveLength(1)
  })

  it('does not retry a 404 and surfaces the API message', async () => {
    const net = stubNetwork({ status: 404, body: { detail: 'Trip not found.' } })

    mount(makeClient(), <TripProbe id="9999" />)
    await screen.findByText('error: Trip not found.')
    await settle()

    expect(net.calls).toHaveLength(1)
  })

  it('does not retry a 400 for an invalid trip id', async () => {
    const net = stubNetwork({ status: 400, body: { detail: 'Invalid trip id.' } })

    mount(makeClient(), <TripProbe id="not-an-id" />)
    await screen.findByText('error: Invalid trip id.')
    await settle()

    expect(net.calls).toHaveLength(1)
  })

  it('still retries a genuine server failure, so real outages are not concealed', async () => {
    const net = stubNetwork({ status: 500, body: { detail: 'Boom.' } })

    mount(makeClient(), <TripProbe id="1" />)
    await screen.findByText('error: Boom.')

    expect(net.calls).toHaveLength(2)
  })

  it('does not produce duplicate completed requests under StrictMode', async () => {
    const net = stubNetwork({ body: TRIP, delayMs: 30 })

    mount(
      makeClient(),
      <StrictMode>
        <TripProbe id="1" />
      </StrictMode>,
    )
    await screen.findByText('trip 1')
    await settle()

    expect(net.completed).toHaveLength(1)
    expect(net.maxInFlight).toBe(1)
  })
})
