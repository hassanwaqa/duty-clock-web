import { Box, Typography } from '@mui/material'
import PropTypes from 'prop-types'

// A form's section divider rather than a floating heading: the label sits on
// the rule, the way headings are printed across a paper log.
export default function SectionRule({ children, action, id }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Typography variant="h2" component="h2" id={id} sx={{ whiteSpace: 'nowrap' }}>
        {children}
      </Typography>
      <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider', minWidth: 16 }} />
      {action}
    </Box>
  )
}

SectionRule.propTypes = {
  children: PropTypes.node.isRequired,
  action: PropTypes.node,
  id: PropTypes.string,
}
