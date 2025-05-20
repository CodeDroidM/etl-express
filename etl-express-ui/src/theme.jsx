// ====== theme.js ======
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#c94bf6', // Vibrant pink-purple
    },
    secondary: {
      main: '#6e5be8', // Neon purple
    },
    background: {
      default: '#0d0d0d',
      paper: '#161616',
    },
    text: {
      primary: '#ffffff',
      secondary: '#bbbbbb',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontWeightBold: 700,
    h3: { fontSize: '2.5rem' },
    h4: { fontSize: '2rem' },
    h6: { fontSize: '1.2rem' },
  },
});

export default theme;
