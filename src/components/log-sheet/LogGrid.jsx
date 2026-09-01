import { Box, Tooltip, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import PropTypes from 'prop-types'
import {
  GRID,
  HOURS_PER_SHEET,
  QUARTERS_PER_HOUR,
  ROW_ORDER,
  STATUS_COLORS,
  STATUS_LABELS,
} from '../../lib/constants'
import { formatHHMM, formatRowTotals } from '../../lib/time'

const HOUR_BOUNDARIES = Array.from({ length: HOURS_PER_SHEET + 1 }, (_, hour) => hour)
const QUARTER_TICKS = Array.from(
  { length: HOURS_PER_SHEET * QUARTERS_PER_HOUR },
  (_, index) => index,
).filter((index) => index % QUARTERS_PER_HOUR !== 0)

const hourLabel = (hour) => String(hour % 12 === 0 ? 12 : hour % 12)
const isAnchorHour = (hour) => hour % 12 === 0

const xFor = (hour) => GRID.labelWidth + (hour / HOURS_PER_SHEET) * GRID.plotWidth
const rowTopFor = (index) => GRID.headerHeight + index * GRID.rowHeight
const rowCenterFor = (status) => rowTopFor(ROW_ORDER.indexOf(status)) + GRID.rowHeight / 2

const gridBottom = GRID.headerHeight + GRID.plotHeight

export default function LogGrid({ daySegments, totals, timezone }) {
  const theme = useTheme()
  const rowTotals = formatRowTotals(totals)
  const sansFamily = theme.typography.fontFamily
  const monoFamily = theme.typography.mono.fontFamily

  return (
    <Box sx={{ overflowX: 'auto', mx: -0.5, px: 0.5 }}>
      <svg
        viewBox={`0 0 ${GRID.width} ${GRID.height}`}
        role="img"
        aria-label="Driver's daily log grid"
        style={{ width: '100%', minWidth: 660, height: 'auto', display: 'block' }}
      >
        {HOUR_BOUNDARIES.map((hour) => (
          <text
            key={hour}
            x={xFor(hour)}
            y={GRID.headerHeight - 10}
            textAnchor="middle"
            fontFamily={monoFamily}
            fontSize={10.5}
            fontWeight={isAnchorHour(hour) ? 600 : 400}
            fill={isAnchorHour(hour) ? theme.palette.text.primary : theme.palette.text.secondary}
          >
            {hourLabel(hour)}
          </text>
        ))}
        <text
          x={GRID.width - 8}
          y={GRID.headerHeight - 10}
          textAnchor="end"
          fontFamily={sansFamily}
          fontSize={9}
          fontWeight={600}
          letterSpacing="0.09em"
          fill={theme.palette.text.secondary}
        >
          TOTAL
        </text>

        {ROW_ORDER.map((status, index) => (
          <g key={status}>
            <rect
              x={GRID.labelWidth - GRID.rowSwatch - 6}
              y={rowTopFor(index) + 7}
              width={GRID.rowSwatch}
              height={GRID.rowHeight - 14}
              rx={GRID.rowSwatch / 2}
              fill={STATUS_COLORS[status]}
            />
            <text
              x={GRID.labelWidth - GRID.rowSwatch - 14}
              y={rowTopFor(index) + GRID.rowHeight / 2}
              textAnchor="end"
              dominantBaseline="middle"
              fontFamily={sansFamily}
              fontSize={11}
              fontWeight={500}
              fill={theme.palette.text.primary}
            >
              {`${index + 1}. ${STATUS_LABELS[status]}`}
            </text>
          </g>
        ))}

        <g stroke={theme.palette.divider} strokeWidth={0.75}>
          {QUARTER_TICKS.map((index) =>
            ROW_ORDER.map((status, row) => {
              const x = xFor(index / QUARTERS_PER_HOUR)
              const bottom = rowTopFor(row) + GRID.rowHeight
              const length = index % 2 === 0 ? GRID.halfTick : GRID.quarterTick
              return <line key={`${status}-${index}`} x1={x} x2={x} y1={bottom} y2={bottom - length} />
            }),
          )}
        </g>

        <g fill="none" stroke={theme.palette.divider} strokeWidth={1}>
          {HOUR_BOUNDARIES.slice(1, -1).map((hour) => (
            <line
              key={hour}
              x1={xFor(hour)}
              x2={xFor(hour)}
              y1={GRID.headerHeight}
              y2={gridBottom}
              strokeWidth={isAnchorHour(hour) ? 1.25 : 1}
              stroke={isAnchorHour(hour) ? theme.palette.text.secondary : theme.palette.divider}
            />
          ))}
          {ROW_ORDER.slice(1).map((status, index) => (
            <line
              key={status}
              x1={GRID.labelWidth}
              x2={GRID.labelWidth + GRID.plotWidth}
              y1={rowTopFor(index + 1)}
              y2={rowTopFor(index + 1)}
            />
          ))}
        </g>

        <rect
          x={GRID.labelWidth}
          y={GRID.headerHeight}
          width={GRID.plotWidth}
          height={GRID.plotHeight}
          fill="none"
          stroke={theme.palette.text.secondary}
          strokeWidth={1.25}
        />

        <g
          fill="none"
          stroke={theme.palette.text.secondary}
          strokeWidth={GRID.connectorStroke}
          strokeLinecap="round"
        >
          {daySegments.slice(1).map((segment, index) => (
            <line
              key={segment.start}
              x1={xFor(segment.startHour)}
              x2={xFor(segment.startHour)}
              y1={rowCenterFor(daySegments[index].status)}
              y2={rowCenterFor(segment.status)}
            />
          ))}
        </g>

        <g fill="none" strokeWidth={GRID.statusStroke} strokeLinecap="butt">
          {daySegments.map((segment) => (
            <line
              key={segment.start}
              x1={xFor(segment.startHour)}
              x2={xFor(segment.endHour)}
              y1={rowCenterFor(segment.status)}
              y2={rowCenterFor(segment.status)}
              stroke={STATUS_COLORS[segment.status]}
            />
          ))}
        </g>

        {daySegments.map((segment) => (
          <Tooltip
            key={segment.start}
            arrow
            placement="top"
            title={
              <Box>
                <Typography variant="mono" sx={{ display: 'block', color: 'inherit' }}>
                  {`${formatHHMM(segment.start, timezone)} – ${formatHHMM(segment.end, timezone)}`}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', fontWeight: 600 }}>
                  {STATUS_LABELS[segment.status]}
                </Typography>
                {segment.location && (
                  <Typography variant="caption" sx={{ display: 'block', opacity: 0.75 }}>
                    {[segment.location, segment.note].filter(Boolean).join(' · ')}
                  </Typography>
                )}
              </Box>
            }
          >
            <Box
              component="rect"
              x={xFor(segment.startHour)}
              y={rowTopFor(ROW_ORDER.indexOf(segment.status))}
              width={xFor(segment.endHour) - xFor(segment.startHour)}
              height={GRID.rowHeight}
              sx={{
                fill: 'transparent',
                pointerEvents: 'all',
                cursor: 'pointer',
                transition: 'fill 120ms ease',
                '&:hover': { fill: alpha(STATUS_COLORS[segment.status], 0.14) },
              }}
            />
          </Tooltip>
        ))}

        {ROW_ORDER.map((status, index) => (
          <text
            key={status}
            x={GRID.width - 8}
            y={rowTopFor(index) + GRID.rowHeight / 2}
            textAnchor="end"
            dominantBaseline="middle"
            fontFamily={monoFamily}
            fontSize={12.5}
            fontWeight={600}
            fill={totals[status] > 0 ? STATUS_COLORS[status] : theme.palette.text.secondary}
          >
            {rowTotals.rows[status]}
          </text>
        ))}

        <text
          x={GRID.labelWidth - 14}
          y={gridBottom + 15}
          textAnchor="end"
          fontFamily={sansFamily}
          fontSize={10.5}
          fill={theme.palette.text.secondary}
        >
          Total hours
        </text>
        <text
          x={GRID.width - 8}
          y={gridBottom + 15}
          textAnchor="end"
          fontFamily={monoFamily}
          fontSize={12.5}
          fontWeight={600}
          fill={theme.palette.text.primary}
        >
          {rowTotals.total}
        </text>
      </svg>
    </Box>
  )
}

LogGrid.propTypes = {
  daySegments: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.oneOf(ROW_ORDER).isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      startHour: PropTypes.number.isRequired,
      endHour: PropTypes.number.isRequired,
      location: PropTypes.string,
      note: PropTypes.string,
    }),
  ).isRequired,
  totals: PropTypes.objectOf(PropTypes.number).isRequired,
  timezone: PropTypes.string.isRequired,
}
