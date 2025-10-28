// Sidebar.tsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarImage} from "@/components/ui/avatar";
import { Switch } from "./ui/switch";
import { useTheme } from "@/context/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import { PlusIcon } from "lucide-react";
import { CreateAppointmentDialog } from "./CreateAppointmentDialog";


interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (

    <Link
      to={path}
      className={` px-4 py-2 flex gap-2 font-semibold rounded-md mb-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground ${
        isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground"
      }`}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      {label}
    </Link>
  );
};

interface SidebarProps {
  items: SidebarItemProps[];
}


 
const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const {theme, toggleTheme} = useTheme();
  const navigate = useNavigate();
  const { profile, loading, signOut } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shifts] = useState<"Morning" | "Afternoon" | "Evening">("Morning");




  const handleLogout = () => {
    signOut()
    navigate('/');
  }


  return (
    <>

      <aside className="w-64 hidden md:flex flex-col justify-between p-4 shadow-md bg-sidebar dark:border-r-1 fixed top-0 left-0 h-screen">
      <div className="text-xl text-center text-accent font-bold mb-4">Laboratórios UEMG</div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Menu</h2>
          <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
          
        </div>  
          {items.map((item) => (
                <SidebarItem key={item.path} {...item} />
          ))}
          {profile?.type === 'admin' && (
          <Button 
          
              className="w-full p-5 border-primary border-1 hover:border-secondary" 
              onClick={() => setDialogOpen(true)}
              variant={"ghost"}
            >
              <PlusIcon></PlusIcon>
              Criar Agendamento
            </Button>
          )}
          
      </div>
      <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Avatar >
              <AvatarImage className="" src="https://github.com/shadcn.png" />
            </Avatar>
            {/* exibe o nome assim que o profile estiver carregado */}
            {loading ? (
              <p className="text-sm text-muted-foreground italic">Carregando...</p>
            ) : (
              <p className="font-semibold">
                {profile?.name || "Usuário não identificado"}
              </p>
            )}
          </div>
          <Button 
            onClick={() => {
              handleLogout();
            }}
            variant="outline" className="w-full">
              Sair
          </Button>
      </div>
      </aside>
      {profile?.type === "admin" && (
        <CreateAppointmentDialog
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          shifts={shifts}
          
        />
      )}
    </>
  );
};

export default Sidebar;
