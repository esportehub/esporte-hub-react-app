// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { decodeToken, DecodedToken } from '@/interfaces/DecodedToken';
import { AppUser } from '@/models/AppUser';

export const useAuth = () => {
    const router = useRouter();
    const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
    const [appUser, setAppUser] = useState<AppUser | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [errorAuth, setErrorAuth] = useState<string | null>(null);

    useEffect(() => {
        const authenticate = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const decoded = decodeToken(token);
                if (!decoded?.user_id) {
                    throw new Error('Invalid token');
                }

                setDecodedToken(decoded);
                
                // Busca os dados completos do usuário na API
                const user = await AppUser.fromAPI(decoded.user_id);
                setAppUser(user);
                
            } catch (err) {
                console.error('Authentication error:', err);
                setErrorAuth(err instanceof Error ? err.message : 'Authentication failed');
                router.push('/unauthorized');
            } finally {
                setLoadingAuth(false);
            }
        };

        authenticate();
    }, [router]);

    return { decodedToken, appUser, loadingAuth, errorAuth };
};