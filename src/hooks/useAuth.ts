// hooks/useAuth.ts
import type { User, Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setSession(session);
          setUser(session.user);
        } else {
          // Sign in anonymously if no session
          const { data, error } = await supabase.auth.signInAnonymously();

          if (error) {
            console.error("Anonymous sign in failed:", error);
          } else if (data?.user) {
            setSession(data.session);
            setUser(data.user);
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setLoading(false);   // ← Important: Always stop loading
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { 
    user, 
    session, 
    loading,
    isAnonymous: user?.is_anonymous ?? true 
  };
}