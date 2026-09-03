import { Box, Stack, Typography } from '@mui/material'
import L from 'leaflet'
import PropTypes from 'prop-types'
import { CircleMarker, MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'
import {
  DUTY_STATUS,
  MAP_MARKERS,
  ROW_ORDER,
  STATUS_COLORS,
  STATUS_LABELS,
  STOP_COLORS,
  STOP_LABELS,
} from '../../lib/constants'
import { colors, layout, radius } from '../../lib/designTokens'
import { formatDurationWords, formatHHMM } from '../../lib/time'

const US_CENTER = [39.5, -98.35]

const pinFor = (type) =>
  L.divIcon({
    className: '',
    iconSize: [26, 34],
    iconAnchor: [13, 33],
    popupAnchor: [0, -30],
    html: `<svg width="26" height="34" viewBox="0 0 26 34" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 33S25 20.6 25 13A12 12 0 1 0 1 13c0 7.6 12 20 12 20z"
              fill="${STOP_COLORS[type] ?? colors.slate}" stroke="${colors.surface}" stroke-width="2"/>
        <circle cx="13" cy="13" r="4.5" fill="${colors.surface}"/>
      </svg>`,
  })

function stopDuty(stop, segments) {
  const atStop = segments.filter((segment) => segment.location === stop.label)
  const segment = atStop.find((candidate) => candidate.note) ?? atStop[0]
  if (!segment) return null

  const hours = (new Date(segment.end) - new Date(segment.start)) / 3_600_000
  return {
    status: segment.status,
    text: `${formatDurationWords(hours)} ${STATUS_LABELS[segment.status].toLowerCase()}`,
    note: segment.note,
  }
}

export default function RouteMap({ routeGeometry, stops, segments, timezone, highlightedStep }) {
  const route = (routeGeometry?.coordinates ?? []).map(([lng, lat]) => [lat, lng])
  const stopPositions = stops.map((stop) => [stop.lat, stop.lng])
  const hosEvents = segments.filter(
    (segment) =>
      segment.status !== DUTY_STATUS.DRIVING &&
      Number.isFinite(segment.lat) &&
      Number.isFinite(segment.lng),
  )
  const framed = [...route, ...stopPositions, ...hosEvents.map((segment) => [segment.lat, segment.lng])]

  const viewProps = framed.length
    ? { bounds: framed, boundsOptions: { padding: [40, 40] } }
    : { center: US_CENTER, zoom: 4 }

  return (
    <Stack spacing={1.5}>
      <Box
        sx={{
          height: layout.mapHeight,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: `${radius}px`,
          overflow: 'hidden',
        }}
      >
        <MapContainer {...viewProps} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Polyline
            positions={route}
            pathOptions={{ color: STATUS_COLORS[DUTY_STATUS.DRIVING], weight: 4, opacity: 0.95 }}
          />
          {hosEvents.map((segment, index) => (
            <CircleMarker
              key={`${segment.start}-${segment.status}-${index}`}
              center={[segment.lat, segment.lng]}
              radius={MAP_MARKERS.hosRadius}
              pathOptions={{
                color: colors.surface,
                weight: 2,
                fillColor: STATUS_COLORS[segment.status],
                fillOpacity: 1,
              }}
            >
              <Popup minWidth={196} maxWidth={280}>
                <Typography variant="overline" sx={{ color: STATUS_COLORS[segment.status] }}>
                  {STATUS_LABELS[segment.status]}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {segment.note ?? STATUS_LABELS[segment.status]}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                  {segment.location}
                </Typography>
                <Typography variant="mono" sx={{ display: 'block', mt: 0.75, color: 'text.primary' }}>
                  {`${formatHHMM(segment.start, timezone)}–${formatHHMM(segment.end, timezone)}`}
                </Typography>
              </Popup>
            </CircleMarker>
          ))}
          {highlightedStep && Number.isFinite(highlightedStep.lat) && Number.isFinite(highlightedStep.lng) && (
            <CircleMarker
              center={[highlightedStep.lat, highlightedStep.lng]}
              radius={MAP_MARKERS.highlightedStepRadius}
              interactive={false}
              pathOptions={{
                color: colors.surface,
                weight: 3,
                fillColor: colors.teal,
                fillOpacity: 1,
              }}
            />
          )}
          {stops.map((stop) => {
            const duty = stopDuty(stop, segments)
            return (
              <Marker
                key={`${stop.type}-${stop.lat}-${stop.lng}`}
                position={[stop.lat, stop.lng]}
                icon={pinFor(stop.type)}
                zIndexOffset={MAP_MARKERS.primaryZIndexOffset}
              >
                <Popup minWidth={196} maxWidth={280}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: STOP_COLORS[stop.type] ?? 'text.secondary',
                      }}
                    />
                    <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                      {STOP_LABELS[stop.type] ?? stop.type}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {stop.label}
                  </Typography>
                  {duty && (
                    <Typography
                      variant="caption"
                      sx={{ display: 'block', mt: 0.5, color: STATUS_COLORS[duty.status] }}
                    >
                      {duty.note ? `${duty.note} · ${duty.text}` : duty.text}
                    </Typography>
                  )}
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.5, sm: 2.5 }, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Box sx={{ width: 9, height: 13, borderRadius: '7px 7px 7px 1px', bgcolor: STATUS_COLORS[DUTY_STATUS.DRIVING], transform: 'rotate(-45deg)' }} />
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>Route stops</Typography>
        </Box>
        {ROW_ORDER.filter((status) => status !== DUTY_STATUS.DRIVING).map((status) => (
          <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: STATUS_COLORS[status] }} />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {STATUS_LABELS[status]}
            </Typography>
          </Box>
        ))}
      </Box>
    </Stack>
  )
}

RouteMap.propTypes = {
  routeGeometry: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
  }),
  stops: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }),
  ).isRequired,
  segments: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired,
      location: PropTypes.string,
      note: PropTypes.string,
      lat: PropTypes.number,
      lng: PropTypes.number,
    }),
  ).isRequired,
  timezone: PropTypes.string.isRequired,
  highlightedStep: PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }),
}
