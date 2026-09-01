import { useMemo } from 'react'
import { addCycleRecaps, describeDay, splitSegmentsByDay, sumHoursByStatus } from '../lib/time'

export function useDaySheets(segments, timezone, currentCycleUsed) {
  return useMemo(
    () => {
      const days = splitSegmentsByDay(segments, timezone).map((day) => ({
        ...day,
        totals: sumHoursByStatus(day.segments),
        ...describeDay(day.segments),
      }))
      return addCycleRecaps(days, currentCycleUsed)
    },
    [segments, timezone, currentCycleUsed],
  )
}
