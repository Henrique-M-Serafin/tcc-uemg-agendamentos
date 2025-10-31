import { CalendarDays, Car, House } from "lucide-react";
import Sidebar from "./sidebar";
import Navbar from "./Navbar";
import { AppointmentsProvider } from "@/context/AppointmentsContext";
import { Toaster } from "@/components/ui/sonner";
import { VehicleAppointmentsProvider } from "@/context/VehicleAppointmentsContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Items = [
  { icon: <House />, label: "Agendamentos", path: "/agendamentos" },
  { icon: <Car />, label: "Veículos", path: "/veiculos" },

  { icon: <CalendarDays />, label: "Solicitar Agendamento", path: "/solicitar-agendamento" },
];

export function Layout({ children }: LayoutProps) {
  return (
    <VehicleAppointmentsProvider>
    <AppointmentsProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Navbar fixa no topo (visível sempre) */}
        <Navbar items={Items} />

        <div className="flex flex-1 relative">
          {/* Sidebar só aparece em telas md+ */}
          <Sidebar items={Items} />

          {/* Em telas pequenas, a margin-left é removida */}
          <main className="flex-1 p-6 md:ml-64 overflow-y-auto transition-all duration-300">
            {children}
          </main>

          <Toaster />
        </div>
      </div>
    </AppointmentsProvider>
    </VehicleAppointmentsProvider>
  );
}
