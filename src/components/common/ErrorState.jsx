import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded'
import { Alert, AlertTitle, Button } from '@mui/material'
import PropTypes from 'prop-types'

export default function ErrorState({ title, message, onRetry }) {
  return (
    <Alert
      severity="error"
      icon={<ReportProblemRoundedIcon fontSize="small" />}
      action={
        onRetry && (
          <Button color="inherit" size="small" variant="outlined" onClick={onRetry}>
            Try again
          </Button>
        )
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  )
}

ErrorState.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
}
