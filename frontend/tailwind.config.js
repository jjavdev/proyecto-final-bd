/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#131313',
          dim: '#131313',
          bright: '#3a3939',
          'container-lowest': '#0e0e0e',
          'container-low': '#1c1b1b',
          container: '#1a1a1a',
          'container-high': '#2a2a2a',
          'container-highest': '#353534',
        },
        'on-surface': { DEFAULT: '#e5e2e1', variant: '#bacbbc' },
        primary: {
          DEFAULT: '#3dffa3',
          container: '#3dffa3',
          'fixed-dim': '#00e38c',
        },
        'on-primary': { DEFAULT: '#00391f', container: '#007244' },
        outline: { DEFAULT: '#2d2d2d', variant: '#3b4a3f' },
        error: { DEFAULT: '#ff4d4d', container: '#93000a' },
        'on-error': { DEFAULT: '#690005', container: '#ffdad6' },
      },
      fontFamily: {
        headline: ['Sora', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'headline-xl': ['48px', { lineHeight: '56px', fontWeight: '700', letterSpacing: '-0.02em' }],
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '700', letterSpacing: '-0.01em' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', fontWeight: '600', letterSpacing: '0.05em' }],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
      spacing: {
        xs: '4px',
        base: '8px',
        sm: '12px',
        md: '24px',
        lg: '48px',
        xl: '80px',
        gutter: '24px',
        'margin-mobile': '16px',
        'margin-desktop': '64px',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(61, 255, 163, 0.2)',
        'neon-sm': '0 0 15px rgba(61, 255, 163, 0.15)',
      },
    },
  },
  plugins: [],
}
