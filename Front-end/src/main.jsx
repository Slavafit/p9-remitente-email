import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";


const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff7961',
      main: '#f44336',
      dark: '#ba000d',
      contrastText: '#000',
    },
  },
});


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
  </React.StrictMode>,
)
