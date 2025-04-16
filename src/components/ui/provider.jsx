// src/components/ui/provider.jsx
import { ChakraProvider } from '@chakra-ui/react';

export function Provider({ children }) {
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  );
}

export default Provider;