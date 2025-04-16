// src/components/ui/provider.jsx
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../../theme';

export function Provider({ children }) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  );
}

export default Provider;