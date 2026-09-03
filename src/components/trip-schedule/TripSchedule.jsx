import { Box, Card, CardContent, Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { DUTY_STATUS, STATUS_COLORS, STATUS_LABELS } from '../../lib/constants'
import { legEventPositions, splitSegmentsByLeg } from '../../lib/legs'
import { dayKey, formatDurationWords, formatHHMM } from '../../lib/time'
import LegOverview from './LegOverview'

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

function ScheduleRow({ segment, timezone, showDivider, onHover }) {
  const duration = segmentDuration(segment)
  const miles = milesLabel(segment)

  return (
    <Box
      component="li"
      tabIndex={0}
      onMouseEnter={() => onHover?.(segment)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(segment)}
      onBlur={() => onHover?.(null)}
      sx={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: { xs: '18px minmax(0, 1fr)', sm: '18px minmax(0, 1fr) auto' },
        columnGap: 1.5,
        alignItems: 'start',
        py: 1.5,
        px: 3,
        mx: -3,
        outline: 'none',
        borderTop: showDivider ? '1px solid' : 0,
        borderColor: 'divider',
        transition: 'background-color 120ms ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          insetBlock: 0,
          left: 0,
          width: 3,
          bgcolor: STATUS_COLORS[segment.status],
          opacity: 0,
          transition: 'opacity 120ms ease',
        },
        '&:hover, &:focus-visible': { bgcolor: 'action.hover' },
        '&:hover::before, &:focus-visible::before': { opacity: 1 },
      }}
    >
      <Box
        sx={{
          width: 10,
          height: 10,
          mt: 0.65,
          borderRadius: '50%',
          bgcolor: STATUS_COLORS[segment.status],
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
}

ScheduleRow.propTypes = {
  segment: PropTypes.object.isRequired,
  timezone: PropTypes.string.isRequired,
  showDivider: PropTypes.bool,
  onHover: PropTypes.func,
}

export default function TripSchedule({ segments, timezone, legs, stops, onSegmentHover }) {
  const groups = splitSegmentsByLeg(segments, legs, stops)

  return (
    <Card>
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2.5 }}>
          Driving, required rest, fuel and service events in chronological order.
        </Typography>

        <Stack spacing={3}>
          {groups.map((group, groupIndex) => (
            <Box key={group.key}>
              {group.title && (
                <LegOverview
                  index={groupIndex}
                  title={group.title}
                  from={group.from}
                  to={group.to}
                  leg={group.leg}
                  events={legEventPositions(group.segments, group.leg?.distance_miles)}
                />
              )}

              <Box component="ol" sx={{ p: 0, m: 0, listStyle: 'none' }}>
                {group.segments.map((segment, index) => (
                  <ScheduleRow
                    key={`${segment.start}-${segment.status}-${index}`}
                    segment={segment}
                    timezone={timezone}
                    showDivider={index > 0}
                    onHover={onSegmentHover}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Stack>
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
  legs: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string,
      to: PropTypes.string,
      distance_miles: PropTypes.number,
      duration_hours: PropTypes.number,
    }),
  ),
  stops: PropTypes.arrayOf(
    PropTypes.shape({ type: PropTypes.string, label: PropTypes.string }),
  ),
  onSegmentHover: PropTypes.func,
}
