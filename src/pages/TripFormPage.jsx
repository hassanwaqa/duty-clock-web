import { Box, Container, Typography } from '@mui/material'
import AppMasthead from '../components/common/AppMasthead'
import TripForm from '../components/trip-form/TripForm'
import { layout } from '../lib/designTokens'

export default function TripFormPage() {
  return (
    <>
      <AppMasthead stamp="Hours-of-service trip planner" />

      <Container sx={{ py: { xs: 5, md: 8 }, maxWidth: `${layout.formMaxWidth}px !important` }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="stamp" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
            Form · 49 CFR 395.8
          </Typography>
          <Typography variant="h1" component="h1" sx={{ mb: 1.5 }}>
            Plan a trip
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Enter the route and hours already used in the 70-hour / 8-day cycle. You&apos;ll get the
            mapped route and a driver&apos;s daily log sheet for every day the trip spans.
          </Typography>
        </Box>

        <Box sx={{ border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: { xs: 2.5, md: 3 } }}>
          <TripForm />
        </Box>
      </Container>
    </>
  )
}
