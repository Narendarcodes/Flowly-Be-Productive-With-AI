import type { Config } from 'tailwindcss';

/**
 * Flowly design tokens: calm neutrals (zinc) plus a single teal accent.
 * No gradients, no glow, no emoji — hierarchy comes from type and spacing.
 */
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#0f766e',
          hover: '#115e59',
          soft: '#f0fdfa',
          muted: '#99d5cf',
        },
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
    },
  },
  plugins: [],
} as Omit<Config, 'content'>;
