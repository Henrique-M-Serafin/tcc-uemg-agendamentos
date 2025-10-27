import { CalendarDays, House } from "lucide-react";
import Sidebar from "./sidebar";
import Navbar from "./Navbar";
import { AppointmentsProvider } from "@/context/AppointmentsContext";

interface LayoutProps {
  children: React.ReactNode
}

const Items = [
  { icon: <House/>, label: "Dashboard", path: "/dashboard" },
  // { icon: <Bus/>, label: "Veículos", path: "/veiculos" },
  { icon: <CalendarDays/>, label: "Agendamentos", path: "/agendamentos" },
];

export function Layout({ children }: LayoutProps) {
    return (
    <AppointmentsProvider>
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar items={Items} />
        <div className="flex flex-1">
          <Sidebar items={Items} />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </AppointmentsProvider>
    )
}