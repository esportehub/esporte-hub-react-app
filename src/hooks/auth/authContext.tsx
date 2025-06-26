// contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { decodeToken, DecodedToken } from '@/interfaces/DecodedToken';
import { AppUser } from '@/models/AppUser';

interface AuthContextType {
  decodedToken: DecodedToken | null;
  appUser: AppUser | null;
  loading: boolean;
  error: string | null;
  refreshUser: (force?: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  decodedToken: null,
  appUser: null,
  loading: true,
  error: null,
  refreshUser: async () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: React.ReactNode;
  requireAuth?: boolean; // Se false, não redireciona para login
}

export const AuthProvider = ({ children, requireAuth = true }: AuthProviderProps) => {
  const router = useRouter();
  const [state, setState] = useState<Omit<AuthContextType, 'refreshUser' | 'logout'>>({
    decodedToken: null,
    appUser: null,
    loading: true,
    error: null,
  });

  const fetchUser = async (userId: string) => {
    try {
      console.log("Before fetch user from api")
      const user = await AppUser.fromAPI(userId);
      console.log("After fetching user from api: "+user.name)
      setState(prev => ({ ...prev, appUser: user, error: null }));
    } catch (err) {
      console.error('Failed to fetch user:', err);
      if (requireAuth) {
        setState(prev => ({ ...prev, error: err instanceof Error ? err.message : 'Failed to fetch user' }));
      }
      throw err;
    }
  };

  const authenticate = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const decoded = decodeToken(token);
      if (!decoded?.user_id) {
        throw new Error('Invalid token');
      }

      setState(prev => ({ ...prev, decodedToken: decoded }));
      await fetchUser(decoded.user_id);
    } catch (err) {
      console.error('Authentication error:', err);
      if (requireAuth) {
        setState(prev => ({ ...prev, error: err instanceof Error ? err.message : 'Authentication failed' }));
        router.push('/login');
      } else {
        setState(prev => ({ ...prev, loading: false, error: null }));
      }
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const refreshUser = async () => {
    if (state.decodedToken?.user_id) {
      await fetchUser(state.decodedToken.user_id);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setState({
      decodedToken: null,
      appUser: null,
      loading: false,
      error: null,
    });
    router.push('/login');
  };

  useEffect(() => {
    if (requireAuth) {
      authenticate();
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'authToken' && !e.newValue && requireAuth) {
        logout();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router, requireAuth]);

  return (
    <AuthContext.Provider value={{ ...state, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);