// pages/_app.tsx
import { AuthProvider } from "@/hooks/auth/authContext";
import { CustomChakraProvider } from "@/providers/ChakraProvider";
import type { AppProps } from "next/app";
import { NextPageWithAuth } from 'next';

// Extendemos o tipo AppProps para incluir nossa propriedade personalizada
type AppPropsWithAuth = AppProps & {
  Component: NextPageWithAuth;
};

function MyApp({ Component, pageProps }: AppPropsWithAuth) {
  // authRequired é true por padrão (páginas requerem auth a menos que especificado o contrário)
  const authRequired = Component.authRequired !== false;

  return (
    <AuthProvider requireAuth={authRequired}>
      <CustomChakraProvider>
        <Component {...pageProps} />
      </CustomChakraProvider>
    </AuthProvider>
  );
}

export default MyApp;