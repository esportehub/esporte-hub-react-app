// src/components/ui/provider.jsx

import { ThemeProvider } from "next-themes";


export function Provider({ children }) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}

export default Provider;