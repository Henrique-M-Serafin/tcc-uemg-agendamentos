// contexts/AppointmentsContext.tsx
import { createContext, useContext } from "react";
import { useAppointments as useSupabaseAppointments } from "@/hooks/use-supabase-client";

interface AppointmentsContextType {
  appointments: any[];
  loading: boolean;
  refreshAppointments: () => void;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export const AppointmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { appointments, loading, refreshAppointments } = useSupabaseAppointments();
  return (
    <AppointmentsContext.Provider value={{ appointments, loading, refreshAppointments }}>
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointmentsContext = () => {
  const context = useContext(AppointmentsContext);
  if (!context) throw new Error("useAppointmentsContext must be used inside AppointmentsProvider");
  return context;
};
