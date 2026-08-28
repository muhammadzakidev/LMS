import { cookies } from 'next/headers';

export type UserRole = 'Students' | 'Instructor';

export interface AuthUser  {
    id: string ,
    name: string ,
    email: string ,
    password: string ,
    role: UserRole
};

export interface AuthSession {
  session: {
    id: string ,
    userId: string ,
    expiresAt: string
  },
  user: AuthUser
}

export async function getAuthSession(): Promise<AuthSession | null>{
    const cookieStore = await cookies();
    try {
      const response = await fetch('http://localhost:5000/api/auth/get-session',{
        method: 'GET',
        headers: {
           cookie: cookieStore.toString(),
        },
        cache: 'no-store'
      })
      const data: AuthSession = await response.json();
      return data ;
    }catch(error){
        console.error('Error fetching auth session:' , error);
        return null;
    }
}