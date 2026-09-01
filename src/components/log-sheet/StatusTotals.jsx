import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { ROW_ORDER, STATUS_COLORS, STATUS_SHORT_LABELS } from '../../lib/constants'
import { formatRowTotals } from '../../lib/time'

export default function StatusTotals({ totals }) {
  const rowTotals = formatRowTotals(totals)

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {ROW_ORDER.map((status) => (
        <Box
          key={status}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            pl: 1,
            pr: 1.25,
            py: 0.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            opacity: totals[status] > 0 ? 1 : 0.55,
          }}
        >
          <Box
            sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: STATUS_COLORS[status] }}
          />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {STATUS_SHORT_LABELS[status]}
          </Typography>
          <Typography
            variant="mono"
            sx={{ color: totals[status] > 0 ? STATUS_COLORS[status] : 'text.secondary', fontWeight: 600 }}
          >
            {rowTotals.rows[status]}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

StatusTotals.propTypes = {
  totals: PropTypes.objectOf(PropTypes.number).isRequired,
}
