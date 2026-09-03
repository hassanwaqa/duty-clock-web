import { Box, Container, Typography } from '@mui/material'
import BrandMark from '../components/common/BrandMark'
import ColumnHeader from '../components/common/ColumnHeader'
import DutyRulesPanel from '../components/trip-form/DutyRulesPanel'
import { colors, layout, tickRule } from '../lib/designTokens'
import TripForm from '../components/trip-form/TripForm'

const TICK_HEIGHT = 5
const BORDER_HEIGHT = 1

function SideChrome({ side, bg, tickColor, borderColor }) {
  const edge =
    side === 'left'
      ? { left: 0, right: { xs: 0, md: '50%' } }
      : { left: '50%', right: 0 }
  return (
    <Box aria-hidden="true" sx={{ position: 'absolute', inset: 0, display: { xs: side === 'left' ? 'block' : 'none', md: 'block' }, ...edge }}>
      <Box sx={{ position: 'absolute', inset: 0, bgcolor: bg }} />
      <Box
        sx={{
          position: 'absolute',
          top: `${layout.mastheadHeight}px`,
          left: 0,
          right: 0,
          height: `${TICK_HEIGHT}px`,
          backgroundImage: tickRule(tickColor),
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: `${layout.mastheadHeight + TICK_HEIGHT}px`,
          left: 0,
          right: 0,
          height: `${BORDER_HEIGHT}px`,
          bgcolor: borderColor,
        }}
      />
    </Box>
  )
}

export default function TripFormPage() {
  return (
    <Box component="section" sx={{ position: 'relative', minHeight: '100vh' }}>
      <SideChrome side="left" bg={colors.paper} tickColor={colors.rule} borderColor={colors.rule} />
      <SideChrome side="right" bg={colors.ink} tickColor={colors.panelRule} borderColor={colors.panelRule} />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            minHeight: { md: '100vh' },
          }}
        >
          <Box sx={{ pb: 3.5, pr: { md: 5 } }}>
            <ColumnHeader>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, width: '100%' }}>
                <BrandMark />
                <Typography variant="stamp" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                  Form · 49 CFR 395.8
                </Typography>
              </Box>
            </ColumnHeader>

            <Typography variant="h1" component="h1" sx={{ mb: 1.25 }}>
              Plan a trip
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2.5 }}>
              Give it three locations and your cycle hours. You&apos;ll get a routed map, a
              day-by-day schedule and a log sheet for every day the trip spans.
            </Typography>

            <TripForm />
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'block' }, pl: 5 }}>
            <Box sx={{ position: 'sticky', top: 0, pb: 4 }}>
              <DutyRulesPanel />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
