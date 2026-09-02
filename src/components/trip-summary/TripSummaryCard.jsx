import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Box, Card, CardContent, Divider, Typography } from '@mui/material'
import { Fragment } from 'react'
import PropTypes from 'prop-types'
import InfoHint from '../common/InfoHint'
import { HOS_HINTS, STATUS_COLORS, DUTY_STATUS, STOP_COLORS, STOP_LABELS } from '../../lib/constants'
import { calculateTripMetrics, formatDurationWords, splitSegmentsByDay } from '../../lib/time'

function Stop({ stop }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: STOP_COLORS[stop.type] ?? 'text.secondary',
            flexShrink: 0,
          }}
        />
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          {STOP_LABELS[stop.type] ?? stop.type}
        </Typography>
      </Box>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {stop.label}
      </Typography>
    </Box>
  )
}

Stop.propTypes = {
  stop: PropTypes.shape({ type: PropTypes.string.isRequired, label: PropTypes.string.isRequired })
    .isRequired,
}

function Stat({ label, value, hint }) {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
        {hint && <InfoHint text={hint} label={`About ${label.toLowerCase()}`} />}
      </Box>
      <Typography variant="monoLarge">{value}</Typography>
    </Box>
  )
}

Stat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  hint: PropTypes.string,
}

function Count({ value, singular, plural, color }) {
  if (!value) return null
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
        <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>{value}</Box>
        {` ${value === 1 ? singular : plural}`}
      </Typography>
    </Box>
  )
}

Count.propTypes = {
  value: PropTypes.number.isRequired,
  singular: PropTypes.string.isRequired,
  plural: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
}

export default function TripSummaryCard({ trip }) {
  const metrics = calculateTripMetrics(trip.segments, trip.current_cycle_used)
  const dayCount = splitSegmentsByDay(trip.segments, trip.timezone).length
  const expectedArrival = metrics.expectedArrival
    ? new Date(metrics.expectedArrival).toLocaleString('en-US', {
        timeZone: trip.timezone,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
      })
    : '—'

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 3, lg: 6 },
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            {trip.stops.map((stop, index) => (
              <Fragment key={stop.type}>
                {index > 0 && (
                  <ArrowForwardRoundedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                )}
                <Stop stop={stop} />
              </Fragment>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
            gap: { xs: 2.5, md: 4 },
          }}
        >
          <Stat
            label="Distance"
            value={`${Math.round(trip.total_distance_miles).toLocaleString('en-US')} mi`}
          />
          <Stat
            label="Driving time"
            value={formatDurationWords(trip.total_duration_hours)}
            hint={HOS_HINTS.drivingTime}
          />
          <Stat
            label="Total trip time"
            value={formatDurationWords(metrics.totalElapsedHours)}
            hint={HOS_HINTS.totalTripTime}
          />
          <Stat label="Expected arrival" value={expectedArrival} />
          <Stat
            label="Final cycle used"
            value={`${metrics.finalCycleUsed.toFixed(2).replace(/\.00$/, '')} / 70 h`}
            hint={HOS_HINTS.cycle}
          />
          <Stat
            label="Cycle remaining"
            value={`${metrics.cycleRemaining.toFixed(2).replace(/\.00$/, '')} h`}
            hint={metrics.counts.restarts ? HOS_HINTS.restart : HOS_HINTS.cycle}
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 3, rowGap: 1 }}>
          <Count value={dayCount} singular="day on the road" plural="days on the road" color={STOP_COLORS.dropoff} />
          <Count value={metrics.counts.restStops} singular="rest stop" plural="rest stops" color={STATUS_COLORS[DUTY_STATUS.OFF_DUTY]} />
          <Count value={metrics.counts.breaks} singular="30-min break" plural="30-min breaks" color={STATUS_COLORS[DUTY_STATUS.OFF_DUTY]} />
          <Count value={metrics.counts.fuelStops} singular="fuel stop" plural="fuel stops" color={STATUS_COLORS[DUTY_STATUS.ON_DUTY]} />
        </Box>
      </CardContent>
    </Card>
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
