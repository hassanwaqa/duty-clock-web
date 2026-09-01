import { cleanup, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { DUTY_STATUS } from '../lib/constants'
import { useDaySheets } from './useDaySheets'

afterEach(cleanup)

describe('useDaySheets', () => {
  it('composes local-day clipping, prorated mileage, totals, and cycle recap', () => {
    const segments = [
      {
        status: DUTY_STATUS.DRIVING,
        start: '2026-09-01T23:00:00-05:00',
        end: '2026-09-02T01:00:00-05:00',
        location: 'Des Moines, IA',
        note: null,
        distance_miles: 120,
      },
    ]

    const { result } = renderHook(() =>
      useDaySheets(segments, 'America/Chicago', 20),
    )

    expect(result.current.map((day) => day.dayKey)).toEqual(['2026-09-01', '2026-09-02'])
    expect(result.current.map((day) => day.totalMilesDriving)).toEqual([60, 60])
    expect(result.current[0].recap.eightDayTotal).toBe(21)
    expect(result.current[1].recap.eightDayTotal).toBe(22)
  })
})
