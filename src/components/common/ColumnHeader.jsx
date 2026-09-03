import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import { layout } from '../../lib/designTokens'

export default function ColumnHeader({ children }) {
  return (
    <Box sx={{ height: layout.mastheadHeight, display: 'flex', alignItems: 'center', mb: 3.25 }}>
      {children}
    </Box>
  )
}

ColumnHeader.propTypes = {
  children: PropTypes.node.isRequired,
}
