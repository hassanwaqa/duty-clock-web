import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import InfoHint from '../common/InfoHint'
import { DUTY_STATUS, HOS_HINTS, STATUS_COLORS, STOP_COLORS, STOP_LABELS } from '../../lib/constants'
import { calculateTripMetrics, formatDurationWords, splitSegmentsByDay } from '../../lib/time'

function Stop({ stop, isLast }) {
  return (
    <Box sx={{ minWidth: 0, flex: '1 1 160px', pr: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
        <Box
          sx={{
            width: 6,
            height: 6,
            bgcolor: STOP_COLORS[stop.type] ?? 'text.secondary',
            flexShrink: 0,
          }}
        />
        <Typography variant="stamp" sx={{ color: 'text.secondary' }}>
          {STOP_LABELS[stop.type] ?? stop.type}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.3 }}>
        {stop.label}
      </Typography>
      {!isLast && (
        <Box aria-hidden="true" sx={{ mt: 1, height: '1px', bgcolor: 'divider', mr: -2 }} />
      )}
    </Box>
  )
}

Stop.propTypes = {
  stop: PropTypes.shape({ type: PropTypes.string.isRequired, label: PropTypes.string.isRequired })
    .isRequired,
  isLast: PropTypes.bool,
}

// Figures sit in ruled cells, the way boxed fields are printed on a duty log —
// not as a grid of floating stat tiles.
function Cell({ label, value, sub, hint }) {
  return (
    <Box
      sx={{
        px: { xs: 1.75, md: 2.25 },
        py: 1.5,
        bgcolor: 'background.paper',
        // Flex rather than grid: the final row stretches to fill, so a wrapped
        // set never leaves an empty track showing the rule colour behind it.
        flex: '1 1 168px',
        minWidth: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.25 }}>
        <Typography variant="stamp" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
        {hint && <InfoHint text={hint} label={`About ${label.toLowerCase()}`} />}
      </Box>
      <Typography variant="monoLarge" sx={{ display: 'block', lineHeight: 1.15 }}>
        {value}
      </Typography>
      {sub && (
        <Typography variant="caption" sx={{ display: 'block', mt: 0.25 }}>
          {sub}
        </Typography>
      )}
    </Box>
  )
}

Cell.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  sub: PropTypes.string,
  hint: PropTypes.string,
}

function Tally({ value, singular, plural, color }) {
  if (!value) return null
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Box sx={{ width: 6, height: 6, bgcolor: color, flexShrink: 0 }} />
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
          {value}
        </Box>
        {` ${value === 1 ? singular : plural}`}
      </Typography>
    </Box>
  )
}

Tally.propTypes = {
  value: PropTypes.number.isRequired,
  singular: PropTypes.string.isRequired,
  plural: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
}

const trim = (value) => value.toFixed(2).replace(/\.00$/, '')

export default function TripSummaryCard({ trip }) {
  const metrics = calculateTripMetrics(trip.segments, trip.current_cycle_used)
  // Counting distinct segment start dates would miss a day spent entirely
  // inside one long rest, so use the same splitter that builds the log sheets.
  const dayCount = splitSegmentsByDay(trip.segments, trip.timezone).length

  const arrival = metrics.expectedArrival ? new Date(metrics.expectedArrival) : null
  const inTripZone = (options) =>
    arrival ? arrival.toLocaleString('en-US', { timeZone: trip.timezone, ...options }) : ''
  const arrivalZone = arrival
    ? new Intl.DateTimeFormat('en-US', { timeZone: trip.timezone, timeZoneName: 'short' })
        .formatToParts(arrival)
        .find((part) => part.type === 'timeZoneName')?.value ?? ''
    : ''
  const arrivalTime = arrival
    ? inTripZone({ hour: '2-digit', minute: '2-digit', hour12: false })
    : '—'
  const arrivalDay = arrival
    ? `${inTripZone({ weekday: 'short', month: 'short', day: 'numeric' })} · ${arrivalZone}`
    : undefined

  return (
    <Box component="section" sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          px: { xs: 1.75, md: 2.25 },
          pt: 2,
          pb: 1.5,
        }}
      >
        {trip.stops.map((stop, index) => (
          <Stop key={stop.type} stop={stop} isLast={index === trip.stops.length - 1} />
        ))}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1px',
          bgcolor: 'divider',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Cell
          label="Distance"
          value={`${Math.round(trip.total_distance_miles).toLocaleString('en-US')} mi`}
        />
        <Cell
          label="Driving"
          value={formatDurationWords(trip.total_duration_hours)}
          hint={HOS_HINTS.drivingTime}
        />
        <Cell
          label="Total elapsed"
          value={formatDurationWords(metrics.totalElapsedHours)}
          hint={HOS_HINTS.totalTripTime}
        />
        <Cell label="Arrival" value={arrivalTime} sub={arrivalDay} />
        <Cell
          label="Cycle used"
          value={`${trim(metrics.finalCycleUsed)} / 70 h`}
          sub={`${trim(metrics.cycleRemaining)} h remaining`}
          hint={metrics.counts.restarts ? HOS_HINTS.restart : HOS_HINTS.cycle}
        />
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          columnGap: 2.5,
          rowGap: 0.75,
          px: { xs: 1.75, md: 2.25 },
          py: 1.25,
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.default',
        }}
      >
        <Tally value={dayCount} singular="day on the road" plural="days on the road" color={STOP_COLORS.dropoff} />
        <Tally value={metrics.counts.restStops} singular="rest stop" plural="rest stops" color={STATUS_COLORS[DUTY_STATUS.OFF_DUTY]} />
        <Tally value={metrics.counts.breaks} singular="30-min break" plural="30-min breaks" color={STATUS_COLORS[DUTY_STATUS.OFF_DUTY]} />
        <Tally value={metrics.counts.fuelStops} singular="fuel stop" plural="fuel stops" color={STATUS_COLORS[DUTY_STATUS.ON_DUTY]} />
      </Box>
    </Box>
  )
}

TripSummaryCard.propTypes = {
  trip: PropTypes.shape({
    stops: PropTypes.arrayOf(
      PropTypes.shape({ type: PropTypes.string.isRequired, label: PropTypes.string.isRequired }),
    ).isRequired,
    total_distance_miles: PropTypes.number.isRequired,
    total_duration_hours: PropTypes.number.isRequired,
    current_cycle_used: PropTypes.number.isRequired,
    timezone: PropTypes.string.isRequired,
    segments: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string.isRequired,
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
        note: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
}
