// ============================================================
// Sunroom — Design System Tokens
// ============================================================

/**
 * Color palette for the Sunroom app.
 *
 * Senior UI: Warm, cozy tones (cream, amber, sage)
 * Family UI: Modern dark mode with glass accents
 */
export const colors = {
  // ----- Senior "Cozy Lofi" Palette -----
  senior: {
    background: '#FFF8F0',       // warm cream
    backgroundAlt: '#FEF3E2',    // slightly deeper cream
    surface: '#FFFFFF',
    surfacePressed: '#FDE8CC',
    text: '#2C1810',             // deep warm brown
    textSecondary: '#6B4C3B',    // muted brown
    accent: '#D4A574',           // warm amber/gold
    accentSoft: '#E8D5B7',       // soft gold
    success: '#7BAE7F',          // muted sage green
    error: '#C97B7B',            // soft muted red
    border: '#E8DDD0',           // warm beige border
    shadow: 'rgba(44, 24, 16, 0.08)',
  },

  // ----- Family Dashboard Dark Palette -----
  family: {
    background: '#0F1117',       // deep dark
    backgroundAlt: '#161822',    // card backgrounds
    surface: '#1E2030',          // elevated surfaces
    surfaceHover: '#262A3E',
    text: '#F0EEF6',             // off-white
    textSecondary: '#8B8DA3',    // muted lavender-gray
    accent: '#7C6FEB',           // vibrant purple
    accentSoft: '#4A3F8F',       // deeper purple
    accentGlow: 'rgba(124, 111, 235, 0.15)',
    success: '#5EC269',
    warning: '#E5A84B',
    error: '#E25D5D',
    border: '#2A2D40',
    glass: 'rgba(30, 32, 48, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.06)',
  },

  // ----- Shared -----
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

/**
 * Typography scale. Senior UI uses larger sizes throughout.
 */
export const typography = {
  fontFamily: {
    primary: 'Inter',
    display: 'Outfit',
  },
  senior: {
    contactName: { fontSize: 36, fontWeight: '700' as const, lineHeight: 44 },
    contactRole: { fontSize: 24, fontWeight: '500' as const, lineHeight: 32 },
    clock: { fontSize: 64, fontWeight: '300' as const, lineHeight: 72 },
    date: { fontSize: 28, fontWeight: '400' as const, lineHeight: 36 },
    quickReply: { fontSize: 32, fontWeight: '600' as const, lineHeight: 40 },
    subtitle: { fontSize: 36, fontWeight: '600' as const, lineHeight: 44 },
    status: { fontSize: 28, fontWeight: '500' as const, lineHeight: 36 },
  },
  family: {
    h1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
    h2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
    h3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
    body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
    bodySm: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
    caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
    button: { fontSize: 16, fontWeight: '600' as const, lineHeight: 24 },
  },
} as const;

/**
 * Spacing scale (4px base unit).
 */
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
} as const;

/**
 * Border radius tokens.
 */
export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  full: 9999,
} as const;

/**
 * Shadow presets (for StyleSheet).
 */
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  }),
} as const;

/**
 * Senior contact button sizing.
 * Minimum 150×150dp as per accessibility requirements.
 */
export const seniorLayout = {
  contactButtonMinSize: 150,
  contactButtonPreferredSize: 180,
  quickReplyMinHeight: 80,
  quickReplyMinWidth: 200,
} as const;
