import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createTheme, ThemeProvider } from "@mui/material"

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
  palette: {
    primary: {
      main: "#EDEDE9"
    },
    secondary: {
      main: "#6D5843"
    },
    error: {
      main: "#d32f2f"
    },
    success: {
      main: "#2e7d32"
    },
    info: {
      main: "#E3D5CA"
    }
  },
  typography: {
    fontFamily: [
      'Montserrat',
      'Roboto',
      'Lato'
    ].join(',')
  }
})

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
