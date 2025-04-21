import { CustomChakraProvider } from "@/providers/ChakraProvider";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CustomChakraProvider>
      <Component {...pageProps} />
    </CustomChakraProvider>
  );
}

export default MyApp;