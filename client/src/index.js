import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createTheme, ThemeProvider } from "@mui/material"

const root = ReactDOM.createRoot(document.getElementById('root'));

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#4e73df"
//     },
//     secondary: {
//       main: "#f7f8fb"
//     },
//     error: {
//       main: "#d32f2f"
//     },
//     success: {
//       main: "#2e7d32"
//     },
//     info: {
//       main: "#E3D5CA"
//     }
//   },
//   typography: {
//     fontFamily: [
//       'Montserrat',
//       'Roboto',
//       'Lato'
//     ].join(',')
//   }
// })

const theme = createTheme({
  palette: {
    primary: {
      main: '#4e73df',
    },
    secondary: {
      main: '#ffffff',
    },
    background: {
      default: '#f8f9fc',
    },
    text: {
      primary: '#333333',
      lightBlue: '#DDE5F9',
      ternary: '#4e73df',
      grey: "#858796",
      darkBlue: "#354c8f"
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontWeight: 400,
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
        borderRadius: 8,
        fontWeight: 500,
      },
      containedPrimary: {
        color: '#fff',
      },
    },
    MuiTextField: {
      root: {
        borderRadius: 8,
      },
    },
  },
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
