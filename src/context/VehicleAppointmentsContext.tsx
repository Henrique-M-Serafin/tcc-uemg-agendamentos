// contexts/VehicleAppointmentsContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/api/supabaseClient";
import type { VehicleAppointmentsWithRelations } from "@/types";

interface VehicleAppointmentsContextType {
  vehicleAppointments: VehicleAppointmentsWithRelations[];
  loading: boolean;
  refreshVehicles: () => Promise<void>;
}

const VehicleAppointmentsContext = createContext<VehicleAppointmentsContextType | undefined>(undefined);

export const VehicleAppointmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [vehicleAppointments, setVehicleAppointments] = useState<VehicleAppointmentsWithRelations[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshVehicles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("VehicleAppointmentsView")
      .select("*"); // você pode adicionar `.eq("vehicle_id", ...)` se quiser filtrar
    if (!error && data) setVehicleAppointments(data);
    setLoading(false);
  };

  // Carrega ao montar
  useEffect(() => {
    refreshVehicles();
  }, []);

  return (
    <VehicleAppointmentsContext.Provider value={{ vehicleAppointments, loading, refreshVehicles }}>
      {children}
    </VehicleAppointmentsContext.Provider>
  );
};

export const useVehicleAppointmentsContext = () => {
  const context = useContext(VehicleAppointmentsContext);
  if (!context) throw new Error("useVehicleAppointmentsContext must be used inside VehicleAppointmentsProvider");
  return context;
};
