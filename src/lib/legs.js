import { DUTY_STATUS, LEG_TITLES, PICKUP_NOTE, STOP_LABELS } from './constants'

const placeName = (point, stops) =>
  stops.find((stop) => stop.type === point)?.label ?? STOP_LABELS[point] ?? point

export function splitSegmentsByLeg(segments = [], legs = [], stops = []) {
  const ungrouped = [{ key: 'all', leg: null, title: null, from: null, to: null, segments }]
  if (!Array.isArray(legs) || legs.length < 2) return ungrouped

  const pickupIndex = segments.findIndex((segment) => segment.note === PICKUP_NOTE)
  if (pickupIndex < 0) return ungrouped

  const build = (leg, list, index) => ({
    key: `leg-${index}`,
    leg,
    title:
      LEG_TITLES[`${leg.from}>${leg.to}`] ??
      `${STOP_LABELS[leg.from] ?? leg.from} → ${STOP_LABELS[leg.to] ?? leg.to}`,
    from: placeName(leg.from, stops),
    to: placeName(leg.to, stops),
    segments: list,
  })

  return [
    build(legs[0], segments.slice(0, pickupIndex + 1), 0),
    build(legs[1], segments.slice(pickupIndex + 1), 1),
  ].filter((group) => group.segments.length > 0)
}

export function legEventPositions(segments = [], legDistanceMiles = 0) {
  if (!(legDistanceMiles > 0)) return []

  let miles = 0
  const events = []

  for (const segment of segments) {
    if (segment.status === DUTY_STATUS.DRIVING) {
      miles += Number.isFinite(segment.distance_miles) ? segment.distance_miles : 0
      continue
    }
    if (!segment.note) continue

    events.push({
      key: `${segment.start}-${segment.note}`,
      note: segment.note,
      status: segment.status,
      atMiles: miles,
      position: Math.min(100, Math.max(0, (miles / legDistanceMiles) * 100)),
    })
  }

  return events
}
