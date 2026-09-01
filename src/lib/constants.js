import { colors } from './designTokens'

export const DUTY_STATUS = {
  OFF_DUTY: 'OFF_DUTY',
  SLEEPER_BERTH: 'SLEEPER_BERTH',
  DRIVING: 'DRIVING',
  ON_DUTY: 'ON_DUTY',
}

export const ROW_ORDER = [
  DUTY_STATUS.OFF_DUTY,
  DUTY_STATUS.SLEEPER_BERTH,
  DUTY_STATUS.DRIVING,
  DUTY_STATUS.ON_DUTY,
]

export const STATUS_LABELS = {
  [DUTY_STATUS.OFF_DUTY]: 'Off Duty',
  [DUTY_STATUS.SLEEPER_BERTH]: 'Sleeper Berth',
  [DUTY_STATUS.DRIVING]: 'Driving',
  [DUTY_STATUS.ON_DUTY]: 'On Duty',
}

export const STATUS_SHORT_LABELS = {
  [DUTY_STATUS.OFF_DUTY]: 'Off',
  [DUTY_STATUS.SLEEPER_BERTH]: 'Sleeper',
  [DUTY_STATUS.DRIVING]: 'Drive',
  [DUTY_STATUS.ON_DUTY]: 'On',
}

// The single source of status colour for the grid, the remarks strip and the
// map — a status must look the same everywhere it appears.
export const STATUS_COLORS = {
  [DUTY_STATUS.OFF_DUTY]: colors.slate,
  [DUTY_STATUS.SLEEPER_BERTH]: colors.indigo,
  [DUTY_STATUS.DRIVING]: colors.teal,
  [DUTY_STATUS.ON_DUTY]: colors.amber,
}

export const STOP_LABELS = {
  current: 'Current location',
  pickup: 'Pickup',
  dropoff: 'Dropoff',
}

export const STOP_COLORS = {
  current: colors.slate,
  pickup: colors.amber,
  dropoff: colors.teal,
}

export const MAP_MARKERS = {
  hosRadius: 6,
  highlightedStepRadius: 8,
  primaryZIndexOffset: 1000,
}

export const CYCLE_RESTART_NOTE = '34-hour restart'

export const OPTIONAL_LOG_FIELDS = [
  { key: 'driver_name', label: 'Driver name' },
  { key: 'carrier_name', label: 'Carrier' },
  { key: 'home_terminal', label: 'Home terminal' },
  { key: 'truck_number', label: 'Truck number' },
  { key: 'trailer_number', label: 'Trailer number' },
  { key: 'shipping_document', label: 'Shipping document' },
]

export const BLANK_LOG_FIELDS = [
  { key: 'co_driver', label: 'Co-driver' },
  { key: 'signature', label: 'Driver signature' },
]

export const HOURS_PER_SHEET = 24
export const QUARTERS_PER_HOUR = 4

const HOUR_WIDTH = 34
const ROW_HEIGHT = 38
const LABEL_WIDTH = 126
const TOTALS_WIDTH = 66
const HEADER_HEIGHT = 30
const FOOTER_HEIGHT = 24

export const GRID = {
  hourWidth: HOUR_WIDTH,
  rowHeight: ROW_HEIGHT,
  labelWidth: LABEL_WIDTH,
  totalsWidth: TOTALS_WIDTH,
  headerHeight: HEADER_HEIGHT,
  footerHeight: FOOTER_HEIGHT,
  quarterTick: 5,
  halfTick: 9,
  rowSwatch: 3,
  statusStroke: 3,
  connectorStroke: 2.5,
  plotWidth: HOURS_PER_SHEET * HOUR_WIDTH,
  plotHeight: ROW_ORDER.length * ROW_HEIGHT,
  width: LABEL_WIDTH + HOURS_PER_SHEET * HOUR_WIDTH + TOTALS_WIDTH,
  height: HEADER_HEIGHT + ROW_ORDER.length * ROW_HEIGHT + FOOTER_HEIGHT,
}
