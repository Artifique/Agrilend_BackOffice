import logoAagri from "../assets/logo-aagri.png";
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  ShoppingCart,
  DollarSign,
  Truck,
  AlertTriangle,
  Settings,
  Package,
  FileText,
} from "lucide-react";

interface NavigationItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavigationItem[] = [
  { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
  { name: "Gestion Utilisateurs", path: "/users", icon: Users },
  { name: "Validation Produits", path: "/products-validation", icon: Package },
  { name: "Commandes & Offres", path: "/orders", icon: ShoppingCart },
  { name: "Gestion Financière", path: "/financial", icon: DollarSign },
  { name: "Logistique", path: "/logistics", icon: Truck },
  { name: "Gestion Litiges", path: "/disputes", icon: AlertTriangle },
  { name: "Rapports & Stats", path: "/reports", icon: FileText },
  { name: "Paramètres", path: "/parameters", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="bg-white w-80 shadow-2xl border-r border-gray-200 flex flex-col">
      {/* Logo Section - Taille équilibrée */}
      <div className="flex flex-col items-center justify-center h-32 px-6 border-b border-gray-200 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
        {/* Effet de fond subtil */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-3 left-4 w-10 h-10 bg-blue-600 rounded-full"></div>
          <div className="absolute top-6 right-6 w-8 h-8 bg-green-600 rounded-full"></div>
          <div className="absolute bottom-3 left-6 w-8 h-8 bg-blue-500 rounded-full"></div>
          <div className="absolute bottom-2 right-4 w-6 h-6 bg-green-500 rounded-full"></div>
        </div>

        {/* Logo principal - Taille réduite et bordure + gestion d'erreur */}
        <div className="relative z-10 flex flex-col items-center">
          <img
            src={logoAagri}
            alt="Agrilent Logo"
            className="h-20 w-20 object-contain rounded-full border-4 border-blue-500 shadow-lg bg-white"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const errorMsg = document.createElement("div");
              errorMsg.textContent = "Logo introuvable";
              errorMsg.style.color = "#ef4444";
              errorMsg.style.fontWeight = "bold";
              errorMsg.style.marginTop = "16px";
              e.currentTarget.parentElement?.appendChild(errorMsg);
            }}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5">
        <div className="space-y-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive: isNavLinkActive }) =>
                  `relative w-full flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-300 group ${
                    isNavLinkActive
                      ? "bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] text-white shadow-lg transform scale-[1.01] hover:scale-[1.02]"
                      : "text-gray-700 hover:text-[#1E90FF] hover:bg-gradient-to-r hover:from-[#4CAF50]/5 hover:to-[#1E90FF]/5"
                  }`
                }
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 transition-all duration-300 ${
                    isActive
                      ? "bg-white/20 text-[#1E90FF] shadow-md"
                      : "bg-gray-100 text-gray-500 group-hover:bg-[#1E90FF]/10 group-hover:text-[#1E90FF]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span>{item.name}</span>
                {isActive && (
                  <span className="absolute right-4 h-2.5 w-2.5 bg-white rounded-full animate-pulse"></span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
