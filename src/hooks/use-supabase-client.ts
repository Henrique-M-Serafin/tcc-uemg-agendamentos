import { useEffect, useState } from "react";
import { supabase } from "../api/supabaseClient";
import type { Appointments } from "@/types";

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointments[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('Appointments')
          .select("*")
          .order("date", { ascending: true });

        if (error) throw error;
        setAppointments(data as Appointments[]);
        console.log("Appointments fetched:", data);


      } catch (err) {
        console.error("Erro ao buscar reservas:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAppointments();
  }, []);

  return { appointments, loading };
}
