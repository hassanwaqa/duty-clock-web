import { Box, Typography } from '@mui/material'
import { colors } from '../../lib/designTokens'

export default function BrandMark() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
      <Box
        component="svg"
        viewBox="0 0 48 48"
        sx={{ width: 26, height: 26, display: 'block', flexShrink: 0 }}
        aria-hidden="true"
      >
        <rect width="48" height="48" rx="11" fill={colors.teal} />
        <path d="M7 16h11v11h13v11h10" fill="none" stroke={colors.tealAccent} strokeWidth="3.5" />
        <path
          d="M7 11.5v29M17.25 11.5v29M27.5 11.5v29M37.75 11.5v29"
          fill="none"
          stroke={colors.surface}
          strokeOpacity="0.28"
          strokeWidth="1.5"
        />
      </Box>
      <Typography variant="overline" sx={{ color: 'text.secondary' }}>
        The Duty Clock
      </Typography>
    </Box>
  )
}
