import { Bus, CalendarDays, House } from "lucide-react";
import Sidebar from "./sidebar";
import Navbar from "./Navbar";

interface LayoutProps {
  children: React.ReactNode
}

const sidebarItems = [
  { icon: <House/>, label: "Dashboard", path: "/" },
  { icon: <Bus/>, label: "Veículos", path: "/veiculos" },
  { icon: <CalendarDays/>, label: "Agendamentos", path: "/agendamentos" },
];

export function Layout({ children }: LayoutProps) {
    return (
    <div className="min-h-screen bg-background flex flex-col">
        <Navbar items={sidebarItems} />
         <div className="flex flex-1">
            <Sidebar items={sidebarItems} />
        <main className="flex-1 p-6">
                {children}
        </main>
        </div>
    </div>
    )
}