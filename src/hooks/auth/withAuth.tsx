// hoc/withAuth.tsx
import { useAuth } from './authContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const { appUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !appUser) {
        router.push('/login');
      }
    }, [loading, appUser, router]);

    if (loading || !appUser) {
      return <div>Loading...</div>;
    }

    return <WrappedComponent {...props} />;
  };

  Wrapper.authRequired = true;
  return Wrapper;
};