import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/api/supabaseClient";

// Tipos do usuário
export type UserType = "admin" | "visitor";

export type UserProfile = {
  id: string;
  name: string;
  type: UserType;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  type: UserType | null;
  profile: UserProfile | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInVisitor: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<UserType | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

useEffect(() => {
  const init = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Erro ao obter sessão:", error);
    } else {
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);

      if (data.session?.user) {
        await fetchUserProfile(data.session.user.id);
      }
    }
    setLoading(false);
  };

  init();

  const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
    setSession(newSession);
    setUser(newSession?.user ?? null);

    if (newSession?.user) {
      fetchUserProfile(newSession.user.id);
    } else {
      setType(null);
      setProfile(null);
    }
  });

  return () => {
    listener.subscription.unsubscribe();
  };
}, []);

  // Busca perfil completo na tabela Users
  const fetchUserProfile = async (userId: string) => {

    const { data, error } = await supabase
      .from("Users")
      .select("id, name, type")
      .eq("id", userId)
      .single();


    if (error) {
      console.error("Erro ao buscar perfil:", error);
      setType(null);
      setProfile(null);
    } else {
      setType(data.type as UserType);
      setProfile(data as UserProfile);
    }
  };

  // Funções de auth


  const signIn: AuthContextValue["signIn"] = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Erro ao fazer login:", error.message);
      return { error: error.message };
    }
    if (data.user) {
      await fetchUserProfile(data.user.id);
    }

    return {};
  };

  const signInVisitor: AuthContextValue["signInVisitor"] = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email: "visitor@teste.com", // conta visitor criada no Supabase
      password: "senha123",
    });

    if (error) return { error: error.message };

    if (data.user) {
      await fetchUserProfile(data.user.id);
    }

    return {};
  };

  const signOut: AuthContextValue["signOut"] = async () => {
    await supabase.auth.signOut();
    setType(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        type,
        profile,
        signIn,
        signInVisitor,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar mais fácil
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}

