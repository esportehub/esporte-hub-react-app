// src/components/ui/provider.jsx
import { ThemeProvider } from '@mui/material/styles';
import theme from '../../theme';

export function Provider({ children }) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
