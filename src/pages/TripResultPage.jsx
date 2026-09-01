import AddRoundedIcon from '@mui/icons-material/AddRounded'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import BrandMark from '../components/common/BrandMark'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
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

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 4, justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}
      >
        <Stack spacing={1.5}>
          <BrandMark />
          <Typography variant="h1" component="h1">
            Trip plan
          </Typography>
        </Stack>
        <Button
          component={RouterLink}
          to="/"
          variant="outlined"
          startIcon={<AddRoundedIcon fontSize="small" />}
        >
          Plan another trip
        </Button>
      </Stack>

      {isPending && <LoadingState />}

      {isError && (
        <ErrorState title="Could not load this trip" message={error.message} onRetry={refetch} />
      )}

      {trip && (
        <Stack spacing={5}>
          <TripSummaryCard trip={trip} />

          <Box component="section">
            <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
              Route
            </Typography>
            <RouteMap
              routeGeometry={trip.route_geometry}
              stops={trip.stops}
              segments={trip.segments}
              timezone={trip.timezone ?? 'UTC'}
              highlightedStep={highlightedPoint}
            />
          </Box>

          <Box component="section">
            <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
              Trip schedule
            </Typography>
            <TripSchedule
              segments={trip.segments}
              timezone={trip.timezone ?? 'UTC'}
              onSegmentHover={setHighlightedPoint}
            />
          </Box>

          {trip.legs?.length > 0 && (
            <Box component="section">
              <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
                Route instructions
              </Typography>
              <RouteInstructions legs={trip.legs} onStepHover={setHighlightedPoint} />
            </Box>
          )}

          <Box component="section">
            <Typography variant="h2" component="h2" sx={{ mb: 2 }}>
              Daily log sheets
            </Typography>
            <LogSheetSet trip={trip} />
          </Box>
        </Stack>
      )}
    </Container>
  )
}
