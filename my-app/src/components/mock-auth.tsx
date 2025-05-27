"use client"

import { useState, createContext, useContext, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LogOut, Rocket, Target, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { Session, User as SupabaseUser } from '@supabase/supabase-js'

type UserRole = 'creator' | 'promotor' | null

export interface UserProfileData {
  id: string;
  email?: string;
  fullName?: string;
  role: UserRole;
  // Add any other fields from your 'profiles' table that you want in the context
}

interface AuthContextType {
  user: UserProfileData | null;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfileData | null>(null)
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    setLoading(true);
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, user_type') // Adjust fields as needed
          .eq('id', session.user.id)
          .single();

        if (error || !profile) {
          console.error('Error fetching profile or profile not found:', error);
          await supabase.auth.signOut(); // Sign out if profile is missing
          setUser(null);
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email,
            fullName: profile.full_name,
            role: profile.user_type as UserRole,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };
    getCurrentUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setLoading(true);
      if (session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, user_type')
          .eq('id', session.user.id)
          .single();

        if (error || !profile) {
          console.error('Error fetching profile or profile not found during auth state change:', error);
          await supabase.auth.signOut(); // Sign out if profile is missing
          setUser(null);
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email,
            fullName: profile.full_name,
            role: profile.user_type as UserRole,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  const logout = async () => {
    setLoading(true); 
    await supabase.auth.signOut();
    setUser(null); 
    router.push('/auth/login'); 
    setLoading(false); 
  };

  return (
    <AuthContext.Provider value={{ user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function UserProfile() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">
        {user.fullName || user.email} ({user.role}) {/* Fallback to email if fullName is not available */}
      </span>
      <Button
        onClick={logout}
        variant="ghost"
        size="sm"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}