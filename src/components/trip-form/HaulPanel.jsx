import { Box, Typography } from '@mui/material'
import { useIsMutating } from '@tanstack/react-query'
import { colors } from '../../lib/designTokens'
import { PLAN_TRIP_MUTATION_KEY } from '../../hooks/usePlanTrip'

const ROWS = [
  { label: 'Off', y: 26 },
  { label: 'SB', y: 52 },
  { label: 'Drv', y: 78 },
  { label: 'On', y: 104 },
]

const DELIVERABLES = [
  ['01', 'Route map', 'Geocoded stops and the drawn haul'],
  ['02', 'Trip schedule', 'Every break, rest and fuel stop in order'],
  ['03', 'Daily logs', 'One federal grid per calendar day'],
]

const GRID_LEFT = 34
const GRID_RIGHT = 306
const hourX = (hour) => GRID_LEFT + (hour / 24) * (GRID_RIGHT - GRID_LEFT)

const DUTY_PATH = [
  `M${hourX(0)},${ROWS[0].y}`,
  `H${hourX(6)}`,
  `V${ROWS[3].y}`,
  `H${hourX(7)}`,
  `V${ROWS[2].y}`,
  `H${hourX(13)}`,
  `V${ROWS[0].y}`,
  `H${hourX(13.5)}`,
  `V${ROWS[2].y}`,
  `H${hourX(19)}`,
  `V${ROWS[3].y}`,
  `H${hourX(20)}`,
  `V${ROWS[0].y}`,
  `H${hourX(24)}`,
].join('')

export default function HaulPanel() {
  const isPlanning = useIsMutating({ mutationKey: PLAN_TRIP_MUTATION_KEY }) > 0

  return (
    <Box
      data-planning={isPlanning ? 'true' : 'false'}
      aria-hidden="true"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,

        '@keyframes haulDrive': {
          from: { transform: 'translateX(-46px)' },
          to: { transform: 'translateX(320px)' },
        },
        '@keyframes laneScroll': {
          from: { strokeDashoffset: 0 },
          to: { strokeDashoffset: -24 },
        },
        '@keyframes drawDuty': {
          '0%': { strokeDashoffset: 1, opacity: 1 },
          '68%': { strokeDashoffset: 0, opacity: 1 },
          '90%': { strokeDashoffset: 0, opacity: 1 },
          '100%': { strokeDashoffset: 0, opacity: 0 },
        },
        '& .haul-truck': { animation: 'haulDrive 9s linear infinite' },
        '& .haul-lane': { animation: 'laneScroll 0.6s linear infinite' },
        '& .haul-duty': { animation: 'drawDuty 9s ease-in-out infinite' },

        // Planning is the same journey, hurried: the panel becomes the spinner.
        '&[data-planning="true"] .haul-truck': { animationDuration: '2.1s' },
        '&[data-planning="true"] .haul-lane': { animationDuration: '0.22s' },
        '&[data-planning="true"] .haul-duty': { animationDuration: '2.1s' },

        '@media (prefers-reduced-motion: reduce)': {
          '& .haul-truck, & .haul-lane, & .haul-duty': { animation: 'none' },
          '& .haul-duty': { strokeDashoffset: 0 },
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2 }}>
        <Typography variant="stamp" sx={{ color: colors.ochre }}>
          {isPlanning ? 'Plotting route' : 'Record of duty status'}
        </Typography>
        <Typography variant="stamp" sx={{ color: 'rgba(255,255,255,0.38)' }}>
          24 h
        </Typography>
      </Box>

      <Box component="svg" viewBox="0 0 320 190" sx={{ width: '100%', height: 'auto', display: 'block' }}>
        {ROWS.map((row) => (
          <text
            key={row.label}
            x={GRID_LEFT - 8}
            y={row.y + 3}
            textAnchor="end"
            fill="rgba(255,255,255,0.42)"
            style={{ font: '600 8px "IBM Plex Sans Condensed", sans-serif', letterSpacing: '0.1em' }}
          >
            {row.label.toUpperCase()}
          </text>
        ))}

        <g stroke="rgba(255,255,255,0.10)" strokeWidth="1">
          {ROWS.map((row) => (
            <line key={row.label} x1={GRID_LEFT} x2={GRID_RIGHT} y1={row.y} y2={row.y} />
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
          className="haul-duty"
          d={DUTY_PATH}
          pathLength="1"
          fill="none"
          stroke={colors.ochre}
          strokeWidth="2.6"
          strokeDasharray="1"
          strokeLinejoin="miter"
        />

        <line
          className="haul-lane"
          x1="0"
          x2="320"
          y1="162"
          y2="162"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth="1.5"
          strokeDasharray="14 10"
        />

        <g className="haul-truck">
          <rect x="0" y="140" width="26" height="15" fill="rgba(255,255,255,0.92)" />
          <rect x="27" y="145" width="10" height="10" fill={colors.ochre} />
          <rect x="29" y="147" width="4" height="4" fill={colors.ink} />
          <circle cx="7" cy="157" r="2.6" fill="rgba(255,255,255,0.92)" />
          <circle cx="20" cy="157" r="2.6" fill="rgba(255,255,255,0.92)" />
          <circle cx="33" cy="157" r="2.6" fill="rgba(255,255,255,0.92)" />
        </g>
      </Box>

      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)' }}>
        {isPlanning
          ? 'Geocoding stops, routing the haul and cutting the day into log sheets.'
          : 'Every trip is split into federal duty-status days — driving, breaks, rest and on-duty time, drawn exactly as an inspector reads them.'}
      </Typography>

      <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.14)', pt: 2, display: 'grid', gap: 1.5 }}>
        {DELIVERABLES.map(([index, title, detail]) => (
          <Box key={index} sx={{ display: 'grid', gridTemplateColumns: '24px minmax(0, 1fr)', gap: 1.5 }}>
            <Typography variant="stamp" sx={{ color: colors.ochre }}>
              {index}
            </Typography>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="stamp" sx={{ color: 'rgba(255,255,255,0.92)', display: 'block' }}>
                {title}
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.45)' }}>
                {detail}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
