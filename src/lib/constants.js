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

export const STATUS_COLORS = {
  [DUTY_STATUS.OFF_DUTY]: colors.slate,
  [DUTY_STATUS.SLEEPER_BERTH]: colors.plum,
  [DUTY_STATUS.DRIVING]: colors.navy,
  [DUTY_STATUS.ON_DUTY]: colors.ochre,
}

export const STOP_LABELS = {
  current: 'Current location',
  pickup: 'Pickup',
  dropoff: 'Dropoff',
}

export const STOP_COLORS = {
  current: colors.slate,
  pickup: colors.ochre,
  dropoff: colors.navy,
}

export const MAP_MARKERS = {
  hosRadius: 6,
  highlightedStepRadius: 8,
  primaryZIndexOffset: 1000,
}

export const CYCLE_RESTART_NOTE = '34-hour restart'
export const DAILY_RESET_NOTE = '10-hour reset'
export const BREAK_NOTE = '30-minute break'
export const FUEL_NOTE = 'Fuel stop'
export const PICKUP_NOTE = 'Pickup'

export const LEG_TITLES = {
  'current>pickup': 'Deadhead to pickup',
  'pickup>dropoff': 'Loaded to dropoff',
}

export const HOS_HINTS = {
  cycle:
    'The 70-hour / 8-day cycle: a driver may not be on duty more than 70 hours across any 8 consecutive days. Driving and on-duty time both count; off-duty and sleeper time do not.',
  restart:
    'A 34-hour restart is 34 consecutive off-duty hours. Completing one resets the 70-hour cycle back to zero.',
  dailyReset:
    'A 10-hour reset is the off-duty period required before a new driving window: 11 hours of driving within a 14-hour on-duty window.',
  break:
    'A 30-minute break is required after 8 cumulative hours of driving.',
  drivingTime: 'Time actually behind the wheel, excluding rests, breaks, fuel, pickup and dropoff.',
  totalTripTime: 'Wall-clock time from the first scheduled event to the last, including every rest.',
}

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
