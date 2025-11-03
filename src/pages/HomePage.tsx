import LabCard from "@/components/labCard";
import { WeekDaySelector } from "@/components/weekDays";
import { useResources } from "@/hooks/use-supabase-client";
import type { AppointmentWithRelations } from "@/types";
import { useState } from "react";
import { useAppointmentsContext } from "@/context/AppointmentsContext";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useAppData } from "@/context/AppDataContext";

// 🔹 Lista dos dias da semana
const weekDays = [
  { label: "Segunda-Feira", value: "mon" },
  { label: "Terça-Feira", value: "tue" },
  { label: "Quarta-Feira", value: "wed" },
  { label: "Quinta-Feira", value: "thu" },
  { label: "Sexta-Feira", value: "fri" },
  { label: "Sábado", value: "sat" },
];

// 🔹 Utilitários de data
function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

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

// Retorna a data da PRÓXIMA ocorrência do dia da semana escolhido
function getNextDateForDay(dayValue: string) {
  const today = new Date();
  const todayIndex = today.getDay();
  const targetIndex = dayToIndex(dayValue);

  const diff = (targetIndex - todayIndex + 7) % 7;
  const result = new Date(today);
  result.setDate(today.getDate() + diff);
  return formatDate(result);
}

export function HomePage() {
  const today = new Date();
  const todayStr = formatDate(today);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
const { resources, loadingResources } = useAppData();

  const { appointments, loading } = useAppointmentsContext();

  // 🔹 Quando o usuário escolhe o dia, calcula a PRÓXIMA data desse dia
  function handleDayChange(day: { label: string; value: string } | null) {
    if (!day) {
      setSelectedDate(null);
      return;
    }
    const nextDate = getNextDateForDay(day.value);
    setSelectedDate(nextDate);
  }

    // 🔹 Filtrar para manter apenas os agendamentos da data selecionada
  const filteredAppointments = appointments.filter((app) => {
    const appDate = app.date.slice(0, 10);

    if (!selectedDate) {
      // Sem filtro → mostra todos a partir de hoje
      return appDate >= todayStr;
    }

    // Mostrar somente agendamentos do dia selecionado
    return appDate === selectedDate;
  });

  // 🔹 Agrupar agendamentos por recurso (nome)
  const appointmentsByResource: Record<string, AppointmentWithRelations[]> = {};
  filteredAppointments.forEach((app) => {
    const name = app.resource_name?.trim() ?? "";
    if (!appointmentsByResource[name]) appointmentsByResource[name] = [];
    appointmentsByResource[name].push(app);
  });

  // 🔹 Ordenar agendamentos por data/hora dentro de cada recurso
  Object.values(appointmentsByResource).forEach((apps) =>
    apps.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      // se start_time pode ser undefined, normalize com empty string
      return (a.start_time || "").localeCompare(b.start_time || "");
    })
  );

  // 🔹 Separar e ordenar recursos (somente ativos se aplicável)
  // 🔹 Separar e ordenar recursos (somente ativos)
  const labsOnly = resources
    .filter((lab) => lab.type === "Lab" && lab.is_active)
    .sort((a, b) => a.name.localeCompare(b.name));

  const audOnly = resources
    .filter((r) => r.type === "Aud" && r.is_active)
    .sort((a, b) => a.name.localeCompare(b.name));


  // 🔹 Enriquecer com status e agendamentos filtrados
  // Se houver selectedDate: pegamos apenas o primeiro agendamento daquele dia (o mais próximo)
  // Se não houver selectedDate: passamos todos os agendamentos futuros já filtrados acima
  const labsWithAppointments = labsOnly.map((lab) => {
    const key = lab.name?.trim() ?? "";
    const appsForLab = appointmentsByResource[key] ?? [];

    const appointmentsToShow = selectedDate
      ? (appsForLab.length > 0 ? [appsForLab[0]] : []) // somente 1 (o mais próximo) quando filtrado por dia
      : appsForLab; // sem filtro -> todos os futuros já filtrados

    return {
      ...lab,
      appointments: appointmentsToShow,
      badge: (appointmentsToShow.length > 0) ? "Reservado" : "Disponível",
    };
  });

  const audWithAppointments = audOnly.map((aud) => {
    const key = aud.name?.trim() ?? "";
    const appsForAud = appointmentsByResource[key] ?? [];

    const appointmentsToShow = selectedDate
      ? (appsForAud.length > 0 ? [appsForAud[0]] : [])
      : appsForAud;

    return {
      ...aud,
      appointments: appointmentsToShow,
      badge: (appointmentsToShow.length > 0) ? "Reservado" : "Disponível",
    };
  });


  return (
    <main className="pb-24 md:pb-4">
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

      {/* 🔹 Filtro de dia da semana */}
      <WeekDaySelector weekDays={weekDays} onChange={handleDayChange} />

      {/* 🔹 Mostrar a data filtrada */}
      {selectedDate && (
        <p className="text-center text-sm -mb-2">
          Mostrando agendamentos para o dia <b>{selectedDate}</b>
        </p>
      )}

      {/* 🔹 Laboratórios */}
      <div className="my-4 flex flex-col gap-2">
        <h2 className="text-lg font-bold">Laboratórios</h2>
        <hr className="border-1" />
      </div>

      {loading || loadingResources ? (
        <p>Carregando laboratórios...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {labsWithAppointments.map((lab) => (
            <LabCard
              key={`${lab.id}-${selectedDate ?? "all"}`}
              title={lab.name}
              capacity={lab.capacity}
              badge={(appointmentsByResource[lab.name]?.length ?? 0) > 0 ? "Reservado" : "Disponível"}
              appointments={lab.appointments}
            />
          ))}

        </div>
      )}

      {/* 🔹 Auditórios */}
      <div className="my-4 flex flex-col gap-2">
        <h2 className="text-lg font-bold">Auditórios</h2>
        <hr className="border-1" />
      </div>

      {loading || loadingResources ? (
        <p>Carregando auditórios...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {audWithAppointments.map((aud) => (
            <LabCard
              key={`${aud.id}-${selectedDate ?? "all"}`}
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
