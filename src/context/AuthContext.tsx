import { createContext } from "react";

const AuthContext = createContext<{ isAuthenticated: boolean }>({ isAuthenticated: false });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const isAuthenticated = false; // Replace with real authentication logic
    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    )
}
