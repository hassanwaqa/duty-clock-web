import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DUTY_STATUS } from '../../lib/constants'
import TripSchedule from './TripSchedule'

const SEGMENTS = [
  {
    status: DUTY_STATUS.DRIVING,
    start: '2026-09-01T08:00:00-05:00',
    end: '2026-09-01T10:00:00-05:00',
    location: 'Chicago, IL',
    note: null,
    distance_miles: 120,
    lat: 41.88,
    lng: -87.63,
  },
  {
    status: DUTY_STATUS.ON_DUTY,
    start: '2026-09-01T10:00:00-05:00',
    end: '2026-09-01T10:30:00-05:00',
    location: 'Davenport, IA',
    note: 'Fuel stop',
    distance_miles: null,
    lat: 41.52,
    lng: -90.58,
  },
]

afterEach(cleanup)

describe('TripSchedule', () => {
  it('shows every scheduled activity with local timing, duration, distance, and location', () => {
    const onSegmentHover = vi.fn()
    render(
      <TripSchedule
        segments={SEGMENTS}
        timezone="America/Chicago"
        onSegmentHover={onSegmentHover}
      />,
    )

    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByText('Driving')).toBeTruthy()
    expect(screen.getByText('Fuel stop')).toBeTruthy()
    expect(screen.getByText('Chicago, IL')).toBeTruthy()
    expect(screen.getByText('2 hours · 120 mi')).toBeTruthy()
    expect(screen.getByText('Tue, Sep 1 · 08:00–10:00')).toBeTruthy()

    fireEvent.mouseEnter(screen.getByText('Fuel stop').closest('li'))
    expect(onSegmentHover).toHaveBeenCalledWith(SEGMENTS[1])
  })

const PICKUP = {
  status: DUTY_STATUS.ON_DUTY,
  start: '2026-09-01T10:30:00-05:00',
  end: '2026-09-01T11:30:00-05:00',
  location: 'Des Moines, IA',
  note: 'Pickup',
  distance_miles: null,
}

const AFTER_PICKUP = {
  status: DUTY_STATUS.DRIVING,
  start: '2026-09-01T11:30:00-05:00',
  end: '2026-09-01T14:30:00-05:00',
  location: 'Des Moines, IA',
  note: null,
  distance_miles: 180,
}

const LEGS = [
  { from: 'current', to: 'pickup', distance_miles: 120, duration_hours: 2 },
  { from: 'pickup', to: 'dropoff', distance_miles: 180, duration_hours: 3 },
]

const STOPS = [
  { type: 'current', label: 'Chicago, IL' },
  { type: 'pickup', label: 'Des Moines, IA' },
  { type: 'dropoff', label: 'Omaha, NE' },
]

  it('splits the schedule at the pickup so each routed leg reads on its own', () => {
    render(
      <TripSchedule
        segments={[...SEGMENTS, PICKUP, AFTER_PICKUP]}
        timezone="America/Chicago"
        legs={LEGS}
        stops={STOPS}
      />,
    )

    expect(screen.getByText('Leg 1 · Chicago, IL → Des Moines, IA')).toBeTruthy()
    expect(screen.getByText('Leg 2 · Des Moines, IA → Omaha, NE')).toBeTruthy()

    // The pickup closes the first leg; only the run after it belongs to the second.
    const lists = screen.getAllByRole('list')
    expect(lists).toHaveLength(2)
    expect(lists[0].querySelectorAll('li')).toHaveLength(3)
    expect(lists[1].querySelectorAll('li')).toHaveLength(1)
  })

  it('falls back to one ungrouped list when the API sends no legs', () => {
    render(<TripSchedule segments={SEGMENTS} timezone="America/Chicago" />)

    expect(screen.getAllByRole('list')).toHaveLength(1)
    expect(screen.queryByText(/^Leg 1/)).toBeNull()
  })
})
