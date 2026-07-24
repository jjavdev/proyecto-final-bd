import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3dffa3',
      contrastText: '#00391f',
      dark: '#007244',
    },
    error: {
      main: '#ff4d4d',
      contrastText: '#690005',
      dark: '#93000a',
    },
    background: {
      default: '#131313',
      paper: '#1a1a1a',
    },
    text: {
      primary: '#e5e2e1',
      secondary: '#bacbbc',
    },
    divider: '#2d2d2d',
  },
  typography: {
    fontFamily: ['Inter', 'sans-serif'].join(','),
    h1: {
      fontFamily: ['Sora', 'sans-serif'].join(','),
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: ['Sora', 'sans-serif'].join(','),
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: ['Sora', 'sans-serif'].join(','),
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.35,
    },
    h4: {
      fontFamily: ['Sora', 'sans-serif'].join(','),
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h5: {
      fontFamily: ['Sora', 'sans-serif'].join(','),
      fontSize: '1.125rem',
      fontWeight: 600,
    },
    h6: {
      fontFamily: ['Sora', 'sans-serif'].join(','),
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1.125rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0 0 15px rgba(61, 255, 163, 0.15)',
    '0 0 20px rgba(61, 255, 163, 0.2)',
    '0 0 25px rgba(61, 255, 163, 0.25)',
    '0 0 30px rgba(61, 255, 163, 0.3)',
    '0 4px 6px rgba(0,0,0,0.3)',
    '0 6px 10px rgba(0,0,0,0.3)',
    '0 8px 12px rgba(0,0,0,0.3)',
    '0 10px 14px rgba(0,0,0,0.3)',
    '0 12px 16px rgba(0,0,0,0.3)',
    '0 14px 18px rgba(0,0,0,0.3)',
    '0 16px 20px rgba(0,0,0,0.3)',
    '0 18px 22px rgba(0,0,0,0.3)',
    '0 20px 24px rgba(0,0,0,0.3)',
    '0 22px 26px rgba(0,0,0,0.3)',
    '0 24px 28px rgba(0,0,0,0.3)',
    '0 26px 30px rgba(0,0,0,0.3)',
    '0 28px 32px rgba(0,0,0,0.3)',
    '0 30px 34px rgba(0,0,0,0.3)',
    '0 32px 36px rgba(0,0,0,0.3)',
    '0 34px 38px rgba(0,0,0,0.3)',
    '0 36px 40px rgba(0,0,0,0.3)',
    '0 38px 42px rgba(0,0,0,0.3)',
    '0 40px 44px rgba(0,0,0,0.3)',
    '0 42px 46px rgba(0,0,0,0.3)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: ['Inter', 'sans-serif'].join(','),
          backgroundColor: '#131313',
          color: '#e5e2e1',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 600,
          padding: '12px 24px',
        },
        containedPrimary: {
          boxShadow: '0 0 20px rgba(61, 255, 163, 0.2)',
          '&:hover': {
            boxShadow: '0 0 25px rgba(61, 255, 163, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          borderRadius: 16,
          border: '1px solid #2d2d2d',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #2d2d2d',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
        },
      },
    },
  },
})

export default theme
