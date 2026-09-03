import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { DUTY_STATUS } from '../../lib/constants'
import TripSummaryCard from './TripSummaryCard'

afterEach(cleanup)

describe('TripSummaryCard', () => {
  it('distinguishes driving time from total trip time and shows arrival and final cycle capacity', () => {
    render(
      <TripSummaryCard
        trip={{
          stops: [
            { type: 'current', label: 'Chicago, IL' },
            { type: 'pickup', label: 'Denver, CO' },
            { type: 'dropoff', label: 'Los Angeles, CA' },
          ],
          total_distance_miles: 2021.8,
          total_duration_hours: 36.8,
          current_cycle_used: 10,
          timezone: 'America/Chicago',
          segments: [
            {
              status: DUTY_STATUS.DRIVING,
              start: '2026-09-01T08:00:00-05:00',
              end: '2026-09-01T10:00:00-05:00',
              note: null,
            },
            {
              status: DUTY_STATUS.OFF_DUTY,
              start: '2026-09-01T10:00:00-05:00',
              end: '2026-09-01T20:00:00-05:00',
              note: '10-hour reset',
            },
            {
              status: DUTY_STATUS.ON_DUTY,
              start: '2026-09-01T20:00:00-05:00',
              end: '2026-09-01T21:00:00-05:00',
              note: 'Dropoff',
            },
          ],
        }}
      />,
    )

    expect(screen.getByText('Driving')).toBeTruthy()
    expect(screen.getByText('36 hours 48 min')).toBeTruthy()
    expect(screen.getByText('Total elapsed')).toBeTruthy()
    expect(screen.getByText('13 hours')).toBeTruthy()
    expect(screen.getByText('Arrival')).toBeTruthy()
    expect(screen.getByText('20:00')).toBeTruthy()
    expect(screen.getByText(/Tue, Sep 1 · CDT/)).toBeTruthy()
    expect(screen.getByText('Cycle used')).toBeTruthy()
    expect(screen.getByText('13 / 70 h')).toBeTruthy()
    expect(screen.getByText('57 h remaining')).toBeTruthy()
  })
})
