import { Bus, CalendarDays, House } from "lucide-react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";

interface LayoutProps {
  children: React.ReactNode
}

const sidebarItems = [
  { icon: <House/>, label: "Dashboard", path: "/" },
  { icon: <CalendarDays/>, label: "Agendamentos", path: "/agendamentos" },
  { icon: <Bus/>, label: "Veículos", path: "/veiculos" },
];

const navbarItems = [
    { label: "Dashboard", path: "/" },
    { label: "Agendamentos", path: "/agendamentos" },
    { label: "Veículos", path: "/veiculos" },
];

export function Layout({ children }: LayoutProps) {

    return (
    <div className="min-h-screen bg-background flex flex-col">
        <Navbar items={navbarItems} />
         <div className="flex flex-1">
            <Sidebar items={sidebarItems} />
        <main className="flex-1 p-6">
                {children}
        </main>
        </div>
    </div>
    )
}