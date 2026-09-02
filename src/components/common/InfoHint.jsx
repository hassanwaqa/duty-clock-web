import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Tooltip } from '@mui/material'
import PropTypes from 'prop-types'

export default function InfoHint({ text, label }) {
  return (
    <Tooltip title={text} arrow enterTouchDelay={0} leaveTouchDelay={6000}>
      <InfoOutlinedIcon
        role="img"
        aria-label={label}
        sx={{
          fontSize: 14,
          color: 'text.secondary',
          cursor: 'help',
          verticalAlign: 'middle',
          opacity: 0.7,
          '&:hover': { opacity: 1 },
        }}
      />
    </Tooltip>
  )
}

InfoHint.propTypes = {
  text: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
}
