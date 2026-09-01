import { Stack } from '@mui/material'
import PropTypes from 'prop-types'
import { useDaySheets } from '../../hooks/useDaySheets'
import LogSheet from './LogSheet'

export default function LogSheetSet({ trip }) {
  const days = useDaySheets(trip.segments, trip.timezone ?? 'UTC', trip.current_cycle_used)

  return (
    <Stack spacing={3}>
      {days.map((day) => (
        <LogSheet key={day.dayKey} day={day} trip={trip} />
      ))}
    </Stack>
  )
}

LogSheetSet.propTypes = {
  trip: PropTypes.shape({
    timezone: PropTypes.string,
    current_cycle_used: PropTypes.number.isRequired,
    segments: PropTypes.arrayOf(
      PropTypes.shape({
        status: PropTypes.string.isRequired,
        start: PropTypes.string.isRequired,
        end: PropTypes.string.isRequired,
        location: PropTypes.string,
        note: PropTypes.string,
        distance_miles: PropTypes.number,
      }),
    ).isRequired,
  }).isRequired,
}
