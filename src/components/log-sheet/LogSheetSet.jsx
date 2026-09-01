import PrintRoundedIcon from '@mui/icons-material/PrintRounded'
import { Box, Button, Stack, Tab, Tabs } from '@mui/material'
import PropTypes from 'prop-types'
import { useState } from 'react'
import { useDaySheets } from '../../hooks/useDaySheets'
import LogSheet from './LogSheet'

export default function LogSheetSet({ trip }) {
  const days = useDaySheets(trip.segments, trip.timezone ?? 'UTC', trip.current_cycle_used)
  const [selectedDay, setSelectedDay] = useState(null)
  const activeDay = days.find((day) => day.dayKey === selectedDay) ?? days[0]

  return (
    <>
      <Box className="screen-only">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={1.5}
          sx={{ mb: 2, justifyContent: 'space-between', alignItems: { sm: 'center' } }}
        >
          <Tabs
            value={activeDay?.dayKey ?? false}
            onChange={(_event, dayKey) => setSelectedDay(dayKey)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            aria-label="Daily log sheets"
            sx={{ minWidth: 0 }}
          >
            {days.map((day, index) => (
              <Tab
                key={day.dayKey}
                value={day.dayKey}
                id={`log-tab-${day.dayKey}`}
                aria-controls={`log-panel-${day.dayKey}`}
                label={`Day ${index + 1} · ${day.dayKey}`}
              />
            ))}
          </Tabs>
          <Button
            variant="outlined"
            startIcon={<PrintRoundedIcon />}
            onClick={() => window.print()}
            sx={{ flexShrink: 0, alignSelf: { xs: 'flex-start', sm: 'center' } }}
          >
            Print logs
          </Button>
        </Stack>

        {activeDay && (
          <Box
            role="tabpanel"
            id={`log-panel-${activeDay.dayKey}`}
            aria-labelledby={`log-tab-${activeDay.dayKey}`}
          >
            <LogSheet day={activeDay} trip={trip} />
          </Box>
        )}
      </Box>

      <Stack className="print-only" spacing={0} aria-hidden="true">
        {days.map((day) => (
          <Box className="print-log-sheet" key={day.dayKey}>
            <LogSheet day={day} trip={trip} />
          </Box>
        ))}
      </Stack>
    </>
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
