import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Box, Card, CardContent, Divider, Typography } from '@mui/material'
import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { STOP_COLORS, STOP_LABELS } from '../../lib/constants'
import { calculateTripMetrics, formatDurationWords } from '../../lib/time'

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

function Stat({ label, value }) {
  return (
    <Box>
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block' }}>
        {label}
      </Typography>
      <Typography variant="monoLarge">{value}</Typography>
    </Box>
  )
}

Stat.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

export default function TripSummaryCard({ trip }) {
  const metrics = calculateTripMetrics(trip.segments, trip.current_cycle_used)
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
          <Stat label="Driving time" value={formatDurationWords(trip.total_duration_hours)} />
          <Stat label="Total trip time" value={formatDurationWords(metrics.totalElapsedHours)} />
          <Stat label="Expected arrival" value={expectedArrival} />
          <Stat label="Final cycle used" value={`${metrics.finalCycleUsed.toFixed(2).replace(/\.00$/, '')} / 70 h`} />
          <Stat label="Cycle remaining" value={`${metrics.cycleRemaining.toFixed(2).replace(/\.00$/, '')} h`} />
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
