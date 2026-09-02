import { describe, expect, it } from 'vitest'
import { DUTY_STATUS } from './constants'
import { legEventPositions, splitSegmentsByLeg } from './legs'

const drive = (miles, start) => ({
  status: DUTY_STATUS.DRIVING,
  start,
  end: start,
  distance_miles: miles,
  note: null,
})

const event = (note, start, status = DUTY_STATUS.OFF_DUTY) => ({
  status,
  start,
  end: start,
  distance_miles: null,
  note,
})

const LEGS = [
  { from: 'current', to: 'pickup', distance_miles: 500, duration_hours: 10 },
  { from: 'pickup', to: 'dropoff', distance_miles: 400, duration_hours: 8 },
]

const STOPS = [
  { type: 'current', label: 'Chicago, IL' },
  { type: 'pickup', label: 'Denver, CO' },
  { type: 'dropoff', label: 'Los Angeles, CA' },
]

describe('splitSegmentsByLeg', () => {
  const segments = [
    drive(250, '1'),
    event('30-minute break', '2'),
    drive(250, '3'),
    event('Pickup', '4', DUTY_STATUS.ON_DUTY),
    drive(400, '5'),
    event('Dropoff', '6', DUTY_STATUS.ON_DUTY),
  ]

  it('closes the first leg at the pickup and names each haul', () => {
    const groups = splitSegmentsByLeg(segments, LEGS, STOPS)

    expect(groups.map((group) => group.title)).toEqual([
      'Deadhead to pickup',
      'Loaded to dropoff',
    ])
    expect(groups[0].segments).toHaveLength(4)
    expect(groups[1].segments).toHaveLength(2)
    expect(groups[0].from).toBe('Chicago, IL')
    expect(groups[0].to).toBe('Denver, CO')
  })

  it('falls back to a single group when the API sends no legs', () => {
    expect(splitSegmentsByLeg(segments, [], STOPS)).toHaveLength(1)
    expect(splitSegmentsByLeg(segments, LEGS.slice(0, 1), STOPS)).toHaveLength(1)
  })

  it('falls back to a single group when no pickup event marks the boundary', () => {
    const noPickup = segments.filter((segment) => segment.note !== 'Pickup')
    expect(splitSegmentsByLeg(noPickup, LEGS, STOPS)).toHaveLength(1)
  })
})

describe('legEventPositions', () => {
  it('places each event at the mileage the driver had covered when it happened', () => {
    const events = legEventPositions(
      [drive(100, '1'), event('30-minute break', '2'), drive(150, '3'), event('10-hour reset', '4')],
      500,
    )

    expect(events).toHaveLength(2)
    expect(events[0]).toMatchObject({ note: '30-minute break', atMiles: 100, position: 20 })
    expect(events[1]).toMatchObject({ note: '10-hour reset', atMiles: 250, position: 50 })
  })

  it('ignores unlabelled segments and clamps overshoot to the end of the bar', () => {
    const events = legEventPositions([drive(900, '1'), event('Fuel stop', '2'), drive(10, '3')], 500)

    expect(events).toHaveLength(1)
    expect(events[0].position).toBe(100)
  })

  it('returns nothing when the leg has no distance to scale against', () => {
    expect(legEventPositions([event('Fuel stop', '1')], 0)).toEqual([])
  })
})
