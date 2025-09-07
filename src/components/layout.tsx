import { Bus, CalendarDays, House } from "lucide-react";
import Sidebar from "./sidebar";

interface LayoutProps {
  children: React.ReactNode
}

const sidebarItems = [
  { icon: <House/>, label: "Dashboard", path: "/" },
  { icon: <CalendarDays/>, label: "Agendamentos", path: "/agendamentos" },
  { icon: <Bus/>, label: "Veículos", path: "/veiculos" },
];

export function Layout({ children }: LayoutProps) {
    return (
    <div className="min-h-screen bg-background flex flex-col">
         <div className="flex flex-1">
            <Sidebar items={sidebarItems} />
        <main className="flex-1 p-6">
                {children}
        </main>
        </div>
    </div>
    )
}