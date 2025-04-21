import { extendTheme } from "@chakra-ui/react";
import type { ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      500: "#3b82f6",
      900: "#1e3a8a",
    },
  },
  fonts: {
    heading: "Inter, sans-serif",
    body: "Inter, sans-serif",
  },
});

export default theme;