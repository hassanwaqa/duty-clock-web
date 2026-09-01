import { describe, expect, it } from 'vitest'
import { DUTY_STATUS } from './constants'
import { splitSegmentsByDay, sumDrivingMiles } from './time'

const TIMEZONE = 'America/Chicago'

function segment(overrides = {}) {
  return {
    status: DUTY_STATUS.DRIVING,
    start: '2026-09-01T08:00:00-05:00',
    end: '2026-09-01T09:00:00-05:00',
    location: 'Chicago, IL',
    note: null,
    distance_miles: 50,
    ...overrides,
  }
}

describe('splitSegmentsByDay', () => {
  it('splits a segment at local midnight using the trip timezone', () => {
    const days = splitSegmentsByDay(
      [
        segment({
          start: '2026-09-01T23:00:00-05:00',
          end: '2026-09-02T01:00:00-05:00',
          distance_miles: 100,
        }),
      ],
      TIMEZONE,
    )

    expect(days.map((day) => day.dayKey)).toEqual(['2026-09-01', '2026-09-02'])
    expect(days[0].segments[0]).toMatchObject({ startHour: 23, endHour: 24 })
    expect(days[1].segments[0]).toMatchObject({ startHour: 0, endHour: 1 })
  })

  it('fills gaps inside the trip window but leaves outside time unrecorded', () => {
    const days = splitSegmentsByDay(
      [
        segment(),
        segment({
          start: '2026-09-01T10:00:00-05:00',
          end: '2026-09-01T11:00:00-05:00',
        }),
      ],
      TIMEZONE,
    )

    expect(days[0].segments).toHaveLength(3)
    expect(days[0].segments[0]).toMatchObject({ startHour: 8, endHour: 9 })
    expect(days[0].segments[0].implied).toBeUndefined()
    expect(days[0].segments[1]).toMatchObject({
      status: DUTY_STATUS.OFF_DUTY,
      startHour: 9,
      endHour: 10,
      implied: true,
    })
    expect(days[0].segments[2]).toMatchObject({ startHour: 10, endHour: 11 })
  })

  it('prorates driving mileage across midnight without changing the trip total', () => {
    const days = splitSegmentsByDay(
      [
        segment({
          start: '2026-09-01T23:00:00-05:00',
          end: '2026-09-02T01:00:00-05:00',
          distance_miles: 120,
        }),
      ],
      TIMEZONE,
    )

    expect(days[0].segments[0].distance_miles).toBeCloseTo(60)
    expect(days[1].segments[0].distance_miles).toBeCloseTo(60)
    expect(days.flatMap((day) => day.segments).reduce((sum, piece) => sum + piece.distance_miles, 0)).toBeCloseTo(120)
  })

  it('sums a day\'s driving mileage and ignores non-driving segments', () => {
    const pieces = [
      segment({ distance_miles: 42 }),
      segment({ distance_miles: 18 }),
      segment({ status: DUTY_STATUS.ON_DUTY, distance_miles: null }),
    ]

    expect(sumDrivingMiles(pieces)).toBe(60)
  })
})
