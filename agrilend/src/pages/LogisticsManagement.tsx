import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  User,
  Calendar,
  Navigation,
  Building2,
  Phone,
  Mail,
} from "lucide-react";
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import { ManagementPage } from "../components/ManagementPage";
import Modal from "../components/Modal";
import ModalForm from "../components/ModalForm";
import FormField from "../components/FormField";
import DataTable from "../components/DataTable";
import { Delivery, LogisticsPartner } from "../types";

// Composant spécialisé pour les actions de livraison
interface DeliveryActionsProps {
  delivery: Delivery;
  onStart: (delivery: Delivery) => void;
  onComplete: (delivery: Delivery) => void;
  onCancel: (delivery: Delivery) => void;
}

const DeliveryActions: React.FC<DeliveryActionsProps> = ({
  delivery,
  onStart,
  onComplete,
  onCancel,
}) => {
  const getStatusColor = (status: Delivery["status"]) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "IN_TRANSIT":
        return "bg-orange-100 text-orange-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      case "PICKED_UP":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Détails de la livraison
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Package className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Produit:</span>
                <span className="ml-2">{delivery.product}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Quantité:</span>
                <span>{delivery.quantity} kg</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Statut:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    delivery.status
                  )}`}
                >
                  {delivery.status.charAt(0).toUpperCase() +
                    delivery.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Informations</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Chauffeur:</span>
                <span className="ml-2">{delivery.driver}</span>
              </div>
              <div className="flex items-center">
                <Truck className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Véhicule:</span>
                <span className="ml-2">{delivery.vehicle}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Programmée:</span>
                <span className="ml-2">{delivery.scheduledDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {delivery.status === "SCHEDULED" && (
          <button
            onClick={() => onStart(delivery)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Démarrer
          </button>
        )}

        {delivery.status === "IN_TRANSIT" && (
          <button
            onClick={() => onComplete(delivery)}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Marquer livré
          </button>
        )}

        {delivery.status !== "DELIVERED" && delivery.status !== "FAILED" && (
          <button
            onClick={() => onCancel(delivery)}
            className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Annuler
          </button>
        )}
      </div>
    </div>
  );
};

// Composant spécialisé pour les actions de partenaire
interface PartnerActionsProps {
  partner: LogisticsPartner;
  onActivate: (partner: LogisticsPartner) => void;
}

const PartnerActions: React.FC<PartnerActionsProps> = ({
  partner,
  onActivate,
}) => {
  const getStatusColor = (status: LogisticsPartner["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Informations de l'entreprise
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Building2 className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Nom:</span>
                <span className="ml-2">{partner.name}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Contact:</span>
                <span className="ml-2">{partner.contactPerson}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Statut:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    partner.status
                  )}`}
                >
                  {partner.status.charAt(0).toUpperCase() +
                    partner.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Phone className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Téléphone:</span>
                <span className="ml-2">{partner.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Email:</span>
                <span className="ml-2">{partner.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onActivate(partner)}
          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Activer
        </button>
      </div>
    </div>
  );
};

