import { CalendarDays, House } from "lucide-react";
import Sidebar from "./sidebar";
import Navbar from "./Navbar";
import { AppointmentsProvider } from "@/context/AppointmentsContext";
import { Toaster } from "@/components/ui/sonner";

interface LayoutProps {
  children: React.ReactNode;
}

const Items = [
  { icon: <House />, label: "Dashboard", path: "/dashboard" },
  { icon: <CalendarDays />, label: "Agendamentos", path: "/agendamentos" },
];

export function Layout({ children }: LayoutProps) {
  return (
    <AppointmentsProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Navbar fixa no topo */}
        <Navbar items={Items} />

        <div className="flex flex-1 relative">
          {/* Sidebar fixa à esquerda */}
          <Sidebar items={Items} />

          {/* Conteúdo principal com margem igual à largura da sidebar */}
          <main className="flex-1 p-6 ml-64 overflow-y-auto">
            {children}
          </main>

          <Toaster />
        </div>
      </div>
    </AppointmentsProvider>
  );
}
