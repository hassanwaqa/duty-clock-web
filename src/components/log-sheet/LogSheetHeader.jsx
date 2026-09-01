import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

function Field({ label, value, span = 1 }) {
  return (
    <Box sx={{ minWidth: 0, gridColumn: { xs: 'span 1', md: `span ${span}` } }}>
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block' }}>
        {label}
      </Typography>
      <Box
        sx={{
          minHeight: 28,
          pb: 0.5,
          display: 'flex',
          alignItems: 'flex-end',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: value ? 500 : 400, overflowWrap: 'anywhere' }}>
          {value || '\u00A0'}
        </Typography>
      </Box>
    </Box>
  )
}

Field.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  span: PropTypes.number,
}

function hoursLabel(value) {
  if (!Number.isFinite(value)) return ''
  return `${value.toLocaleString('en-US', { maximumFractionDigits: 2 })} h`
}

export default function LogSheetHeader({ day, trip }) {
  const miles = Math.round(day.totalMilesDriving).toLocaleString('en-US')

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
          gap: { xs: 1.75, md: 2.25 },
        }}
      >
        <Field label="From" value={day.from} span={2} />
        <Field label="To" value={day.to} span={2} />
        <Field label="Total miles driving today" value={miles} />
        <Field label="Driver" value={trip.driver_name} />
        <Field label="Carrier" value={trip.carrier_name} span={2} />
        <Field label="Home terminal" value={trip.home_terminal} span={2} />
        <Field label="Truck number" value={trip.truck_number} />
        <Field label="Trailer number" value={trip.trailer_number} />
        <Field label="Shipping document" value={trip.shipping_document} span={2} />
        <Field label="Co-driver" value="" />
        <Field label="Driver signature" value="" />
      </Box>

      <Box
        sx={{
          mt: 2.5,
          p: { xs: 1.75, sm: 2 },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
          gap: 2,
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Typography variant="overline" sx={{ color: 'text.secondary', gridColumn: '1 / -1' }}>
          Cycle recap
        </Typography>
        <Field label="70-hour / 8-day total" value={hoursLabel(day.recap.eightDayTotal)} />
        <Field label="Hours available tomorrow" value={hoursLabel(day.recap.hoursAvailableTomorrow)} />
        <Field label="60-hour / 7-day total" value="" />
        <Field label="Dated daily history" value="" />
      </Box>
    </Box>
  )
}

LogSheetHeader.propTypes = {
  day: PropTypes.shape({
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    totalMilesDriving: PropTypes.number.isRequired,
    recap: PropTypes.shape({
      eightDayTotal: PropTypes.number.isRequired,
      hoursAvailableTomorrow: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  trip: PropTypes.shape({
    driver_name: PropTypes.string,
    carrier_name: PropTypes.string,
    home_terminal: PropTypes.string,
    truck_number: PropTypes.string,
    trailer_number: PropTypes.string,
    shipping_document: PropTypes.string,
  }).isRequired,
}
