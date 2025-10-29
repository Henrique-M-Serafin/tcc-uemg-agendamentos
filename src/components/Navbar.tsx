import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "./ui/switch";
import { useTheme } from "@/context/ThemeProvider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Menu } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "./ui/separator";

interface NavbarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ icon, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`p-3 flex flex-col items-center rounded-md transition-colors duration-200 ${
        isActive
          ? "bg-sidebar-primary text-sidebar-primary-foreground"
          : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
      }`}
    >
      {icon && <span className="w-6 h-6 flex items-center">{icon}</span>}
    </Link>
  );
};

interface NavbarProps {
  items: NavbarItemProps[];
}

const Navbar: React.FC<NavbarProps> = ({ items }) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { profile, loading, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-sidebar border-t border-border shadow-md">
      <div className="flex justify-evenly items-center h-16">
        {items.map((item) => (
          <NavbarItem key={item.path} {...item} />
        ))}

        {/* Botão Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className='p-3 flex flex-col items-center rounded-md transition-colors duration-200'>
              <Menu className="w-6 h-6" />
            </Button>
          </PopoverTrigger>

          {/* Conteúdo do popover */}
          <PopoverContent
            side="top"
            align="center"
            className="w-56 mr-2 mb-2 p-4 flex flex-col gap-3 items-center text-sm 
                     bg-background text-popover-foreground border border-primary rounded-xl shadow-md"
          >
            <div className="flex justify-center items-center w-full gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://github.com/shadcn.png" />
              </Avatar>

              {loading ? (
                  <p className="text-sm text-muted-foreground italic">Carregando...</p>
                ) : (
                  <p className="font-semibold">
                    {profile?.name || "Usuário não identificado"}
                  </p>
                )}
            </div>
            <Separator className="bg-primary"/>
            <div className="flex items-center justify-between w-full">
              <span> {theme === "dark" ? "Dark" : "Light"} mode</span>
              <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
            </div>
              <Separator className="bg-primary"/>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full "
            >
              Sair
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
};

export default Navbar;
