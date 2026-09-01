import { Box, Card, CardContent, Skeleton, Stack } from '@mui/material'
import { layout, radius } from '../../lib/designTokens'

// Mirrors the result page's own layout so the wait previews the structure the
// trip is about to fill in, rather than replacing it with a spinner.
export default function LoadingState() {
  return (
    <Stack spacing={4} aria-busy="true" aria-label="Loading trip plan">
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', gap: 4 }}>
              {[0, 1, 2].map((index) => (
                <Box key={index}>
                  <Skeleton width={64} height={14} />
                  <Skeleton width={132} height={24} />
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', gap: 4 }}>
              {[0, 1, 2].map((index) => (
                <Box key={index}>
                  <Skeleton width={56} height={14} />
                  <Skeleton width={88} height={28} />
                </Box>
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Box>
        <Skeleton width={72} height={22} sx={{ mb: 1.5 }} />
        <Skeleton
          variant="rectangular"
          height={layout.mapHeight}
          sx={{ borderRadius: `${radius}px` }}
        />
      </Box>

      <Box>
        <Skeleton width={132} height={22} sx={{ mb: 1.5 }} />
        <Card>
          <CardContent>
            <Skeleton width={220} height={26} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={196} sx={{ borderRadius: `${radius}px` }} />
          </CardContent>
        </Card>
      </Box>
    </Stack>
  )
}
