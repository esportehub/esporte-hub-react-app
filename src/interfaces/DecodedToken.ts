import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
  user_id?: string;
  name?: string;
  email?: string;
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Token inválido:', error);
    return null;
  }
}
