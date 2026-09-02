import FlagRoundedIcon from '@mui/icons-material/FlagRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import MyLocationRoundedIcon from '@mui/icons-material/MyLocationRounded'
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded'
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded'
import {
  Alert,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePlanTrip } from '../../hooks/usePlanTrip'
import { HOS_HINTS, OPTIONAL_LOG_FIELDS } from '../../lib/constants'
import InfoHint from '../common/InfoHint'
import LocationAutocomplete from './LocationAutocomplete'

const CYCLE_LIMIT = 70

const adornment = (Icon) => ({
  startAdornment: (
    <InputAdornment position="start">
      <Icon fontSize="small" />
    </InputAdornment>
  ),
})

export default function TripForm() {
  const navigate = useNavigate()
  const { mutate, isPending, error } = usePlanTrip()

  const [currentLocation, setCurrentLocation] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')
  const [cycleUsed, setCycleUsed] = useState('')
  const [logDetails, setLogDetails] = useState(() =>
    Object.fromEntries(OPTIONAL_LOG_FIELDS.map(({ key }) => [key, ''])),
  )
  const [fieldErrors, setFieldErrors] = useState({})
  const submissionRef = useRef(null)

  function handleSubmit(event) {
    event.preventDefault()

    const cycleUsedHours = Number(cycleUsed)
    const problems = {}
    if (!currentLocation.trim()) problems.currentLocation = 'Required'
    if (!pickupLocation.trim()) problems.pickupLocation = 'Required'
    if (!dropoffLocation.trim()) problems.dropoffLocation = 'Required'
    if (cycleUsed === '' || Number.isNaN(cycleUsedHours)) {
      problems.cycleUsed = 'Enter the hours already used'
    } else if (cycleUsedHours < 0 || cycleUsedHours > CYCLE_LIMIT) {
      problems.cycleUsed = `Must be between 0 and ${CYCLE_LIMIT}`
    }

    setFieldErrors(problems)
    if (Object.keys(problems).length) return

    const suppliedLogDetails = Object.fromEntries(
      Object.entries(logDetails)
        .map(([key, value]) => [key, value.trim()])
        .filter(([, value]) => value),
    )

    const payload = {
      current_location: currentLocation.trim(),
      pickup_location: pickupLocation.trim(),
      dropoff_location: dropoffLocation.trim(),
      current_cycle_used: cycleUsedHours,
      ...suppliedLogDetails,
    }
    const fingerprint = JSON.stringify(payload)
    if (submissionRef.current?.fingerprint !== fingerprint) {
      submissionRef.current = {
        fingerprint,
        idempotencyKey: crypto.randomUUID(),
      }
    }

    mutate(
      {
        payload,
        idempotencyKey: submissionRef.current.idempotencyKey,
      },
      { onSuccess: (trip) => navigate(`/trips/${trip.id}`) },
    )
  }

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3}>
        <Box>
          <Typography
            variant="overline"
            sx={{ color: 'text.primary', display: 'block', pb: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}
          >
            Route
          </Typography>
          <Stack spacing={2.25} sx={{ mt: 2 }}>
            <LocationAutocomplete
              label="Current location"
              placeholder="Chicago, IL"
              value={currentLocation}
              onChange={setCurrentLocation}
              error={Boolean(fieldErrors.currentLocation)}
              helperText={fieldErrors.currentLocation}
              icon={MyLocationRoundedIcon}
            />
            <LocationAutocomplete
              label="Pickup location"
              placeholder="Des Moines, IA"
              value={pickupLocation}
              onChange={setPickupLocation}
              error={Boolean(fieldErrors.pickupLocation)}
              helperText={fieldErrors.pickupLocation}
              icon={PlaceRoundedIcon}
            />
            <LocationAutocomplete
              label="Dropoff location"
              placeholder="Salt Lake City, UT"
              value={dropoffLocation}
              onChange={setDropoffLocation}
              error={Boolean(fieldErrors.dropoffLocation)}
              helperText={fieldErrors.dropoffLocation}
              icon={FlagRoundedIcon}
            />
          </Stack>
        </Box>

        <Divider />

        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              pb: 0.75,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Typography variant="overline" sx={{ color: 'text.primary' }}>
              Hours of service
            </Typography>
            <InfoHint text={HOS_HINTS.cycle} label="About the 70-hour / 8-day cycle" />
          </Box>
          <TextField
            label="Current cycle used"
            type="number"
            placeholder="22.5"
            value={cycleUsed}
            onChange={(event) => setCycleUsed(event.target.value)}
            error={Boolean(fieldErrors.cycleUsed)}
            helperText={
              fieldErrors.cycleUsed ?? `Hours already on duty in the ${CYCLE_LIMIT}-hour / 8-day cycle`
            }
            slotProps={{
              input: adornment(SpeedRoundedIcon),
              htmlInput: { min: 0, max: CYCLE_LIMIT, step: 0.25 },
            }}
            fullWidth
            sx={{ mt: 2 }}
          />
        </Box>

        <Accordion
          disableGutters
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: '8px !important',
            boxShadow: 'none',
            '&::before': { display: 'none' },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreRoundedIcon />}
            sx={{ px: 2, minHeight: 54, '& .MuiAccordionSummary-content': { my: 1.25 } }}
          >
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Log sheet details
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Optional · leave blank if not available
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 2, pt: 0, pb: 2 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
                gap: 1.5,
              }}
            >
              {OPTIONAL_LOG_FIELDS.map(({ key, label }) => (
                <TextField
                  key={key}
                  label={label}
                  value={logDetails[key]}
                  onChange={(event) =>
                    setLogDetails((current) => ({ ...current, [key]: event.target.value }))
                  }
                  fullWidth
                  size="small"
                />
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        {error && <Alert severity="error">{error.message}</Alert>}

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={isPending}
          startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : null}
        >
          {isPending ? 'Planning trip…' : 'Plan trip'}
        </Button>

        {isPending && (
          <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
            Geocoding stops and building log sheets — this can take a few seconds.
          </Typography>
        )}
      </Stack>
    </Box>
  )
}
