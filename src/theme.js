import { createTheme } from '@mui/material/styles'
import { colors, fonts, radius, tickRule } from './lib/designTokens'

const monoFigures = {
  fontFamily: fonts.mono,
  fontSize: 12.5,
  fontWeight: 450,
  letterSpacing: '0',
  fontVariantNumeric: 'tabular-nums',
}

const stampLabel = {
  fontFamily: fonts.condensed,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  lineHeight: 1.5,
}

const overlaySurface = {
  border: `1px solid ${colors.ruleStrong}`,
  borderRadius: radius,
  boxShadow: '0 10px 30px rgba(26, 25, 23, 0.16)',
}

export const theme = createTheme({
  palette: {
    background: { default: colors.paper, paper: colors.surface },
    text: { primary: colors.ink, secondary: colors.inkMuted, disabled: colors.inkFaint },
    divider: colors.rule,
    primary: {
      main: colors.ink,
      dark: '#000000',
      light: colors.inkWashStrong,
      contrastText: colors.surface,
    },
    secondary: { main: colors.navy, light: colors.navySoft, contrastText: colors.surface },
    error: { main: colors.rust, light: colors.rustSoft, dark: colors.rustDark },
    action: { hover: colors.inkWash, selected: colors.inkWashStrong },
  },

  shape: { borderRadius: radius },

  typography: {
    fontFamily: fonts.sans,
    h1: { fontFamily: fonts.condensed, fontSize: 34, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.1 },
    h2: { fontFamily: fonts.condensed, fontSize: 15, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1.4 },
    h3: { fontSize: 16, fontWeight: 600, letterSpacing: '-0.005em' },
    body1: { fontSize: 14.5, lineHeight: 1.55 },
    body2: { fontSize: 13.5, lineHeight: 1.5 },
    caption: { fontSize: 12, lineHeight: 1.45, color: colors.inkMuted },
    overline: stampLabel,
    button: { fontFamily: fonts.condensed, fontSize: 13, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' },
    mono: monoFigures,
    monoLarge: { ...monoFigures, fontSize: 18, fontWeight: 500, letterSpacing: '-0.02em' },
    stamp: stampLabel,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },

        '.tick-rule': {
          height: 5,
          backgroundImage: tickRule(),
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom',
        },
        '.print-only': { display: 'none !important' },

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

        '.leaflet-container': { fontFamily: fonts.sans, background: colors.paper },
        '.leaflet-popup-content-wrapper': {
          borderRadius: radius,
          border: `1px solid ${colors.rule}`,
          boxShadow: '0 8px 28px rgba(20, 28, 30, 0.14)',
          padding: 0,
        },
        '.leaflet-popup-content': { margin: 0, padding: '14px 16px' },
        '.leaflet-popup-tip': { border: `1px solid ${colors.rule}`, boxShadow: 'none' },
        '.leaflet-popup-close-button': {
          color: `${colors.inkMuted} !important`,
          top: '8px !important',
          right: '8px !important',
        },
        '.leaflet-control-zoom': { border: 'none !important', boxShadow: 'none !important' },
        '.leaflet-control-zoom a': {
          color: colors.ink,
          background: colors.surface,
          border: `1px solid ${colors.rule}`,
          '&:hover': { background: colors.inkWashStrong, color: colors.ink },
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

    MuiAutocomplete: {
      styleOverrides: {
        paper: { ...overlaySurface, marginTop: 6 },
        listbox: { padding: 6 },
        option: {
          borderRadius: radius - 4,
          '&.Mui-focused': { backgroundColor: colors.inkWash },
          '&[aria-selected="true"]': { backgroundColor: colors.inkWashStrong },
        },
        noOptions: { fontSize: 14, color: colors.inkMuted },
        loading: { fontSize: 14, color: colors.inkMuted },
      },
    },
    MuiMenu: { styleOverrides: { paper: overlaySurface } },
    MuiPopover: { styleOverrides: { paper: overlaySurface } },

    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: { borderColor: colors.rule, borderRadius: radius },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: { padding: 22, '&:last-child': { paddingBottom: 22 } },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 40 },
        indicator: { height: 2, backgroundColor: colors.navy },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 40,
          padding: '8px 14px',
          fontFamily: fonts.condensed,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: colors.inkMuted,
          '&.Mui-selected': { color: colors.ink },
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: radius, paddingInline: 18 },
        sizeLarge: { paddingBlock: 11, fontSize: 13 },
        containedPrimary: { '&:hover': { backgroundColor: '#000000' } },
        outlined: {
          borderColor: colors.ruleStrong,
          color: colors.ink,
          '&:hover': { borderColor: colors.ink, background: colors.inkWash },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: radius,
          background: colors.surface,
          '& fieldset': { borderColor: colors.rule },
          '&:hover fieldset': { borderColor: colors.ruleStrong },
          '&.Mui-focused .MuiSvgIcon-root': { color: colors.ink },
        },
        input: {
          fontSize: 14.5,
          paddingTop: 10.5,
          paddingBottom: 10.5,
          '&::placeholder': { color: colors.inkMuted, opacity: 1 },
        },
        notchedOutline: {
          top: 0,
          '& legend': { display: 'none' },
        },
      },
    },

    MuiInputLabel: {
      defaultProps: { shrink: true },
      styleOverrides: {
        outlined: {
          ...stampLabel,
          position: 'static',
          transform: 'none',
          maxWidth: '100%',
          color: colors.inkMuted,
          marginBottom: 3,
          '&.Mui-focused': { color: colors.ink },
          '&.Mui-error': { color: colors.rust },
        },
      },
    },
    MuiFormControl: { styleOverrides: { root: { display: 'flex' } } },

    MuiInputAdornment: { styleOverrides: { root: { color: colors.inkMuted } } },

    MuiFormHelperText: { styleOverrides: { root: { fontSize: 12.5, marginLeft: 2 } } },

    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: radius, border: '1px solid', alignItems: 'flex-start' },
        standardError: {
          color: colors.ink,
          backgroundColor: colors.rustSoft,
          borderColor: 'rgba(163, 74, 60, 0.28)',
          '& .MuiAlert-icon': { color: colors.rust },
        },
      },
    },
    MuiAlertTitle: { styleOverrides: { root: { fontWeight: 600, fontSize: 15 } } },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: colors.ink,
          color: colors.surface,
          borderRadius: radius - 4,
          padding: '9px 11px',
          fontSize: 13,
          fontWeight: 500,
          lineHeight: 1.45,
          boxShadow: '0 6px 18px rgba(26, 25, 23, 0.24)',
          '& .MuiTypography-root': { color: 'inherit' },
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

    MuiDivider: { styleOverrides: { root: { borderColor: colors.rule } } },
  },
})
