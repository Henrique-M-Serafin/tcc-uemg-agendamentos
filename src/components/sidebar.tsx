// Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

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
      className={` px-4 py-2 flex gap-2 font-semibold rounded-md mb-2 hover:bg-blue-100 ${
        isActive ? "bg-blue-200" : ""
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
  return (
    <aside className="w-64 bg-background max-h-screen flex flex-col justify-between p-4 shadow-md">
    <div className="flex-1">
      <h2 className="text-xl font-bold mb-4">Menu</h2>
        {items.map((item) => (
            <SidebarItem key={item.path} {...item} />
        ))}
    </div>
    <div className="mt-4">
        
        <Button variant="outline" className="w-full">
            Sair
        </Button>
    </div>
    </aside>

  );
};

export default Sidebar;
