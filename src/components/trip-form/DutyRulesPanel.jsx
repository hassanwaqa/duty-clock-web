import { Box, Typography } from '@mui/material'
import { useIsMutating } from '@tanstack/react-query'
import ColumnHeader from '../common/ColumnHeader'
import { PLAN_TRIP_MUTATION_KEY } from '../../hooks/usePlanTrip'
import { DUTY_STATUS, STATUS_COLORS, STATUS_LABELS } from '../../lib/constants'
import { colors } from '../../lib/designTokens'

const ROWS = [
  { key: DUTY_STATUS.OFF_DUTY, label: 'Off', y: 26 },
  { key: DUTY_STATUS.SLEEPER_BERTH, label: 'SB', y: 52 },
  { key: DUTY_STATUS.DRIVING, label: 'Drv', y: 78 },
  { key: DUTY_STATUS.ON_DUTY, label: 'On', y: 104 },
]

const GRID_LEFT = 34
const GRID_RIGHT = 306
const hourX = (hour) => GRID_LEFT + (hour / 24) * (GRID_RIGHT - GRID_LEFT)

const SEGMENTS = [
  { status: DUTY_STATUS.OFF_DUTY, start: 0, end: 6 },
  { status: DUTY_STATUS.ON_DUTY, start: 6, end: 7 },
  { status: DUTY_STATUS.DRIVING, start: 7, end: 13 },
  { status: DUTY_STATUS.OFF_DUTY, start: 13, end: 13.5 },
  { status: DUTY_STATUS.DRIVING, start: 13.5, end: 19 },
  { status: DUTY_STATUS.ON_DUTY, start: 19, end: 20 },
  { status: DUTY_STATUS.OFF_DUTY, start: 20, end: 24 },
]

const rowY = (status) => ROWS.find((row) => row.key === status).y

const DUTY_PATH = SEGMENTS.map((segment, index) => {
  const y = rowY(segment.status)
  const start = `${hourX(segment.start)},${y}`
  const end = `${hourX(segment.end)},${y}`
  // index 0 moves to the start point; every later segment's L to its own
  // start point is what draws the vertical connector from the previous row.
  return index === 0 ? `M${start}L${end}` : `L${start}L${end}`
}).join('')

// A hard-stop gradient along the x-axis, so the single animated path shows
// each segment in its true status colour instead of one flat accent — the
// legend swatches below read straight off this same STATUS_COLORS map, so
// the sample and its legend can never disagree on what a colour means.
const GRADIENT_STOPS = SEGMENTS.flatMap((segment) => {
  const color = STATUS_COLORS[segment.status]
  return [
    { offset: segment.start / 24, color },
    { offset: segment.end / 24, color },
  ]
})

// Every limit the scheduling engine applies, with the values it actually uses
// (hos/constants.py) — not a restatement of the app's own feature list.
const RULES = [
  ['Driving limit', '11 h'],
  ['On-duty window', '14 h'],
  ['Break after 8 h driving', '30 min'],
  ['Cycle limit', '70 h / 8 days'],
  ['Off-duty reset', '10 h'],
  ['Cycle restart', '34 h'],
  ['Fuel stop interval', '1,000 mi'],
]