// Configuration pour la page de gestion logistique optimisée
const LogisticsManagementOptimized: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"deliveries" | "partners">(
    "deliveries"
  );

  // États pour les modals de livraison
  const [showStartModal, setShowStartModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );

  // États pour les modals de partenaire
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [selectedPartner, setSelectedPartner] =
    useState<LogisticsPartner | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [deliveries, setDeliveries] = useState<Delivery[]>([]); // State to hold fetched deliveries
  const [partners, setPartners] = useState<LogisticsPartner[]>([]); // State to hold fetched partners

  // Function to simulate fetching deliveries from an API
  const fetchDeliveries = async () => {
    setIsLoading(true);
    // In a real application, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const fetchedDeliveries: Delivery[] = [
      {
        id: 1,
        orderId: 1001,
        product: "Tomates",
        farmer: "Jean Kouassi",
        buyer: "Restaurant Le Gourmet",
        quantity: 50,
        pickupLocation: "Ferme Kouassi, Abidjan",
        deliveryLocation: "Restaurant Le Gourmet, Plateau",
        scheduledDate: "2024-09-22",
        driver: "Moussa Traoré",
        vehicle: "Camion réfrigéré #TR001",
        status: "SCHEDULED",
        estimatedDuration: 2,
        distance: 15,
        cost: 25000,
        notes: "Livraison urgente",
        trackingId: "LIV001",
        createdAt: "2024-09-20",
      },
      {
        id: 2,
        orderId: 1002,
        product: "Mangues",
        farmer: "Fatou Keita",
        buyer: "Supermarché Fraîcheur",
        quantity: 100,
        pickupLocation: "Plantation Keita, Bouaké",
        deliveryLocation: "Supermarché Fraîcheur, Cocody",
        scheduledDate: "2024-09-23",
        driver: "Ibrahim Diabaté",
        vehicle: "Camion #TR002",
        status: "IN_TRANSIT",
        estimatedDuration: 3,
        distance: 25,
        cost: 40000,
        notes: "Produits fragiles",
        trackingId: "LIV002",
        createdAt: "2024-09-21",
      },
    ];
    setDeliveries(fetchedDeliveries);
    setIsLoading(false);
  };

  // Function to simulate fetching logistics partners from an API
  const fetchPartners = async () => {
    setIsLoading(true);
    // In a real application, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const fetchedPartners: LogisticsPartner[] = [
      {
        id: 1,
        name: "Transport Express CI",
        contactPerson: "Yves Kouamé",
        phone: "+225 07 11 22 33",
        email: "contact@transportexpress.ci",
        address: "Zone Industrielle, Abidjan",
        services: ["transport", "cold-storage"],
        status: "active",
        rating: 4.5,
        completedDeliveries: 150,
        coverageAreas: ["Abidjan", "Bouaké", "Yamoussoukro"],
        vehicles: 12,
        certifications: ["ISO 9001", "HACCP"],
      },
      {
        id: 2,
        name: "Logistique Premium",
        contactPerson: "Aminata Diallo",
        phone: "+225 05 44 55 66",
        email: "info@logistiquepremium.com",
        address: "Port d'Abidjan",
        services: ["warehouse", "packaging"],
        status: "active",
        rating: 4.8,
        completedDeliveries: 200,
        coverageAreas: ["Abidjan", "San-Pédro"],
        vehicles: 20,
        certifications: ["ISO 14001"],
      },
    ];
    setPartners(fetchedPartners);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDeliveries();
    fetchPartners();
  }, []); // Fetch data on component mount

  // Handlers pour les actions de livraison
  const handleStart = useCallback((delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowStartModal(true);
  }, []);

  const handleComplete = useCallback((delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowCompleteModal(true);
  }, []);

  const handleCancel = useCallback((delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setShowCancelModal(true);
  }, []);

  // Handlers pour les actions de partenaire
  const handlePartnerView = useCallback((partner: LogisticsPartner) => {
    setSelectedPartner(partner);
    setShowPartnerModal(true);
  }, []);

  const handlePartnerActivate = useCallback((partner: LogisticsPartner) => {
    setSelectedPartner(partner);
    setShowPartnerModal(true);
  }, []);

  // Configuration des colonnes pour les livraisons
  const deliveryColumns = useMemo(() => {
    return [
      {
        accessorKey: "orderId",
        header: "Commande",
        cell: ({ row }: { row: { original: Delivery } }) => (
          <div className="flex items-center">
            <Package className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <div className="font-medium">#{row.original.orderId}</div>
              <div className="text-sm text-gray-500">
                {row.original.product}
              </div>
            </div>
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "farmer",
        header: "Agriculteur",
        cell: ({ row }: { row: { original: Delivery } }) => (
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-500 mr-2" />
            {row.original.farmer}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "buyer",
        header: "Acheteur",
        cell: ({ row }: { row: { original: Delivery } }) => (
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-500 mr-2" />
            {row.original.buyer}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "driver",
        header: "Chauffeur",
        cell: ({ row }: { row: { original: Delivery } }) => (
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-500 mr-2" />
            {row.original.driver}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }: { row: { original: Delivery } }) => {
          const status = row.original.status;
          const colors = {
            SCHEDULED: "bg-blue-100 text-blue-800",
            PICKED_UP: "bg-purple-100 text-purple-800",
            IN_TRANSIT: "bg-orange-100 text-orange-800",
            DELIVERED: "bg-green-100 text-green-800",
            FAILED: "bg-red-100 text-red-800",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                colors[status as keyof typeof colors]
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "scheduledDate",
        header: "Date prévue",
        cell: ({ row }: { row: { original: Delivery } }) => (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            {row.original.scheduledDate}
          </div>
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: { original: Delivery } }) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleStart(row.original)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckCircle className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleComplete(row.original)}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Package className="h-5 w-5" />
            </button>
          </div>
        ),
      },
    ];
  }, [handleStart, handleComplete]);

  // Configuration des colonnes pour les partenaires
  const partnerColumns = useMemo(() => {
    const columnHelper = createColumnHelper<LogisticsPartner>();
    return [
      columnHelper.accessor("name", {
        header: "Nom",
        cell: (info) => (
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <div className="font-medium">{info.getValue()}</div>
              <div className="text-sm text-gray-500">
                {info.row.original.contactPerson}
              </div>
            </div>
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("services", {
        header: "Services",
        cell: (info) => {
          const services = info.getValue();
          const serviceColors = {
            transport: "bg-blue-100 text-blue-800",
            warehouse: "bg-green-100 text-green-800",
            "cold-storage": "bg-purple-100 text-purple-800",
            packaging: "bg-yellow-100 text-yellow-800",
          };
          return (
            <div className="flex flex-wrap gap-1">
              {services.map((service: string, index: number) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    serviceColors[service as keyof typeof serviceColors] ||
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {service}
                </span>
              ))}
            </div>
          );
        },
        enableSorting: false,
      }),
      columnHelper.accessor("status", {
        header: "Statut",
        cell: (info) => {
          const status = info.getValue();
          const colors = {
            active: "bg-green-100 text-green-800",
            inactive: "bg-gray-100 text-gray-800",
            suspended: "bg-red-100 text-red-800",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                colors[status as keyof typeof colors]
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor("rating", {
        header: "Note",
        cell: (info) => (
          <div className="flex items-center">
            <span className="font-medium">{info.getValue()}</span>
            <span className="text-yellow-400 ml-1">★</span>
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("completedDeliveries", {
        header: "Livraisons",
        cell: (info) => info.getValue(),
        enableSorting: true,
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePartnerView(row.original)}
              className="text-blue-600 hover:text-blue-900 transition-colors"
              title="Voir les détails"
            >
              <User className="h-5 w-5" />
            </button>
            <button
              onClick={() => handlePartnerActivate(row.original)}
              className="text-green-600 hover:text-green-900 transition-colors"
              title="Activer le partenaire"
            >
              <CheckCircle className="h-5 w-5" />
            </button>
          </div>
        ),
      }),
    ];
  }, [handlePartnerView, handlePartnerActivate]);

  // Configuration des champs du formulaire pour les livraisons
  const deliveryFormFields = useMemo(
    () => [
      {
        name: "orderId",
        label: "ID Commande",
        type: "number" as const,
        placeholder: "123",
        required: true,
        min: 1,
      },
      {
        name: "product",
        label: "Produit",
        type: "text" as const,
        placeholder: "Tomates",
        required: true,
      },
      {
        name: "farmer",
        label: "Agriculteur",
        type: "text" as const,
        placeholder: "Jean Kouassi",
        required: true,
      },
      {
        name: "buyer",
        label: "Acheteur",
        type: "text" as const,
        placeholder: "Restaurant Le Gourmet",
        required: true,
      },
      {
        name: "quantity",
        label: "Quantité (kg)",
        type: "number" as const,
        placeholder: "50",
        required: true,
        min: 1,
      },
      {
        name: "pickupLocation",
        label: "Lieu de ramassage",
        type: "text" as const,
        placeholder: "Ferme Kouassi, Abidjan",
        required: true,
      },
      {
        name: "deliveryLocation",
        label: "Lieu de livraison",
        type: "text" as const,
        placeholder: "Restaurant Le Gourmet, Plateau",
        required: true,
      },
      {
        name: "scheduledDate",
        label: "Date prévue",
        type: "date" as const,
        required: true,
      },
      {
        name: "driver",
        label: "Chauffeur",
        type: "text" as const,
        placeholder: "Moussa Traoré",
        required: true,
      },
      {
        name: "vehicle",
        label: "Véhicule",
        type: "text" as const,
        placeholder: "Camion réfrigéré #TR001",
        required: true,
      },
      {
        name: "estimatedDuration",
        label: "Durée estimée (heures)",
        type: "number" as const,
        placeholder: "2",
        required: true,
        min: 1,
      },
      {
        name: "distance",
        label: "Distance (km)",
        type: "number" as const,
        placeholder: "15",
        required: true,
        min: 1,
      },
      {
        name: "cost",
        label: "Coût (FCFA)",
        type: "number" as const,
        placeholder: "25000",
        required: true,
        min: 1,
      },
      {
        name: "notes",
        label: "Notes",
        type: "textarea" as const,
        placeholder: "Notes sur la livraison...",
        rows: 3,
      },
    ],
    []
  );

  // Configuration des champs de visualisation pour les livraisons
  const deliveryViewFields = useMemo(
    () => [
      { key: "orderId", label: "ID Commande" },
      { key: "product", label: "Produit" },
      { key: "farmer", label: "Agriculteur" },
      { key: "buyer", label: "Acheteur" },
      { key: "quantity", label: "Quantité" },
      { key: "pickupLocation", label: "Lieu de ramassage" },
      { key: "deliveryLocation", label: "Lieu de livraison" },
      { key: "scheduledDate", label: "Date prévue" },
      { key: "driver", label: "Chauffeur" },
      { key: "vehicle", label: "Véhicule" },
      { key: "status", label: "Statut" },
      { key: "estimatedDuration", label: "Durée estimée" },
      { key: "distance", label: "Distance" },
      { key: "cost", label: "Coût" },
      { key: "notes", label: "Notes" },
      { key: "createdAt", label: "Date de création" },
      { key: "deliveredAt", label: "Date de livraison" },
      { key: "trackingId", label: "ID de suivi" },
    ],
    []
  );

  // Configuration par défaut du formulaire pour les livraisons
  const defaultDeliveryFormData = useMemo(
    () => ({
      orderId: 0,
      product: "",
      farmer: "",
      buyer: "",
      quantity: 0,
      pickupLocation: "",
      deliveryLocation: "",
      scheduledDate: "",
      driver: "",
      vehicle: "",
      estimatedDuration: 0,
      distance: 0,
      cost: 0,
      notes: "",
      status: "SCHEDULED" as const,
      createdAt: new Date().toISOString().split("T")[0],
    }),
    []
  );

  // Règles de validation pour les livraisons
  const deliveryValidationRules = useMemo(
    () => ({
      orderId: (value: unknown) => {
        const num = Number(value);
        if (!num || num < 1)
          return "L'ID de commande doit être un nombre positif";
        return null;
      },
      product: (value: unknown) => {
        const str = String(value);
        if (!str.trim()) return "Le produit est requis";
        if (str.length < 2)
          return "Le produit doit contenir au moins 2 caractères";
        return null;
      },
      farmer: (value: unknown) => {
        const str = String(value);
        if (!str.trim()) return "L'agriculteur est requis";
        if (str.length < 2)
          return "L'agriculteur doit contenir au moins 2 caractères";
        return null;
      },
      buyer: (value: unknown) => {
        const str = String(value);
        if (!str.trim()) return "L'acheteur est requis";
        if (str.length < 2)
          return "L'acheteur doit contenir au moins 2 caractères";
        return null;
      },
      quantity: (value: unknown) => {
        const num = Number(value);
        if (!num || num < 1) return "La quantité doit être un nombre positif";
        return null;
      },
      pickupLocation: (value: unknown) => {
        const str = String(value);
        if (!str.trim()) return "Le lieu de ramassage est requis";
        if (str.length < 3)
          return "Le lieu de ramassage doit contenir au moins 3 caractères";
        return null;
      },
      deliveryLocation: (value: unknown) => {
        const str = String(value);
        if (!str.trim()) return "Le lieu de livraison est requis";
        if (str.length < 3)
          return "Le lieu de livraison doit contenir au moins 3 caractères";
        return null;
      },
      scheduledDate: (value: unknown) => {
        if (!value) return "La date prévue est requise";
        return null;
      },
      driver: (value: unknown) => {
        const str = String(value);
        if (!str.trim()) return "Le chauffeur est requis";
        if (str.length < 2)
          return "Le chauffeur doit contenir au moins 2 caractères";
        return null;
      },
      vehicle: (value: unknown) => {
        const str = String(value);
        if (!str.trim()) return "Le véhicule est requis";
        if (str.length < 2)
          return "Le véhicule doit contenir au moins 2 caractères";
        return null;
      },
      estimatedDuration: (value: unknown) => {
        const num = Number(value);
        if (!num || num < 1)
          return "La durée estimée doit être un nombre positif";
        return null;
      },
      distance: (value: unknown) => {
        const num = Number(value);
        if (!num || num < 1) return "La distance doit être un nombre positif";
        return null;
      },
      cost: (value: unknown) => {
        const num = Number(value);
        if (!num || num < 1) return "Le coût doit être un nombre positif";
        return null;
      },
    }),
    []
  );

  // Statistiques pour les livraisons
  const deliveryStats = useMemo(
    () => [
      {
        label: "Total Livraisons",
        value: deliveries.length,
        icon: Truck,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        label: "Programmées",
        value: deliveries.filter((d) => d.status === "SCHEDULED").length,
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      },
      {
        label: "En Transit",
        value: deliveries.filter((d) => d.status === "IN_TRANSIT").length,
        icon: Navigation,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
      },
      {
        label: "Livrées",
        value: deliveries.filter((d) => d.status === "DELIVERED").length,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
    ],
    [deliveries]
  );

  // Statistiques pour les partenaires
  const partnerStats = useMemo(
    () => [
      {
        label: "Total Partenaires",
        value: partners.length,
        icon: Building2,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        label: "Actifs",
        value: partners.filter((p) => p.status === "active").length,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      {
        label: "Inactifs",
        value: partners.filter((p) => p.status === "inactive").length,
        icon: Clock,
        color: "text-gray-600",
        bgColor: "bg-gray-100",
      },
      {
        label: "Suspendus",
        value: partners.filter((p) => p.status === "suspended").length,
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-100",
      },
    ],
    [partners]
  );

  // Handlers pour les soumissions de formulaires
  const handleStartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to start delivery
      // Example: await fetch(`/api/deliveries/${selectedDelivery?.id}/start`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ startComment: e.target.startComment.value }),
      // });
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Starting delivery:", selectedDelivery);
      alert("Livraison démarrée avec succès !");
      setShowStartModal(false);
      setSelectedDelivery(null);
      fetchDeliveries(); // Refresh deliveries list
    } catch (error) {
      console.error("Error starting delivery:", error);
      alert("Erreur lors du démarrage de la livraison.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to complete delivery
      // Example: await fetch(`/api/deliveries/${selectedDelivery?.id}/complete`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ deliveryComment: e.target.deliveryComment.value, deliveryTime: e.target.deliveryTime.value }),
      // });
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Completing delivery:", selectedDelivery);
      alert("Livraison marquée comme livrée avec succès !");
      setShowCompleteModal(false);
      setSelectedDelivery(null);
      fetchDeliveries(); // Refresh deliveries list
    } catch (error) {
      console.error("Error completing delivery:", error);
      alert("Erreur lors de la finalisation de la livraison.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to cancel delivery
      // Example: await fetch(`/api/deliveries/${selectedDelivery?.id}/cancel`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ cancellationReason: e.target.cancellationReason.value, cancellationComment: e.target.cancellationComment.value }),
      // });
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Cancelling delivery:", selectedDelivery);
      alert("Livraison annulée avec succès !");
      setShowCancelModal(false);
      setSelectedDelivery(null);
      fetchDeliveries(); // Refresh deliveries list
    } catch (error) {
      console.error("Error cancelling delivery:", error);
      alert("Erreur lors de l'annulation de la livraison.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call for partner action (e.g., activate, update)
      // Example: await fetch(`/api/logistics-partners/${selectedPartner?.id}/activate`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ partnerComment: e.target.partnerComment.value }),
      // });
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Partner action:", selectedPartner);
      alert("Action partenaire effectuée avec succès !");
      setShowPartnerModal(false);
      setSelectedPartner(null);
      fetchPartners(); // Refresh partners list
    } catch (error) {
      console.error("Error performing partner action:", error);
      alert("Erreur lors de l'action partenaire.");
    } finally {
      setIsLoading(false);
    }
  };

  // Configuration pour les livraisons
  const deliveryConfig = useMemo(() => {
    return {
      title: "Gestion Logistique",
      description:
        "Gérez les livraisons et les partenaires logistiques pour optimiser la chaîne d'approvisionnement",
      icon: Truck,
      stats: deliveryStats,
      formFields: deliveryFormFields,
      viewFields: deliveryViewFields,
      columns: () => deliveryColumns as ColumnDef<Delivery, unknown>[],
      defaultFormData: defaultDeliveryFormData,
      validationRules: deliveryValidationRules,
    };
  }, [
    deliveryStats,
    deliveryFormFields,
    deliveryViewFields,
    deliveryColumns,
    defaultDeliveryFormData,
    deliveryValidationRules,
  ]);

  return (
    <>
      {/* Onglets */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("deliveries")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "deliveries"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Livraisons
              </div>
            </button>
            <button
              onClick={() => setActiveTab("partners")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "partners"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Partenaires Transporteurs
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === "deliveries" && (
        <ManagementPage<Delivery> config={deliveryConfig} data={deliveries} />
      )}

      {activeTab === "partners" && (
        <div className="space-y-6">
          {/* Statistiques des partenaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerStats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
              >
                <div className="flex items-center">
                  <div className={`${stat.bgColor} rounded-lg p-3`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tableau des partenaires */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Partenaires Transporteurs
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Gérez vos partenaires logistiques
              </p>
            </div>
            <div className="p-6">
              <DataTable
                data={partners}
                columns={
                  partnerColumns as ColumnDef<LogisticsPartner, unknown>[]
                }
                searchPlaceholder="Rechercher un partenaire..."
                showPagination={true}
                pageSize={10}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de démarrage de livraison */}
      <Modal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        title="Démarrer une Livraison"
        size="md"
      >
        {selectedDelivery && (
          <DeliveryActions
            delivery={selectedDelivery}
            onStart={handleStart}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        )}

        <ModalForm
          onSubmit={handleStartSubmit}
          onCancel={() => setShowStartModal(false)}
          submitText="Démarrer"
          isLoading={isLoading}
        >
          <FormField
            label="Commentaire de démarrage"
            name="startComment"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Commentaire sur le démarrage..."
            rows={3}
          />
        </ModalForm>
      </Modal>

      {/* Modal de fin de livraison */}
      <Modal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        title="Marquer comme Livré"
        size="md"
      >
        {selectedDelivery && (
          <DeliveryActions
            delivery={selectedDelivery}
            onStart={handleStart}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        )}

        <ModalForm
          onSubmit={handleCompleteSubmit}
          onCancel={() => setShowCompleteModal(false)}
          submitText="Marquer livré"
          isLoading={isLoading}
        >
          <FormField
            label="Commentaire de livraison"
            name="deliveryComment"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Commentaire sur la livraison..."
            required
            rows={3}
          />
          <FormField
            label="Heure de livraison"
            name="deliveryTime"
            type="text"
            value=""
            onChange={() => {}}
            placeholder="14:30"
            required
          />
        </ModalForm>
      </Modal>

      {/* Modal d'annulation de livraison */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Annuler une Livraison"
        size="md"
      >
        {selectedDelivery && (
          <DeliveryActions
            delivery={selectedDelivery}
            onStart={handleStart}
            onComplete={handleComplete}
            onCancel={handleCancel}
          />
        )}

        <ModalForm
          onSubmit={handleCancelSubmit}
          onCancel={() => setShowCancelModal(false)}
          submitText="Annuler"
          isLoading={isLoading}
          submitVariant="danger"
        >
          <FormField
            label="Raison de l'annulation"
            name="cancellationReason"
            type="select"
            value=""
            onChange={() => {}}
            required
            options={[
              { value: "weather", label: "Conditions météorologiques" },
              { value: "vehicle-issue", label: "Problème de véhicule" },
              { value: "driver-unavailable", label: "Chauffeur indisponible" },
              { value: "customer-request", label: "Demande du client" },
              { value: "other", label: "Autre" },
            ]}
          />
          <FormField
            label="Commentaire"
            name="cancellationComment"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Détails de l'annulation..."
            required
            rows={3}
          />
        </ModalForm>
      </Modal>

      {/* Modal des partenaires */}
      <Modal
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
        title="Gérer un Partenaire"
        size="md"
      >
        {selectedPartner && (
          <PartnerActions
            partner={selectedPartner}
            onActivate={handlePartnerActivate}
          />
        )}

        <ModalForm
          onSubmit={handlePartnerSubmit}
          onCancel={() => setShowPartnerModal(false)}
          submitText="Confirmer"
          isLoading={isLoading}
        >
          <FormField
            label="Commentaire sur l'action"
            name="partnerComment"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Commentaire sur l'action..."
            rows={3}
          />
        </ModalForm>
      </Modal>
    </>
  );
};

export default LogisticsManagementOptimized;
