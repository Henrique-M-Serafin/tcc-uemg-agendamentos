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

