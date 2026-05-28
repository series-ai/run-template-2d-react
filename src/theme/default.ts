/**
 * Default theme configuration
 * Customize these values to match your app's design
 */
export const defaultTheme = {
  colors: {
    background: '#1a1a2e',
    surface: '#16213e',
    primary: '#667eea',
    secondary: '#764ba2',
    text: {
      primary: '#ffffff',
      muted: 'rgba(255, 255, 255, 0.7)',
    },
    border: 'rgba(255, 255, 255, 0.1)',
    error: '#e74c3c',
    success: '#2ecc71',
    warning: '#f39c12',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
  animation: {
    fast: 150,
    normal: 200,
    slow: 300,
  },
  // Legacy scale tokens (xs..xxl). Escape hatch only.
  // Prefer the semantic `text` roles below for any new code.
  fontSize: {
    xs: 11,
    sm: 13,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 48,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  text: {
    mobile: {
      display: { size: '56px', lineHeight: '1.1', weight: 700 },
      displaySm: { size: '40px', lineHeight: '1.15', weight: 700 },
      h1: { size: '28px', lineHeight: '1.2', weight: 600 },
      h2: { size: '22px', lineHeight: '1.25', weight: 600 },
      h3: { size: '18px', lineHeight: '1.3', weight: 600 },
      bodyLg: { size: '17px', lineHeight: '1.5', weight: 400 },
      body: { size: '15px', lineHeight: '1.5', weight: 400 },
      bodySm: { size: '13px', lineHeight: '1.5', weight: 400 },
      label: { size: '14px', lineHeight: '1.2', weight: 500 },
      caption: { size: '12px', lineHeight: '1.4', weight: 400 },
      numeric: { size: '32px', lineHeight: '1.1', weight: 600 },
    },
    // Desktop column ≈ mobile values. The `.app-container` is capped to
    // 720×1280 even on a 1920px monitor, so the app renders in a phone-width
    // column. At typical desktop viewing distance (~60 cm vs ~30 cm phone)
    // larger px translates to smaller *visual* size — scaling up at this
    // step is inverted. Hold steady or nudge a hair.
    desktop: {
      display: { size: '56px', lineHeight: '1.1', weight: 700 },
      displaySm: { size: '40px', lineHeight: '1.15', weight: 700 },
      h1: { size: '28px', lineHeight: '1.2', weight: 600 },
      h2: { size: '22px', lineHeight: '1.25', weight: 600 },
      h3: { size: '18px', lineHeight: '1.3', weight: 600 },
      bodyLg: { size: '17px', lineHeight: '1.5', weight: 400 },
      body: { size: '15px', lineHeight: '1.5', weight: 400 },
      bodySm: { size: '13px', lineHeight: '1.5', weight: 400 },
      label: { size: '14px', lineHeight: '1.2', weight: 500 },
      caption: { size: '12px', lineHeight: '1.4', weight: 400 },
      numeric: { size: '32px', lineHeight: '1.1', weight: 600 },
    },
    // TV ≈ 1.6–1.8× mobile. TVs are viewed from across the room, so this is
    // the step that actually needs an upscale.
    tv: {
      display: { size: '96px', lineHeight: '1.1', weight: 700 },
      displaySm: { size: '68px', lineHeight: '1.15', weight: 700 },
      h1: { size: '48px', lineHeight: '1.2', weight: 600 },
      h2: { size: '38px', lineHeight: '1.25', weight: 600 },
      h3: { size: '30px', lineHeight: '1.3', weight: 600 },
      bodyLg: { size: '28px', lineHeight: '1.5', weight: 400 },
      body: { size: '24px', lineHeight: '1.5', weight: 400 },
      bodySm: { size: '20px', lineHeight: '1.5', weight: 400 },
      label: { size: '22px', lineHeight: '1.2', weight: 500 },
      caption: { size: '18px', lineHeight: '1.4', weight: 400 },
      numeric: { size: '54px', lineHeight: '1.1', weight: 600 },
    },
  },
} as const;

export type SemanticTextRole =
  | 'display'
  | 'displaySm'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'bodyLg'
  | 'body'
  | 'bodySm'
  | 'label'
  | 'caption'
  | 'numeric';
