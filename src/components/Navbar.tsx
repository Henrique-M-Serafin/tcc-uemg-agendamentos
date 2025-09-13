// Navbar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarImage} from "@/components/ui/avatar";
import { Switch } from "./ui/switch";
import { useTheme } from "@/context/ThemeProvider";


interface NavbarItemProps {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const NavbarItem: React.FC<NavbarItemProps> = ({ icon, label, path }) => {
  const location = useLocation();
  const isActive = location.pathname === path;

  return (
    <Link
      to={path}
      className={`px-1 py-2 flex gap-2 rounded-md  ${
        isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
      }`}
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
        <span className="text-sm">{label}</span>
    </Link>
  );
};

interface NavbarProps {
  items: NavbarItemProps[];
}

const Navbar: React.FC<NavbarProps> = ({ items }) => {
  const {theme, toggleTheme} = useTheme();

  return (
    <nav className="w-full max-w-screen md:hidden bg-sidebar border-b border-sidebar-border shadow-sm">
      <div className="max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-lg font-bold text-accent">Laboratórios UEMG</h1>
          </div>
          


          {/* Right side - User info and theme toggle */}
          <div className="flex items-center gap-4">
            <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />

            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="https://github.com/shadcn.png" />
              </Avatar>
            </div>
            
            <Button variant="outline" size="sm">
              Sair
            </Button>
          </div>
          {/* Navigation Items */}
          
        </div>
        <div className="flex p-2 items-center justify-center">
            {items.map((item) => (
                  <NavbarItem key={item.path} {...item} />
            ))}
          </div> 
      </div>
    </nav>
  );
};

export default Navbar;
