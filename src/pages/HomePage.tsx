import LabCard from "@/components/labCard";
import { WeekDaySelector } from "@/components/weekDays";
import { useAppointments, useResources } from "@/hooks/use-supabase-client";
import type { AppointmentWithRelations } from "@/types";

const weekDays = [
  { label: "Segunda-Feira", value: "mon" },
  { label: "Terça-Feira", value: "tue" },
  { label: "Quarta-Feira", value: "wed" },
  { label: "Quinta-Feira", value: "thu" },
  { label: "Sexta-Feira", value: "fri" },
  { label: "Sábado", value: "sat" },
];

export function HomePage() {
  const { appointments } = useAppointments();
  const { resources, loading } = useResources();

  // Agrupar agendamentos por laboratório (resource)
  const appointmentsByResource: Record<string, AppointmentWithRelations[]> = {};
  appointments.forEach((app) => {
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

  // Enriquecer os labs com os agendamentos
  const labsWithAppointments = resources.map((lab) => ({
    ...lab,
    appointments: appointmentsByResource[lab.name.trim()] || [],
    badge: (appointmentsByResource[lab.name]?.length ?? 0) > 0 ? "Reservado" : "Disponível",
  }));

  return (
    <main>
      <WeekDaySelector
        weekDays={weekDays}
        onChange={(day) => console.log("Selecionado:", day)}
      />

      {loading ? (
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
