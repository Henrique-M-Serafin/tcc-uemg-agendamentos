// Navbar.tsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarImage} from "@/components/ui/avatar";
import { Switch } from "./ui/switch";
import { useTheme } from "@/context/ThemeProvider";


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
      className={`p-2 flex gap-2 rounded-md  ${
        isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:text-sidebar-accent-foreground"
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
  const {theme, toggleTheme} = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement your logout logic here
    // For example, clear authentication tokens, update context/state, etc.
    navigate('/')
  }


  return (
    <nav className="w-full overflow-x-hidden md:hidden bg-sidebar border-b border-sidebar-border shadow-sm">
      <div className="w-full px-4">
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
            
            <Button 
              onClick={handleLogout}
              variant="outline" size="sm">
              Sair
            </Button>
          </div>
          {/* Navigation Items */}
          
        </div>
        <div className="flex mb-1 items-center justify-evenly">
            {items.map((item) => (
                  <NavbarItem key={item.path} {...item} />
            ))}
          </div> 
      </div>
    </nav>
  );
};

export default Navbar;
