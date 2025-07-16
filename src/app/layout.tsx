'use client'; // Add this at the top

import { CustomChakraProvider } from '@/providers/ChakraProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>
        <CustomChakraProvider>
          {children}
        </CustomChakraProvider>
      </body>
    </html>
  );
}