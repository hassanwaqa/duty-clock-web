// "Engineered paperwork": this product is a federal form, so the interface is
// built like precision print — warm paper, near-black ink, hairline rules — and
// colour is reserved almost entirely for duty status.
export const colors = {
  ink: '#1A1917',
  inkMuted: '#6A665D',
  inkFaint: '#9A9488',

  paper: '#F5F2EA',
  surface: '#FFFFFF',

  rule: '#DDD8CC',
  ruleStrong: '#B4AD9C',

  // Ink is the action colour: filled buttons read as letterpress, not as a
  // stock framework blue.
  inkWash: 'rgba(26, 25, 23, 0.045)',
  inkWashStrong: 'rgba(26, 25, 23, 0.085)',

  // Duty status. These are the only saturated colours in the product.
  slate: '#8A867C',
  plum: '#6B5B8A',
  navy: '#1D3557',
  ochre: '#A9761F',

  navySoft: '#E4E8EF',
  navyWash: 'rgba(29, 53, 87, 0.06)',

  // Reserved for failures only, so warm red always means something is wrong.
  rust: '#9A3324',
  rustDark: '#79271B',
  rustSoft: '#F6EBE7',
}

export const fonts = {
  sans: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
  condensed:
    '"IBM Plex Sans Condensed", "IBM Plex Sans", -apple-system, "Segoe UI", Helvetica, Arial, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
}

// Near-square: rounded cards are the single loudest "framework default" tell.
export const radius = 2

export const layout = {
  formMaxWidth: 560,
  mapHeight: 460,
  mastheadHeight: 56,
  mastheadOffset: 62,
}

// The quarter-hour tick motif from the log grid, reused as a rule across the UI.
export const tickRule = (color = colors.rule, spacing = 8) =>
  `repeating-linear-gradient(90deg, ${color} 0 1px, transparent 1px ${spacing}px)`
