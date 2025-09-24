import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
} from "lucide-react"; // Icônes Lucide

interface Notification {
  id: number;
  type: "warning" | "info" | "success" | "default";
  message: string;
  time: string;
  read: boolean;
}

const Notifications: React.FC = () => {
  const [alerts, setAlerts] = useState<Notification[]>([
    {
      id: 1,
      type: "warning",
      message: "Votre abonnement arrive bientôt à expiration.",
      time: "5 min",
      read: false,
    },
    {
      id: 2,
      type: "info",
      message: "Nouvelle mise à jour disponible.",
      time: "30 min",
      read: true,
    },
    {
      id: 3,
      type: "success",
      message: "Paiement reçu avec succès.",
      time: "1 h",
      read: false,
    },
    {
      id: 4,
      type: "default",
      message: "Vous avez 3 nouvelles notifications.",
      time: "2 h",
      read: false,
    },
  ]);

  // Couleurs selon le type
  const getAlertColor = (type: string, read: boolean) => {
    const base = read ? "opacity-60" : "";
    switch (type) {
      case "warning":
        return bg-orange-50 border-orange-200 text-orange-800 ${base};
      case "info":
        return bg-blue-50 border-blue-200 text-blue-800 ${base};
      case "success":
        return bg-green-50 border-green-200 text-green-800 ${base};
      default:
        return bg-gray-50 border-gray-200 text-gray-800 ${base};
    }
  };

  // Icônes selon le type
  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return AlertTriangle;
      case "info":
        return Info;
      case "success":
        return CheckCircle;
      default:
        return Bell;
    }
  };

  // Marquer comme lue
  const markAsRead = (id: number) => {
    setAlerts((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Supprimer
  const deleteNotification = (id: number) => {
    setAlerts((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Alertes & Notifications
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">
            {alerts.filter((a) => !a.read).length} non lues
          </span>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alerts.map((alert) => {
          const Icon = getIcon(alert.type);
          return (
            <div
              key={alert.id}
              className={`relative p-4 rounded-xl border ${getAlertColor(
                alert.type,
                alert.read
              )} hover:shadow-md transition-all duration-300`}
            >
              {/* Bouton supprimer */}
              <button
                onClick={() => deleteNotification(alert.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
              >
                <XCircle className="h-5 w-5" />
              </button>

              <div
                className="flex items-start cursor-pointer"
                onClick={() => markAsRead(alert.id)}
              >
                <Icon className="h-5 w-5 mr-3 mt-0.5" />
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      alert.read ? "line-through" : ""
                    }`}
                  >
                    {alert.message}
                  </p>
                  <p className="text-xs opacity-75 mt-1">Il y a {alert.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notifications;
