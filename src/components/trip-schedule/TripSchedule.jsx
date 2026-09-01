import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { DUTY_STATUS, STATUS_COLORS, STATUS_LABELS } from '../../lib/constants'
import { dayKey, formatDurationWords, formatHHMM } from '../../lib/time'

function shortDay(isoString, timezone) {
  return new Date(isoString).toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function timeRange(segment, timezone) {
  const startsOn = dayKey(new Date(segment.start), timezone)
  const endsOn = dayKey(new Date(segment.end), timezone)
  if (startsOn === endsOn) {
    return `${shortDay(segment.start, timezone)} · ${formatHHMM(segment.start, timezone)}–${formatHHMM(segment.end, timezone)}`
  }
  return `${shortDay(segment.start, timezone)} ${formatHHMM(segment.start, timezone)} → ${shortDay(segment.end, timezone)} ${formatHHMM(segment.end, timezone)}`
}

function segmentDuration(segment) {
  return (new Date(segment.end) - new Date(segment.start)) / 3_600_000
}

function milesLabel(segment) {
  if (segment.status !== DUTY_STATUS.DRIVING || !Number.isFinite(segment.distance_miles)) return null
  return `${Math.round(segment.distance_miles).toLocaleString('en-US')} mi`
}

export default function TripSchedule({ segments, timezone, onSegmentHover }) {
  return (
    <Card>
      <CardContent>
        <Stack spacing={0.5} sx={{ mb: 2.5 }}>
          <Typography variant="h3" component="h3">
            Scheduled activity
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Driving, required rest, fuel and service events in chronological order.
          </Typography>
        </Stack>

        <Box component="ol" sx={{ p: 0, m: 0, listStyle: 'none' }}>
          {segments.map((segment, index) => {
            const duration = segmentDuration(segment)
            const miles = milesLabel(segment)
            return (
              <Box
                component="li"
                key={`${segment.start}-${segment.status}-${index}`}
                onMouseEnter={() => onSegmentHover?.(segment)}
                onMouseLeave={() => onSegmentHover?.(null)}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '18px minmax(0, 1fr)', sm: '18px minmax(0, 1fr) auto' },
                  columnGap: 1.5,
                  py: 1.5,
                  borderTop: index ? '1px solid' : 0,
                  borderColor: 'divider',
                  alignItems: 'start',
                  borderRadius: 1,
                  transition: 'background-color 120ms ease',
                  '&:hover': { bgcolor: 'primary.light' },
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    mt: 0.65,
                    borderRadius: '50%',
                    bgcolor: STATUS_COLORS[segment.status],
                    boxShadow: '0 0 0 3px white',
                  }}
                />

                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {segment.note ?? STATUS_LABELS[segment.status]}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {segment.location}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    gridColumn: { xs: '2', sm: 'auto' },
                    textAlign: { xs: 'left', sm: 'right' },
                    pl: { xs: 0, sm: 2 },
                    mt: { xs: 0.5, sm: 0 },
                  }}
                >
                  <Typography
                    variant="mono"
                    sx={{ display: 'block', whiteSpace: { xs: 'normal', sm: 'nowrap' } }}
                  >
                    {timeRange(segment, timezone)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {[formatDurationWords(duration), miles].filter(Boolean).join(' · ')}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </CardContent>
    </Card>
  )
}

TripSchedule.propTypes = {
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      note: PropTypes.string,
      distance_miles: PropTypes.number,
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
  ).isRequired,
  timezone: PropTypes.string.isRequired,
  onSegmentHover: PropTypes.func,
}
