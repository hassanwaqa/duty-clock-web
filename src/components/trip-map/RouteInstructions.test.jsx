import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import RouteInstructions from './RouteInstructions'

const LEGS = [
  {
    from: 'current',
    to: 'pickup',
    distance_miles: 120,
    duration_hours: 2,
    steps: [
      {
        instruction: 'Head west on I-80',
        distance_miles: 78,
        duration_hours: 1.2,
        lat: 41.88,
        lng: -87.63,
      },
      {
        instruction: 'Keep left toward Des Moines',
        distance_miles: 42,
        duration_hours: 0.8,
        lat: 41.6,
        lng: -90.4,
      },
    ],
  },
  {
    from: 'pickup',
    to: 'dropoff',
    distance_miles: 200,
    duration_hours: 3.5,
    steps: [
      {
        instruction: 'Merge onto I-35 South',
        distance_miles: 200,
        duration_hours: 3.5,
        lat: 41.59,
        lng: -93.62,
      },
    ],
  },
]

afterEach(cleanup)

describe('RouteInstructions', () => {
  it('renders one section per leg and every instruction returned by the API', () => {
    render(<RouteInstructions legs={LEGS} />)

    expect(screen.getByText('Current location → Pickup')).toBeTruthy()
    fireEvent.click(screen.getByText('Pickup → Dropoff'))
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
    expect(screen.getByText('Head west on I-80')).toBeTruthy()
    expect(screen.getByText('Merge onto I-35 South')).toBeTruthy()
  })
})
