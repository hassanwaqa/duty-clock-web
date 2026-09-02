import { Box, Stack, Tooltip, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { STATUS_COLORS } from '../../lib/constants'
import { formatDurationWords } from '../../lib/time'

const formatMiles = (miles) =>
  Number.isFinite(miles) ? `${Math.round(miles).toLocaleString('en-US')} mi` : null

function Endpoint({ side }) {
  return (
    <Box
      sx={{
        position: 'absolute',
        [side]: 0,
        top: '50%',
        transform: 'translate(-50%, -50%)',
        ...(side === 'right' && { transform: 'translate(50%, -50%)' }),
        width: 11,
        height: 11,
        borderRadius: '50%',
        bgcolor: 'primary.main',
        border: '2px solid',
        borderColor: 'background.paper',
      }}
    />
  )
}

Endpoint.propTypes = { side: PropTypes.oneOf(['left', 'right']).isRequired }

export default function LegOverview({ index, title, from, to, leg, events }) {
  const meta = [formatMiles(leg?.distance_miles), formatDurationWords(leg?.duration_hours)]
    .filter(Boolean)
    .join(' · ')

  return (
    <Box
      sx={{
        mb: 2,
        mx: -1.5,
        px: 1.5,
        py: 1.5,
        borderRadius: 1,
        bgcolor: 'background.default',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 0.25, sm: 2 }}
        sx={{ justifyContent: 'space-between', alignItems: { sm: 'baseline' } }}
      >
        <Typography variant="overline" sx={{ color: 'text.secondary' }}>
          {`Leg ${index + 1} · ${title}`}
        </Typography>
        <Typography variant="mono" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {meta}
        </Typography>
      </Stack>

      <Box sx={{ position: 'relative', height: 6, borderRadius: 3, bgcolor: 'primary.light', mt: 2.5, mx: 1 }}>
        <Endpoint side="left" />
        {events.map((event) => (
          <Tooltip
            key={event.key}
            arrow
            enterTouchDelay={0}
            title={`${event.note} · ${Math.round(event.atMiles).toLocaleString('en-US')} mi into the leg`}
          >
            <Box
              sx={{
                position: 'absolute',
                left: `${event.position}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 10,
                height: 10,
                borderRadius: '50%',
                bgcolor: STATUS_COLORS[event.status],
                border: '2px solid',
                borderColor: 'background.paper',
                cursor: 'help',
                transition: 'transform 120ms ease',
                '&:hover': { transform: 'translate(-50%, -50%) scale(1.35)' },
              }}
            />
          </Tooltip>
        ))}
        <Endpoint side="right" />
      </Box>

      <Stack direction="row" sx={{ mt: 1, justifyContent: 'space-between', gap: 2 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', minWidth: 0 }}>
          {from}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'right', minWidth: 0 }}>
          {to}
        </Typography>
      </Stack>
    </Box>
  )
}

LegOverview.propTypes = {
  index: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  from: PropTypes.string,
  to: PropTypes.string,
  leg: PropTypes.shape({ distance_miles: PropTypes.number, duration_hours: PropTypes.number }),
  events: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      note: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      atMiles: PropTypes.number.isRequired,
      position: PropTypes.number.isRequired,
    }),
  ).isRequired,
}
