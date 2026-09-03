export const colors = {
  ink: '#1A1917',
  inkMuted: '#6A665D',
  inkFaint: '#9A9488',

  paper: '#F5F2EA',
  surface: '#FFFFFF',

  rule: '#DDD8CC',
  ruleStrong: '#B4AD9C',

  inkWash: 'rgba(26, 25, 23, 0.045)',
  inkWashStrong: 'rgba(26, 25, 23, 0.085)',

  slate: '#8A867C',
  plum: '#6B5B8A',
  navy: '#1D3557',
  ochre: '#A9761F',

  navySoft: '#E4E8EF',
  navyWash: 'rgba(29, 53, 87, 0.06)',

  rust: '#9A3324',
  rustDark: '#79271B',
  rustSoft: '#F6EBE7',
  panelBg: '#1A1917',
  panelRule: 'rgba(255, 255, 255, 0.14)',
  panelInk: '#E8E2D4',
  panelInkMuted: '#9A9280',
  panelAmber: '#C08427',
}

export const fonts = {
  sans: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  condensed:
    '"IBM Plex Sans Condensed", "IBM Plex Sans", -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
}

export const radius = 2

export const layout = {
  formMaxWidth: 560,
  mapHeight: 460,
  mastheadHeight: 56,
  mastheadOffset: 62,
}

export const tickRule = (color = colors.rule, spacing = 8) =>
  `repeating-linear-gradient(90deg, ${color} 0 1px, transparent 1px ${spacing}px)`
