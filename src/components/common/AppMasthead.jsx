import { Box, Container } from '@mui/material'
import PropTypes from 'prop-types'
import { layout } from '../../lib/designTokens'
import BrandMark from './BrandMark'

export default function AppMasthead({ stamp, actions }) {
  return (
    <Box
      component="header"
      className="no-print"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        bgcolor: 'background.default',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: layout.mastheadHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            py: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
            <BrandMark />
            {stamp && (
              <>
                <Box sx={{ width: '1px', height: 16, bgcolor: 'divider', flexShrink: 0 }} />
                <Box
                  component="span"
                  sx={{
                    typography: 'stamp',
                    color: 'text.secondary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {stamp}
                </Box>
              </>
            )}
          </Box>
          {actions && <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>{actions}</Box>}
        </Box>
      </Container>
      <Box className="tick-rule" aria-hidden="true" />
    </Box>
  )
}

AppMasthead.propTypes = {
  stamp: PropTypes.string,
  actions: PropTypes.node,
}
