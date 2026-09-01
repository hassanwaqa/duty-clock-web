import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { Fragment } from 'react'
import { STATUS_COLORS } from '../../lib/constants'
import { formatHHMM } from '../../lib/time'

export default function RemarksStrip({ daySegments, timezone }) {
  const reported = daySegments.filter((segment) => !segment.implied)

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'max-content 1fr',
        columnGap: 2,
        rowGap: 1,
        alignItems: 'baseline',
      }}
    >
      {reported.map((segment) => (
        <Fragment key={segment.start}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: STATUS_COLORS[segment.status],
                flexShrink: 0,
              }}
            />
            <Typography variant="mono" sx={{ color: 'text.primary' }}>
              {formatHHMM(segment.start, timezone)}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <Box component="span" sx={{ color: 'text.primary' }}>
              {segment.location}
            </Box>
            {segment.note ? ` — ${segment.note}` : ''}
          </Typography>
        </Fragment>
      ))}
    </Box>
  )
}

RemarksStrip.propTypes = {
  daySegments: PropTypes.arrayOf(
    PropTypes.shape({
      start: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      location: PropTypes.string,
      note: PropTypes.string,
      implied: PropTypes.bool,
    }),
  ).isRequired,
  timezone: PropTypes.string.isRequired,
}
