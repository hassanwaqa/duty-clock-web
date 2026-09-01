import { Card, CardContent, Container, Stack, Typography } from '@mui/material'
import BrandMark from '../components/common/BrandMark'
import TripForm from '../components/trip-form/TripForm'
import { layout } from '../lib/designTokens'

export default function TripFormPage() {
  return (
    <Container sx={{ py: { xs: 5, md: 8 }, maxWidth: `${layout.formMaxWidth}px !important` }}>
      <Stack spacing={1.5} sx={{ mb: 4 }}>
        <BrandMark />
        <Typography variant="h1" component="h1">
          Plan a trip
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Enter the route and hours already used in the 70-hour / 8-day cycle. You&apos;ll get the
          mapped route and a driver&apos;s daily log sheet for every day the trip spans.
        </Typography>
      </Stack>

      <Card>
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <TripForm />
        </CardContent>
      </Card>
    </Container>
  )
}
