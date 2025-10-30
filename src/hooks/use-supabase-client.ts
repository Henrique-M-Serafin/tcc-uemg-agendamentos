import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import type { AppointmentWithRelations, Resource } from "@/types";

export function useAppointments() {
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("AppointmentsView")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Erro ao buscar reservas:", error);
    } else {
      setAppointments(data as AppointmentWithRelations[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchAppointments();
      else setAppointments([]);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { appointments, loading, refresh: fetchAppointments };
}



export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchResources() {
      setLoading(true);

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.warn("Nenhuma sessão ativa — não buscar resources.");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.from("Resources").select("*");

      if (!mounted) return;

      if (error) {
        console.error("Erro ao buscar resources:", error);
      } else {
        setResources(data || []);
      }

      setLoading(false);
    }

    fetchResources();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchResources();
      else setResources([]);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { resources, loading };
}

export function useVehicleAppointments() {
  const [vehicleAppointments, setVehicleAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchVehicleAppointments = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("VehicleAppointmentsView")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("Erro ao buscar agendamentos de veículos:", error);
    } else {
      setVehicleAppointments(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchVehicleAppointments();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchVehicleAppointments();
      else setVehicleAppointments([]);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { vehicleAppointments, loading, refresh: fetchVehicleAppointments };
} 

export function useVehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchVehicles = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("Vehicles")
      .select("*")
      .order("type", { ascending: true })
      .order("model", { ascending: true });

    if (error) {
      console.error("Erro ao buscar veículos:", error);
      setVehicles([]);
    } else {
      setVehicles(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchVehicles();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) fetchVehicles();
      else setVehicles([]);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return { vehicles, loading, refresh: fetchVehicles };
}
