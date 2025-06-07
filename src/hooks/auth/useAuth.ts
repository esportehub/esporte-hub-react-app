// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { decodeToken, DecodedToken } from '@/interfaces/DecodedToken';
import { AppUser } from '@/models/AppUser';

export const useAuth = () => {
  const router = useRouter();
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.user_id) {
        setUser(decoded);
        setAppUser(AppUser.fromDecodedUser(decoded));
      } else {
        setUser(null);
        router.push('/unauthorized'); // redireciona se token inválido
      }
    } else {
      setUser(null);
      router.push('/unauthorized'); // redireciona se não houver token
    }
    setLoading(false);
  }, []);

  return { user, appUser };
};
