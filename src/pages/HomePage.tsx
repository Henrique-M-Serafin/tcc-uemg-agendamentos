import LabCard from "@/components/labCard";
import { WeekDaySelector } from "@/components/weekDays";
import { useResources } from "@/hooks/use-supabase-client";
import type { AppointmentWithRelations } from "@/types";
import { useState } from "react";
import { useAppointmentsContext } from "@/context/AppointmentsContext";

const weekDays = [
  { label: "Segunda-Feira", value: "mon" },
  { label: "Terça-Feira", value: "tue" },
  { label: "Quarta-Feira", value: "wed" },
  { label: "Quinta-Feira", value: "thu" },
  { label: "Sexta-Feira", value: "fri" },
  { label: "Sábado", value: "sat" },
];

export function HomePage() {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { appointments, loading } = useAppointmentsContext();
  const { resources, loading: loadingResources } = useResources();

  // 🔹 Filtrar apenas os agendamentos do dia selecionado ou todos a partir de hoje
  const todayStr = today.toISOString().slice(0, 10); // "2025-10-27"

  const filteredAppointments = appointments.filter((app) => {
    const appDay = app.date.slice(0, 10); // pega só a data

    if (!selectedDate) {
      // Nenhum dia selecionado → mostra de hoje em diante
      return appDay >= todayStr;
    }

    // Filtro por dia específico
    return appDay === selectedDate;
  });



  // Agrupar por laboratório
  const appointmentsByResource: Record<string, AppointmentWithRelations[]> = {};
  filteredAppointments.forEach((app) => {
    const name = app.resource_name?.trim();
    if (!appointmentsByResource[name]) appointmentsByResource[name] = [];
    appointmentsByResource[name].push(app);
  });

  // Ordenar por data e hora
  Object.values(appointmentsByResource).forEach((apps) =>
    apps.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return (a.start_time || "").localeCompare(b.start_time || "");
    })
  );

  // Enriquecer os labs
  const labsWithAppointments = resources.map((lab) => ({
    ...lab,
    appointments: appointmentsByResource[lab.name?.trim()] || [],
    badge: (appointmentsByResource[lab.name]?.length ?? 0) > 0 ? "Reservado" : "Disponível",
  }));

  function dayToIndex(day: string): number {
    switch (day) {
      case "sun": return 0;
      case "mon": return 1;
      case "tue": return 2;
      case "wed": return 3;
      case "thu": return 4;
      case "fri": return 5;
      case "sat": return 6;
      default: return 0;
    }
  }

  return (
    <main>
      <WeekDaySelector
        weekDays={weekDays}
        onChange={(day) => {
          if (!day) {
            // Se resetou o filtro, mostrar todos os dias
            setSelectedDate(null);
            return;
          }

          const dayValue = day.value;
          const today = new Date();
          const diff = (dayToIndex(dayValue) - today.getDay() + 7) % 7;
          const newDate = new Date(today);
          newDate.setDate(today.getDate() + diff);
          setSelectedDate(newDate.toISOString().slice(0, 10));
        }}
      />

      {(loading || loadingResources) ? (
        <p>Carregando laboratórios...</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {labsWithAppointments.map((lab) => (
            <LabCard
              key={lab.id}
              title={lab.name}
              capacity={lab.capacity}
              badge={(appointmentsByResource[lab.name]?.length ?? 0) > 0 ? "Reservado" : "Disponível"}
              appointments={lab.appointments}
            />
          ))}
        </div>
      )}
    </main>
  );
}
