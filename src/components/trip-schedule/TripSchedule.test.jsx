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
})
