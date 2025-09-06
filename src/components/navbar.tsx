import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
  label: string;
  path: string;
}

interface NavbarProps {
  items: NavItemProps[];
}

const Navbar: React.FC<NavbarProps> = ({ items }) => {
  const location = useLocation();

  return (
    <nav className="bg-background shadow-md px-6 py-4 flex justify-between items-center">
      <div className="text-xl text-accent font-bold ">Laboratórios UEMG</div>
      <ul className="flex gap-4">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`px-3 py-2 font-semibold rounded-md hover:bg-blue-100 ${
                  isActive ? "bg-blue-200" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
