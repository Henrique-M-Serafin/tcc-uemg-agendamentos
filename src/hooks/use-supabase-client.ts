import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import type { AppointmentWithRelations, Resource } from "@/types";

export function useAppointments() {
  const [appointments, setAppointments] = useState<AppointmentWithRelations[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAppointments() {
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
    }

    fetchAppointments();
  }, []);

  return { appointments, loading };
}

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      setLoading(true);
      const { data, error } = await supabase.from("Resources").select("*");
      if (error) {
        console.error("Erro ao buscar resources:", error);
      } else {
        setResources(data || []);
      }
      setLoading(false);
    }

    fetchResources();
  }, []);

  return { resources, loading };
}
