import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { Box, Button, Container, Stack } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import AppMasthead from '../components/common/AppMasthead'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import SectionRule from '../components/common/SectionRule'
import LogSheetSet from '../components/log-sheet/LogSheetSet'
import RouteMap from '../components/trip-map/RouteMap'
import RouteInstructions from '../components/trip-map/RouteInstructions'
import TripSchedule from '../components/trip-schedule/TripSchedule'
import TripSummaryCard from '../components/trip-summary/TripSummaryCard'
import { useTripPlan } from '../hooks/useTripPlan'

export default function TripResultPage() {
  const { id } = useParams()
  const { data: trip, isPending, isError, error, refetch } = useTripPlan(id)
  const [highlightedPoint, setHighlightedPoint] = useState(null)

  const route = trip
    ? `${trip.current_location} → ${trip.dropoff_location}`
    : `Trip ${id}`

  return (
    <>
      <AppMasthead
        stamp={route}
        actions={
          <Button
            component={RouterLink}
            to="/"
            size="small"
            variant="outlined"
            startIcon={<AddRoundedIcon fontSize="small" />}
          >
            New trip
          </Button>
        }
      />

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {isPending && <LoadingState />}

        {isError && (
          <ErrorState title="Could not load this trip" message={error.message} onRetry={refetch} />
        )}

        {trip && (
          <Stack spacing={{ xs: 4, md: 5 }}>
            <Box className="no-print">
              <TripSummaryCard trip={trip} />
            </Box>

            <Box component="section" className="no-print">
              <SectionRule>Route</SectionRule>
              <RouteMap
                routeGeometry={trip.route_geometry}
                stops={trip.stops}
                segments={trip.segments}
                timezone={trip.timezone ?? 'UTC'}
                highlightedStep={highlightedPoint}
              />
            </Box>

            <Box component="section" className="no-print">
              <SectionRule>Trip schedule</SectionRule>
              <TripSchedule
                segments={trip.segments}
                timezone={trip.timezone ?? 'UTC'}
                legs={trip.legs}
                stops={trip.stops}
                onSegmentHover={setHighlightedPoint}
              />
            </Box>

            {trip.legs?.length > 0 && (
              <Box component="section" className="no-print">
                <SectionRule>Route instructions</SectionRule>
                <RouteInstructions legs={trip.legs} onStepHover={setHighlightedPoint} />
              </Box>
            )}

            <Box component="section">
              <Box className="no-print">
                <SectionRule>Daily log sheets</SectionRule>
              </Box>
              <LogSheetSet trip={trip} />
            </Box>
          </Stack>
        )}
      </Container>
    </>
  )
}
