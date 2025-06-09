// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { decodeToken, DecodedToken } from '@/interfaces/DecodedToken';
import { AppUser } from '@/models/AppUser';

export const useAuth = () => {
  const router = useRouter();
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = decodeToken(token);
      if (decodedToken && decodedToken.user_id) {
        setDecodedToken(decodedToken);
        setAppUser(AppUser.fromDecodedToken(decodedToken));
      } else {
        setDecodedToken(null);
        router.push('/unauthorized'); // redireciona se token inválido
      }
    } else {
      setDecodedToken(null);
      router.push('/unauthorized'); // redireciona se não houver token
    }
    setLoading(false);
  }, []);

  return { decodedToken, appUser };
};
