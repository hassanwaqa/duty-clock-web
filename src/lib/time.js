import { CYCLE_RESTART_NOTE, DUTY_STATUS, HOURS_PER_SHEET, ROW_ORDER } from './constants'

const MS_PER_SECOND = 1_000

const pad = (value) => String(value).padStart(2, '0')
const formatterCache = new Map()

function zonedFormatter(timezone) {
  if (!formatterCache.has(timezone)) {
    formatterCache.set(
      timezone,
      new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      }),
    )
  }
  return formatterCache.get(timezone)
}

function zonedParts(date, timezone) {
  const values = Object.fromEntries(
    zonedFormatter(timezone)
      .formatToParts(date)
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)]),
  )
  return values
}

export function dayKey(date, timezone = 'UTC') {
  const parts = zonedParts(date, timezone)
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`
}

function nextDayKey(key) {
  const [year, month, day] = key.split('-').map(Number)
  const next = new Date(Date.UTC(year, month - 1, day + 1))
  return `${next.getUTCFullYear()}-${pad(next.getUTCMonth() + 1)}-${pad(next.getUTCDate())}`
}

function timezoneOffsetMs(date, timezone) {
  const parts = zonedParts(date, timezone)
  const asUtc = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
  )
  return asUtc - Math.floor(date.getTime() / MS_PER_SECOND) * MS_PER_SECOND
}

function instantForLocalHour(key, hour, timezone) {
  const normalizedKey = hour === HOURS_PER_SHEET ? nextDayKey(key) : key
  const normalizedHour = hour === HOURS_PER_SHEET ? 0 : hour
  const [year, month, day] = normalizedKey.split('-').map(Number)
  const wholeHour = Math.floor(normalizedHour)
  const exactMinutes = (normalizedHour - wholeHour) * 60
  const minute = Math.floor(exactMinutes)
  const second = Math.round((exactMinutes - minute) * 60)
  const desiredWallTime = Date.UTC(year, month - 1, day, wholeHour, minute, second)
  let candidate = desiredWallTime

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const corrected = desiredWallTime - timezoneOffsetMs(new Date(candidate), timezone)
    if (Math.abs(corrected - candidate) < MS_PER_SECOND) break
    candidate = corrected
  }

  return new Date(candidate)
}

export function hoursSinceMidnight(date, timezone = 'UTC') {
  const parts = zonedParts(date, timezone)
  return parts.hour + parts.minute / 60 + parts.second / 3600
}

export function formatHHMM(isoString, timezone = 'UTC') {
  const parts = zonedParts(new Date(isoString), timezone)
  return `${pad(parts.hour)}:${pad(parts.minute)}`
}

export function formatDayLabel(key) {
  return new Date(`${key}T12:00:00Z`).toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatMinutes(minutes) {
  return `${Math.floor(minutes / 60)}:${pad(minutes % 60)}`
}

// Rounding each row to the nearest minute on its own lets the four printed
// totals miss the day's total by a minute, which reads as an arithmetic error
// to anyone adding up the column. Hand the leftover minutes to the rows with
// the largest dropped fractions so the column always foots.
export function formatRowTotals(totals) {
  const exact = ROW_ORDER.map((status) => totals[status] * 60)
  const minutes = exact.map(Math.floor)
  const dayTotal = Math.round(exact.reduce((sum, value) => sum + value, 0))

  const byLostFraction = exact
    .map((value, index) => ({ index, lost: value - minutes[index] }))
    .sort((a, b) => b.lost - a.lost)

  let leftover = dayTotal - minutes.reduce((sum, value) => sum + value, 0)
  for (const { index } of byLostFraction) {
    if (leftover <= 0) break
    minutes[index] += 1
    leftover -= 1
  }

  return {
    rows: Object.fromEntries(ROW_ORDER.map((status, index) => [status, formatMinutes(minutes[index])])),
    total: formatMinutes(dayTotal),
  }
}

export function formatDurationWords(hours) {
  const minutes = Math.round(hours * 60)
  const wholeHours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  const hourPart = wholeHours === 1 ? '1 hour' : `${wholeHours} hours`
  if (!wholeHours) return `${remainder} min`
  return remainder ? `${hourPart} ${remainder} min` : hourPart
}

function segmentDurationHours(segment) {
  return (new Date(segment.end).getTime() - new Date(segment.start).getTime()) / 3_600_000
}

function cycleAfterSegment(cycleHours, segment, durationHours) {
  let nextCycle = cycleHours
  if (segment.status === DUTY_STATUS.DRIVING || segment.status === DUTY_STATUS.ON_DUTY) {
    nextCycle += durationHours
  }
  return segment.note === CYCLE_RESTART_NOTE ? 0 : nextCycle
}

export function calculateTripMetrics(segments = [], currentCycleUsed = 0) {
  const reported = [...segments]
    .filter((segment) => {
      const duration = segmentDurationHours(segment)
      return Number.isFinite(duration) && duration > 0
    })
    .sort((a, b) => new Date(a.start) - new Date(b.start))

  const startingCycle = Number.isFinite(Number(currentCycleUsed)) ? Number(currentCycleUsed) : 0
  let finalCycleUsed = startingCycle

  for (const segment of reported) {
    finalCycleUsed = cycleAfterSegment(
      finalCycleUsed,
      segment,
      segmentDurationHours(segment),
    )
  }

  const first = reported[0]
  const last = reported.at(-1)
  const dropoff = reported.findLast((segment) => segment.note === 'Dropoff')
  const totalElapsedHours = first && last
    ? (new Date(last.end).getTime() - new Date(first.start).getTime()) / 3_600_000
    : 0

  return {
    totalElapsedHours,
    expectedArrival: dropoff?.start ?? last?.end ?? null,
    finalCycleUsed,
    cycleRemaining: Math.max(0, 70 - finalCycleUsed),
  }
}

function impliedOffDuty(key, startHour, endHour, timezone) {
  return {
    status: DUTY_STATUS.OFF_DUTY,
    start: instantForLocalHour(key, startHour, timezone).toISOString(),
    end: instantForLocalHour(key, endHour, timezone).toISOString(),
    startHour,
    endHour,
    location: null,
    note: null,
    distance_miles: null,
    implied: true,
  }
}

function withImpliedOffDuty(key, pieces, timezone) {
  if (!pieces.length) return []

  const filled = []
  let cursor = 0
  for (const piece of pieces) {
    if (piece.startHour > cursor) {
      filled.push(impliedOffDuty(key, cursor, piece.startHour, timezone))
    }
    filled.push(piece)
    cursor = Math.max(cursor, piece.endHour)
  }

  if (cursor < HOURS_PER_SHEET) {
    filled.push(impliedOffDuty(key, cursor, HOURS_PER_SHEET, timezone))
  }

  return filled
}

export function splitSegmentsByDay(segments = [], timezone = 'UTC') {
  const days = new Map()

  for (const segment of segments) {
    const start = new Date(segment.start)
    const end = new Date(segment.end)
    const segmentDuration = end.getTime() - start.getTime()
    if (!Number.isFinite(segmentDuration) || segmentDuration <= 0) continue
    let key = dayKey(start, timezone)

    while (instantForLocalHour(key, 0, timezone) < end) {
      const dayStart = instantForLocalHour(key, 0, timezone)
      const dayEnd = instantForLocalHour(key, HOURS_PER_SHEET, timezone)
      const pieceStart = start > dayStart ? start : dayStart
      const pieceEnd = end < dayEnd ? end : dayEnd
      const startHour = pieceStart.getTime() === dayStart.getTime()
        ? 0
        : hoursSinceMidnight(pieceStart, timezone)
      const endHour = pieceEnd.getTime() === dayEnd.getTime()
        ? HOURS_PER_SHEET
        : hoursSinceMidnight(pieceEnd, timezone)

      if (endHour <= startHour) {
        key = nextDayKey(key)
        continue
      }

      const fraction = segmentDuration > 0
        ? (pieceEnd.getTime() - pieceStart.getTime()) / segmentDuration
        : 0
      const piece = {
        ...segment,
        // A multi-day segment is clipped into one piece per log sheet. Keep
        // its true boundaries so cycle recaps can tell which piece actually
        // completes a 34-hour restart.
        sourceStart: segment.start,
        sourceEnd: segment.end,
        start: pieceStart.toISOString(),
        end: pieceEnd.toISOString(),
        startHour,
        endHour,
        distance_miles:
          segment.status === DUTY_STATUS.DRIVING && Number.isFinite(segment.distance_miles)
            ? segment.distance_miles * fraction
            : segment.distance_miles ?? null,
      }
      days.set(key, [...(days.get(key) ?? []), piece])
      key = nextDayKey(key)
    }
  }

  return [...days.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, pieces]) => ({
      dayKey: key,
      timezone,
      // A daily log covers all 24 hours. Time outside reported plan segments
      // is shown as implied off duty and disclosed as a planning assumption.
      segments: withImpliedOffDuty(
        key,
        [...pieces].sort((a, b) => a.startHour - b.startHour),
        timezone,
      ),
    }))
}

export function sumHoursByStatus(daySegments) {
  const totals = Object.fromEntries(ROW_ORDER.map((status) => [status, 0]))
  for (const segment of daySegments) {
    totals[segment.status] += segment.endHour - segment.startHour
  }
  return totals
}

export function sumDrivingMiles(daySegments) {
  return daySegments.reduce(
    (total, segment) =>
      segment.status === DUTY_STATUS.DRIVING && Number.isFinite(segment.distance_miles)
        ? total + segment.distance_miles
        : total,
    0,
  )
}

export function describeDay(daySegments) {
  const reported = daySegments.filter((segment) => !segment.implied)
  return {
    from: reported[0]?.location ?? '',
    to: reported.at(-1)?.location ?? '',
    totalMilesDriving: sumDrivingMiles(daySegments),
  }
}

export function addCycleRecaps(days, currentCycleUsed) {
  let cycleHours = Number.isFinite(Number(currentCycleUsed)) ? Number(currentCycleUsed) : 0

  return days.map((day) => {
    for (const segment of day.segments) {
      if (segment.implied) continue

      if (segment.status === DUTY_STATUS.DRIVING || segment.status === DUTY_STATUS.ON_DUTY) {
        cycleHours = cycleAfterSegment(
          cycleHours,
          segment,
          segment.endHour - segment.startHour,
        )
      }

      const completesRestart =
        segment.note === CYCLE_RESTART_NOTE &&
        (!segment.sourceEnd || new Date(segment.end).getTime() >= new Date(segment.sourceEnd).getTime())

      if (completesRestart) cycleHours = 0
    }

    return {
      ...day,
      recap: {
        eightDayTotal: cycleHours,
        hoursAvailableTomorrow: Math.max(0, 70 - cycleHours),
      },
    }
  })
}
