import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { STOP_COLORS, STOP_LABELS } from '../../lib/constants'
import { formatDurationWords } from '../../lib/time'

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
  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 3, lg: 6 },
            justifyContent: 'space-between',
            alignItems: 'center',
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

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <Stat
              label="Distance"
              value={`${Math.round(trip.total_distance_miles).toLocaleString('en-US')} mi`}
            />
            <Stat label="Route time" value={formatDurationWords(trip.total_duration_hours)} />
            <Stat label="Cycle used" value={`${trip.current_cycle_used} / 70 h`} />
          </Box>
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
  }).isRequired,
}