export default function DutyRulesPanel() {
  const isPlanning = useIsMutating({ mutationKey: PLAN_TRIP_MUTATION_KEY }) > 0

  return (
    <Box
      data-planning={isPlanning ? 'true' : 'false'}
      sx={{
        display: 'flex',
        flexDirection: 'column',

        '@keyframes drawDuty': {
          '0%': { strokeDashoffset: 1, opacity: 1 },
          '68%': { strokeDashoffset: 0, opacity: 1 },
          '90%': { strokeDashoffset: 0, opacity: 1 },
          '100%': { strokeDashoffset: 0, opacity: 0 },
        },
        '& .duty-line': { animation: 'drawDuty 9s ease-in-out infinite' },
        // Planning is the same day, recorded in a hurry.
        '&[data-planning="true"] .duty-line': { animationDuration: '2.1s' },
        '@media (prefers-reduced-motion: reduce)': {
          '& .duty-line': { animation: 'none', strokeDashoffset: 0 },
        },
      }}
    >
      <ColumnHeader>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2, width: '100%' }}>
          <Typography variant="stamp" sx={{ color: colors.panelAmber }}>
            {isPlanning ? 'Plotting route' : 'Record of duty status'}
          </Typography>
          <Typography variant="stamp" sx={{ color: colors.panelInkMuted }}>
            24 h
          </Typography>
        </Box>
      </ColumnHeader>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
        <Box sx={{ border: '1px solid', borderColor: colors.panelRule, p: 1.5 }}>
          <Box
            component="svg"
            viewBox="0 0 320 132"
            aria-hidden="true"
            sx={{ width: '100%', height: 'auto', display: 'block' }}
          >
            <defs>
              <linearGradient id="duty-rules-gradient" x1={GRID_LEFT} x2={GRID_RIGHT} y1="0" y2="0" gradientUnits="userSpaceOnUse">
                {GRADIENT_STOPS.map((stop, index) => (
                  <stop key={index} offset={stop.offset} stopColor={stop.color} />
                ))}
              </linearGradient>
            </defs>

            {ROWS.map((row) => (
              <text
                key={row.key}
                x={GRID_LEFT - 8}
                y={row.y + 3}
                textAnchor="end"
                fill={colors.panelInkMuted}
                style={{ font: '600 8px "IBM Plex Sans Condensed", sans-serif', letterSpacing: '0.1em' }}
              >
                {row.label.toUpperCase()}
              </text>
            ))}

            <g stroke="rgba(255,255,255,0.11)" strokeWidth="1">
              {ROWS.map((row) => (
                <line key={row.key} x1={GRID_LEFT} x2={GRID_RIGHT} y1={row.y} y2={row.y} />
              ))}
              {Array.from({ length: 25 }, (_, hour) => (
                <line
                  key={hour}
                  x1={hourX(hour)}
                  x2={hourX(hour)}
                  y1={ROWS[0].y - 9}
                  y2={ROWS[3].y + 9}
                  strokeOpacity={hour % 6 === 0 ? 0.85 : 0.35}
                />
              ))}
            </g>

            <path
              className="duty-line"
              d={DUTY_PATH}
              pathLength="1"
              fill="none"
              stroke="url(#duty-rules-gradient)"
              strokeWidth="2.6"
              strokeDasharray="1"
              strokeLinejoin="round"
            />
          </Box>

          <Typography
            variant="stamp"
            sx={{
              display: 'block',
              mt: 1,
              pt: 1,
              borderTop: '1px dashed',
              borderColor: colors.panelRule,
              color: colors.panelInkMuted,
            }}
          >
            Sample sheet · day 2 of 3
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 2, rowGap: 0.75 }}>
          {ROWS.map((row) => (
            <Box key={row.key} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Box sx={{ width: 12, height: 3, bgcolor: STATUS_COLORS[row.key], flexShrink: 0 }} />
              <Typography variant="caption" sx={{ color: colors.panelInkMuted }}>
                {STATUS_LABELS[row.key]}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="body2" sx={{ color: colors.panelInkMuted }}>
          Every trip splits into federal duty-status days: driving, breaks, rest and on-duty
          time, drawn the way an inspector reads them.
        </Typography>

        <Box>
          {RULES.map(([label, value]) => (
            <Box
              key={label}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                gap: 2,
                py: 0.9,
                borderBottom: '1px solid',
                borderColor: colors.panelRule,
              }}
            >
              <Typography variant="body2" sx={{ color: colors.panelInk }}>
                {label}
              </Typography>
              <Typography variant="mono" sx={{ color: colors.panelAmber, whiteSpace: 'nowrap' }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
