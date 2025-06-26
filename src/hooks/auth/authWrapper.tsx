// components/AuthWrapper.tsx
import { Spinner, Center, Text } from '@chakra-ui/react';
import { useAuth } from './useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { decodedToken, appUser, loadingAuth, errorAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loadingAuth && (errorAuth || !appUser)) {
      router.push('/login');
    }
  }, [loadingAuth, errorAuth, appUser, router]);

  if (loadingAuth) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (errorAuth || !appUser) {
    return (
      <Center h="100vh">
        <Text>Redirecionando para login...</Text>
      </Center>
    );
  }

  return <>{children}</>;
};