// contexts/AppDataContext.tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { supabase } from "@/api/supabaseClient";
import type { AppointmentWithRelations, Resource, VehicleAppointmentsWithRelations } from "@/types";

interface AppDataContextType {
  resources: Resource[];
  vehicles: any[];
  appointments: AppointmentWithRelations[];
  vehicleAppointments: VehicleAppointmentsWithRelations[];
  loadingResources: boolean;
  loadingVehicles: boolean;
  loadingAppointments: boolean;
  loadingVehicleAppointments: boolean;
  refreshResources: () => Promise<void>;
  refreshVehicles: () => Promise<void>;
  refreshAppointments: () => Promise<void>;
  refreshVehicleAppointments: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

export const AppDataProvider = ({ children }: { children: ReactNode }) => {
  // Resources
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);

  const refreshResources = async () => {
    setLoadingResources(true);
    const { data, error } = await supabase.from("Resources").select("*");
    if (!error && data) setResources(data);
    setLoadingResources(false);
  };

  // Vehicles
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(true);

  const refreshVehicles = async () => {
    setLoadingVehicles(true);
    const { data, error } = await supabase.from("Vehicles").select("*").order("type", { ascending: true }).order("model", { ascending: true });
    if (!error && data) setVehicles(data);
    setLoadingVehicles(false);
  };

  // Appointments
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const refreshAppointments = async () => {
    setLoadingAppointments(true);
    const { data, error } = await supabase.from("AppointmentsView").select("*").order("date", { ascending: true });
    if (!error && data) setAppointments(data as AppointmentWithRelations[]);
    setLoadingAppointments(false);
  };

  // Vehicle Appointments
  const [vehicleAppointments, setVehicleAppointments] = useState<VehicleAppointmentsWithRelations[]>([]);
  const [loadingVehicleAppointments, setLoadingVehicleAppointments] = useState(true);

  const refreshVehicleAppointments = async () => {
    setLoadingVehicleAppointments(true);
    const { data, error } = await supabase.from("VehicleAppointmentsView").select("*").order("date", { ascending: true });
    if (!error && data) setVehicleAppointments(data as VehicleAppointmentsWithRelations[]);
    setLoadingVehicleAppointments(false);
  };

  // Load all data on mount
  useEffect(() => {
    refreshResources();
    refreshVehicles();
    refreshAppointments();
    refreshVehicleAppointments();
  }, []);

  return (
    <AppDataContext.Provider
      value={{
        resources,
        vehicles,
        appointments,
        vehicleAppointments,
        loadingResources,
        loadingVehicles,
        loadingAppointments,
        loadingVehicleAppointments,
        refreshResources,
        refreshVehicles,
        refreshAppointments,
        refreshVehicleAppointments,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
};

export const useAppData = () => {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
};
