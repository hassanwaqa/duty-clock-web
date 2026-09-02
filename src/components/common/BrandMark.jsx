import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { colors } from '../../lib/designTokens'

export default function BrandMark({ showWordmark = true }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Box
        component="svg"
        viewBox="0 0 48 48"
        sx={{ width: 22, height: 22, display: 'block', flexShrink: 0 }}
        aria-hidden="true"
      >
        <rect width="48" height="48" fill={colors.ink} />
        <path
          d="M7 11.5v29M17.25 11.5v29M27.5 11.5v29M37.75 11.5v29"
          fill="none"
          stroke={colors.surface}
          strokeOpacity="0.22"
          strokeWidth="1.5"
        />
        <path d="M7 16h11v11h13v11h10" fill="none" stroke={colors.ochre} strokeWidth="3.5" />
      </Box>
      {showWordmark && (
        <Typography variant="stamp" sx={{ color: 'text.primary' }}>
          The Duty Clock
        </Typography>
      )}
    </Box>
  )
}

BrandMark.propTypes = { showWordmark: PropTypes.bool }
