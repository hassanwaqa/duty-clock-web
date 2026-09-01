import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { formatDayLabel } from '../../lib/time'
import LogGrid from './LogGrid'
import LogSheetHeader from './LogSheetHeader'
import RemarksStrip from './RemarksStrip'
import StatusTotals from './StatusTotals'

export default function LogSheet({ day, trip }) {
  return (
    <Card className="log-sheet-card">
      <CardContent>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ mb: 3, justifyContent: 'space-between', alignItems: { md: 'flex-start' } }}
        >
          <Box>
            <Typography variant="h3" component="h3">
              {formatDayLabel(day.dayKey)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {`Driver's daily log · ${day.timezone}`}
            </Typography>
          </Box>
          <StatusTotals totals={day.totals} />
        </Stack>

        <LogSheetHeader day={day} trip={trip} />

        <LogGrid daySegments={day.segments} totals={day.totals} timezone={day.timezone} />

        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 1.25, color: 'text.secondary' }}
        >
          Off-duty time after trip completion is assumed for planning purposes; the same
          assumption is used before the first planned event.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
          Remarks
        </Typography>
        <RemarksStrip daySegments={day.segments} timezone={day.timezone} />
      </CardContent>
    </Card>
  )
}

LogSheet.propTypes = {
  day: PropTypes.shape({
    dayKey: PropTypes.string.isRequired,
    segments: PropTypes.array.isRequired,
    totals: PropTypes.objectOf(PropTypes.number).isRequired,
    timezone: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    totalMilesDriving: PropTypes.number.isRequired,
    recap: PropTypes.object.isRequired,
  }).isRequired,
  trip: PropTypes.object.isRequired,
}
