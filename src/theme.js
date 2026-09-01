import { createTheme } from '@mui/material/styles'
import { colors, fonts, radius } from './lib/designTokens'

const monoFigures = {
  fontFamily: fonts.mono,
  fontSize: 13,
  fontWeight: 500,
  letterSpacing: '-0.01em',
  fontVariantNumeric: 'tabular-nums',
}

export const theme = createTheme({
  palette: {
    background: { default: colors.canvas, paper: colors.surface },
    text: { primary: colors.ink, secondary: colors.inkMuted },
    divider: colors.line,
    primary: {
      main: colors.teal,
      dark: colors.tealDark,
      light: colors.tealSoft,
      contrastText: colors.surface,
    },
    error: { main: colors.clay, light: colors.claySoft, dark: colors.clayDark },
  },

  shape: { borderRadius: radius },

  typography: {
    fontFamily: fonts.sans,
    h1: { fontSize: 30, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.2 },
    h2: { fontSize: 19, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.3 },
    h3: { fontSize: 17, fontWeight: 600, letterSpacing: '-0.01em' },
    body1: { fontSize: 15, lineHeight: 1.55 },
    body2: { fontSize: 14, lineHeight: 1.5 },
    caption: { fontSize: 12.5, lineHeight: 1.4 },
    overline: { fontSize: 11, fontWeight: 600, letterSpacing: '0.09em', lineHeight: 1.6 },
    button: { fontSize: 15, fontWeight: 600, textTransform: 'none', letterSpacing: 0 },
    mono: monoFigures,
    monoLarge: { ...monoFigures, fontSize: 19, fontWeight: 600 },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        '.print-only': { display: 'none' },

        '@page': { size: 'landscape', margin: '6mm' },
        '@media print': {
          body: {
            background: colors.surface,
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
          },
          '.no-print, .screen-only': { display: 'none !important' },
          '.print-only': { display: 'block !important' },
          '.MuiContainer-root': {
            width: '100% !important',
            maxWidth: 'none !important',
            padding: '0 !important',
          },
          '.print-log-sheet': {
            breakAfter: 'page',
            pageBreakAfter: 'always',
          },
          '.print-log-sheet:last-child': {
            breakAfter: 'auto',
            pageBreakAfter: 'auto',
          },
          '.log-sheet-card': {
            border: 'none !important',
            borderRadius: '0 !important',
          },
          '.log-sheet-card .MuiCardContent-root': { padding: '0 !important' },
        },

        // Leaflet ships its own chrome; restyling it here keeps the map inside
        // the same design system as everything drawn with MUI.
        '.leaflet-container': { fontFamily: fonts.sans, background: colors.canvas },
        '.leaflet-popup-content-wrapper': {
          borderRadius: radius,
          border: `1px solid ${colors.line}`,
          boxShadow: '0 8px 28px rgba(20, 28, 30, 0.14)',
          padding: 0,
        },
        '.leaflet-popup-content': { margin: 0, padding: '14px 16px' },
        '.leaflet-popup-tip': { border: `1px solid ${colors.line}`, boxShadow: 'none' },
        '.leaflet-popup-close-button': {
          color: `${colors.inkMuted} !important`,
          top: '8px !important',
          right: '8px !important',
        },
        '.leaflet-control-zoom': { border: 'none !important', boxShadow: 'none !important' },
        '.leaflet-control-zoom a': {
          color: colors.ink,
          background: colors.surface,
          border: `1px solid ${colors.line}`,
          '&:hover': { background: colors.tealSoft, color: colors.teal },
        },
        '.leaflet-control-attribution': {
          fontFamily: fonts.sans,
          fontSize: 10,
          color: colors.inkMuted,
          background: 'rgba(255, 255, 255, 0.86)',
        },
      },
    },

    MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { backgroundImage: 'none' } } },

    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: { borderColor: colors.line, borderRadius: radius },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: { padding: 24, '&:last-child': { paddingBottom: 24 } },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: radius - 2, paddingInline: 20 },
        sizeLarge: { paddingBlock: 12, fontSize: 15 },
        containedPrimary: { '&:hover': { backgroundColor: colors.tealDark } },
        outlined: { borderColor: colors.line, '&:hover': { borderColor: colors.teal, background: colors.tealSoft } },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius - 2,
          background: colors.surface,
          '& fieldset': { borderColor: colors.line },
          '&:hover fieldset': { borderColor: colors.lineStrong },
          '&.Mui-focused .MuiSvgIcon-root': { color: colors.teal },
        },
        input: { fontSize: 15 },
      },
    },

    MuiInputAdornment: { styleOverrides: { root: { color: colors.inkMuted } } },

    MuiFormHelperText: { styleOverrides: { root: { fontSize: 12.5, marginLeft: 2 } } },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: radius, border: '1px solid', alignItems: 'flex-start' },
        standardError: {
          color: colors.ink,
          backgroundColor: colors.claySoft,
          borderColor: 'rgba(163, 74, 60, 0.28)',
          '& .MuiAlert-icon': { color: colors.clay },
        },
      },
    },
    MuiAlertTitle: { styleOverrides: { root: { fontWeight: 600, fontSize: 15 } } },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: colors.ink,
          borderRadius: radius - 4,
          padding: '8px 10px',
          fontSize: 12.5,
        },
        arrow: { color: colors.ink },
      },
    },

    MuiSkeleton: {
      defaultProps: { animation: 'wave' },
      styleOverrides: { root: { backgroundColor: 'rgba(20, 28, 30, 0.06)' } },
    },

    MuiTypography: {
      defaultProps: { variantMapping: { mono: 'span', monoLarge: 'span' } },
    },

    MuiDivider: { styleOverrides: { root: { borderColor: colors.line } } },
  },
})
