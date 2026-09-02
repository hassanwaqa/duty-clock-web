import { Box, Container, Typography } from '@mui/material'
import AppMasthead from '../components/common/AppMasthead'
import HaulPanel from '../components/trip-form/HaulPanel'
import TripForm from '../components/trip-form/TripForm'
import { colors, layout } from '../lib/designTokens'

const FOLD = `calc(100vh - ${layout.mastheadOffset}px)`

export default function TripFormPage() {
  return (
    <>
      <AppMasthead stamp="Hours-of-service trip planner" />
      <Box component="section" sx={{ position: 'relative', minHeight: { md: FOLD } }}>
        <Box
          aria-hidden="true"
          sx={{ position: 'absolute', inset: 0, right: { xs: 0, md: '50%' }, bgcolor: 'background.paper' }}
        />
        <Box
          aria-hidden="true"
          sx={{
            display: { xs: 'none', md: 'block' },
            position: 'absolute',
            inset: 0,
            left: '50%',
            bgcolor: colors.ink,
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              minHeight: { md: FOLD },
            }}
          >
            <Box sx={{ py: { xs: 4, md: 4 }, pr: { md: 5 } }}>
              <Typography variant="stamp" sx={{ color: 'text.secondary', display: 'block', mb: 1.25 }}>
                Form · 49 CFR 395.8
              </Typography>
              <Typography variant="h1" component="h1" sx={{ mb: { xs: 1.25, md: 3 } }}>
                Plan a trip
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: 'text.secondary', mb: 2.5, display: { xs: 'block', md: 'none' } }}
              >
                Enter the route and hours already used in the 70-hour / 8-day cycle. You&apos;ll get
                the mapped route and a driver&apos;s daily log sheet for every day the trip spans.
              </Typography>

              <TripForm />
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'block' }, pl: 5 }}>
              <Box
                sx={{
                  position: 'sticky',
                  top: `${layout.mastheadOffset}px`,
                  minHeight: FOLD,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  py: 4,
                }}
              >
                <HaulPanel />
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  )
}
