import LabCard from "@/components/labCard";
import { WeekDaySelector } from "@/components/weekDays";
import { useResources } from "@/hooks/use-supabase-client";
import type { AppointmentWithRelations } from "@/types";
import { useState } from "react";
import { useAppointmentsContext } from "@/context/AppointmentsContext";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    const labsOnly = resources
      .filter((lab) => lab.type === "Lab")
      .sort((a, b) => a.name.localeCompare(b.name)); 

    const labsWithAppointments = labsOnly.map((lab) => ({
      ...lab,
      appointments: appointmentsByResource[lab.name?.trim()] || [],
      badge:
        (appointmentsByResource[lab.name?.trim()]?.length ?? 0) > 0
          ? "Reservado"
          : "Disponível",
    }));

    // Enriquecer os auditórios
    const audOnly = resources
      .filter((r) => r.type === "Aud")
      .sort((a, b) => a.name.localeCompare(b.name)); 

    const audWithAppointments = audOnly.map((aud) => ({
      ...aud,
      appointments: appointmentsByResource[aud.name?.trim()] || [],
      badge:
        (appointmentsByResource[aud.name?.trim()]?.length ?? 0) > 0
          ? "Reservado"
          : "Disponível",
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
      
      {/* Indicador de scroll para baixo */}
        <div className="fixed lg:inline-block hidden bottom-3 right-3 animate-bounce duration-[2s] cursor-pointer z-50">
          <Button
            onClick={() => window.scrollBy({ top: window.innerHeight, behavior: "smooth" })}
            className="bg-background border-primary border-1 text-white p-5 rounded-full shadow-lg hover:scale-110 hover:bg-background hover:border-2 transition-transform"
            aria-label="Ver mais conteúdo"
          >
            <ChevronDown className="text-primary"/>
          </Button>
        </div>

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
      <div className="my-4 flex flex-col gap-2">
        <h2 className="text-lg font-bold">Laboratórios</h2>
        <hr className="border-1 " />
      </div>
      {(loading || loadingResources) ? (
        <p>Carregando laboratórios...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
      <div className="my-4 flex flex-col gap-2">
        <h2 className="text-lg font-bold">Auditórios</h2>
        <hr className="border-1" />
      </div>
      {(loading || loadingResources) ? (
        <p>Carregando auditórios...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {audWithAppointments.map((aud) => (
            <LabCard
              key={aud.id}
              title={aud.name}
              capacity={aud.capacity}
              badge={(appointmentsByResource[aud.name]?.length ?? 0) > 0 ? "Reservado" : "Disponível"}
              appointments={aud.appointments}
            />
          ))}
        </div>
      )}
    </main>
  );
}
