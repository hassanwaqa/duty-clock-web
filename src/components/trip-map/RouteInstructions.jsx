import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import { STOP_LABELS } from '../../lib/constants'
import { formatDurationWords } from '../../lib/time'

const legPointLabel = (value) => STOP_LABELS[value] ?? value

function formatMiles(miles) {
  if (!Number.isFinite(miles)) return '—'
  const digits = miles < 10 ? 1 : 0
  return `${miles.toLocaleString('en-US', { maximumFractionDigits: digits })} mi`
}

export default function RouteInstructions({ legs, onStepHover }) {
  return (
    <Stack spacing={1.25}>
      {legs.map((leg, legIndex) => (
        <Accordion
          key={`${leg.from}-${leg.to}`}
          defaultExpanded={legIndex === 0}
          disableGutters
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '10px !important',
            boxShadow: 'none',
            overflow: 'hidden',
            '&::before': { display: 'none' },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreRoundedIcon />}
            sx={{
              px: { xs: 2, sm: 2.5 },
              minHeight: 64,
              '& .MuiAccordionSummary-content': { my: 1.5, minWidth: 0 },
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 0.5, sm: 2 }}
              sx={{ width: '100%', pr: 1, justifyContent: 'space-between', minWidth: 0 }}
            >
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {`${legPointLabel(leg.from)} → ${legPointLabel(leg.to)}`}
              </Typography>
              <Typography variant="mono" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                {`${formatMiles(leg.distance_miles)} · ${formatDurationWords(leg.duration_hours)}`}
              </Typography>
            </Stack>
          </AccordionSummary>
          <AccordionDetails sx={{ px: { xs: 2, sm: 2.5 }, pt: 0, pb: 1 }}>
            <Box component="ol" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              {leg.steps.map((step, stepIndex) => (
                <Box
                  component="li"
                  key={`${stepIndex}-${step.instruction}`}
                  onMouseEnter={() => onStepHover?.(step)}
                  onMouseLeave={() => onStepHover?.(null)}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '28px minmax(0, 1fr) max-content',
                    gap: 1.5,
                    alignItems: 'baseline',
                    py: 1.25,
                    borderTop: stepIndex ? '1px solid' : 0,
                    borderColor: 'divider',
                    borderRadius: 1,
                    transition: 'background-color 120ms ease',
                    '&:hover': { bgcolor: 'primary.light' },
                  }}
                >
                  <Typography variant="mono" sx={{ color: 'text.secondary', textAlign: 'right' }}>
                    {stepIndex + 1}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    {step.instruction}
                  </Typography>
                  <Typography variant="mono" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    {formatMiles(step.distance_miles)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Stack>
  )
}

RouteInstructions.propTypes = {
  legs: PropTypes.arrayOf(
    PropTypes.shape({
      from: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
      distance_miles: PropTypes.number.isRequired,
      duration_hours: PropTypes.number.isRequired,
      steps: PropTypes.arrayOf(
        PropTypes.shape({
          instruction: PropTypes.string.isRequired,
          distance_miles: PropTypes.number.isRequired,
          duration_hours: PropTypes.number.isRequired,
          lat: PropTypes.number.isRequired,
          lng: PropTypes.number.isRequired,
        }),
      ).isRequired,
    }),
  ).isRequired,
  onStepHover: PropTypes.func,
}
