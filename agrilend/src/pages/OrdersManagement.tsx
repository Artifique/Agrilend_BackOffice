import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  ShoppingCart,
  User,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  AlertTriangle,
  MapPin,
  Eye,
  Shield,
} from "lucide-react";
// import DataTable from "../components/DataTable"; // Not used
import Modal from "../components/Modal";
import ModalForm from "../components/ModalForm";
import FormField from "../components/FormField";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "../types";
import { Button, Badge } from "../components/ui";
import { ManagementPage } from "../components/ManagementPage";
// Fonction utilitaire globale pour le statut
function getStatusColor(status: Order["status"]): string {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "IN_ESCROW":
      return "bg-blue-100 text-blue-800";
    case "RELEASED":
      return "bg-green-100 text-green-800";
    case "IN_DELIVERY":
      return "bg-orange-100 text-orange-800";
    case "DELIVERED":
      return "bg-green-100 text-green-800";
    case "CANCELLED":
      return "bg-red-100 text-red-800";
    case "DISPUTED":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

// Composant spécialisé pour les actions de commande
interface OrderActionsProps {
  order: Order;
  onApprove: (order: Order) => void;
  onReject: (order: Order) => void;
  onProcessPayment: (order: Order) => void;
  onTrackDelivery: (order: Order) => void;
  onCancel: (order: Order) => void;
}

const OrderActions: React.FC<OrderActionsProps> = ({
  order,
  onApprove,
  onReject,
  onProcessPayment,
  onTrackDelivery,
  onCancel,
}) => {
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "IN_ESCROW":
        return "bg-blue-100 text-blue-800";
      case "RELEASED":
        return "bg-green-100 text-green-800";
      case "IN_DELIVERY":
        return "bg-orange-100 text-orange-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "DISPUTED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Informations de la commande */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Informations Générales
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium w-20">Produit:</span>
                <span className="ml-2">{order.productName}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Quantité:</span>
                <span>
                  {order.quantity} {order.unitPrice}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Statut:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.replace("_", " ").charAt(0).toUpperCase() +
                    order.status.replace("_", " ").slice(1)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Détails</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Agriculteur:</span>
                <span className="ml-2">{order.farmerName}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Acheteur:</span>
                <span className="ml-2">{order.buyerName}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Total:</span>
                <span className="ml-2 font-semibold">
                  {order.totalPrice.toLocaleString()} FCFA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions disponibles */}
      <div className="flex flex-wrap gap-2">
        {order.status === "PENDING" && (
          <>
            <button
              onClick={() => onApprove(order)}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approuver
            </button>
            <button
              onClick={() => onReject(order)}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
            </button>
          </>
        )}

        {order.status === "IN_ESCROW" && (
          <button
            onClick={() => onProcessPayment(order)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Traiter Paiement
          </button>
        )}

        {order.status === "IN_DELIVERY" && (
          <button
            onClick={() => onTrackDelivery(order)}
            className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Truck className="h-4 w-4 mr-2" />
            Suivre Livraison
          </button>
        )}

        {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
          <button
            onClick={() => onCancel(order)}
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Annuler Commande
          </button>
        )}
      </div>
    </div>
  );
};

// Configuration pour la page de gestion des commandes optimisée
const OrdersManagementOptimized: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]); // State to hold fetched orders
  // Suppression des variables inutilisées searchTerm et statusFilter
  // Pagination non utilisée, supprimée
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to simulate fetching orders from an API
  const fetchOrders = async () => {
    setIsLoading(true);
    // In a real application, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const fetchedOrders: Order[] = [
      {
        id: 1,
        buyerId: 101,
        offerId: 201,
        orderNumber: "ORD001",
        productName: "Tomates fraîches",
        description: "Tomates de saison, cultivées localement",
        farmerName: "Jean Kouassi",
        buyerName: "Restaurant Le Gourmet",
        quantity: 50,
        unitPrice: 800,
        totalPrice: 40000,
        platformFee: 2000,
        status: "PENDING",
        createdAt: "2024-09-20T10:00:00Z",
        productCategory: "vegetables",
        deliveryAddress: "123 Rue du Commerce, Abidjan",
        expectedDeliveryDate: "2024-09-25T00:00:00Z",
      },
      {
        id: 2,
        buyerId: 102,
        offerId: 202,
        orderNumber: "ORD002",
        productName: "Mangues Kent",
        description: "Mangues sucrées et juteuses",
        farmerName: "Fatou Keita",
        buyerName: "Supermarché Fraîcheur",
        quantity: 100,
        unitPrice: 500,
        totalPrice: 50000,
        platformFee: 2500,
        status: "IN_ESCROW",
        createdAt: "2024-09-18T14:30:00Z",
        escrowStartDate: "2024-09-18T15:00:00Z",
        escrowEndDate: "2024-09-23T15:00:00Z",
        productCategory: "fruits",
        deliveryAddress: "456 Avenue de la République, Cocody",
        expectedDeliveryDate: "2024-09-22T00:00:00Z",
      },
      {
        id: 3,
        buyerId: 103,
        offerId: 203,
        orderNumber: "ORD003",
        productName: "Riz Basmati",
        description: "Riz parfumé de qualité supérieure",
        farmerName: "Ibrahim Traoré",
        buyerName: "Grossiste Céréales",
        quantity: 200,
        unitPrice: 1000,
        totalPrice: 200000,
        platformFee: 10000,
        status: "DELIVERED",
        createdAt: "2024-09-15T09:00:00Z",
        actualDeliveryDate: "2024-09-17T11:00:00Z",
        productCategory: "grains",
        deliveryAddress: "789 Boulevard de l'Industrie, Yopougon",
        expectedDeliveryDate: "2024-09-17T00:00:00Z",
      },
      {
        id: 4,
        buyerId: 104,
        offerId: 204,
        orderNumber: "ORD004",
        productName: "Poulets de chair",
        description: "Poulets élevés en plein air",
        farmerName: "Aisha Diallo",
        buyerName: "Hôtel Ivoire",
        quantity: 30,
        unitPrice: 3500,
        totalPrice: 105000,
        platformFee: 5250,
        status: "CANCELLED",
        createdAt: "2024-09-10T11:00:00Z",
        cancellationReason: "Rupture de stock",
        cancelledAt: "2024-09-10T12:00:00Z",
        productCategory: "livestock",
        deliveryAddress: "Hôtel Ivoire, Cocody",
        expectedDeliveryDate: "2024-09-13T00:00:00Z",
      },
    ];
    setOrders(fetchedOrders);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []); // Fetch orders on component mount

  const handleView = useCallback((order: Order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  }, []);

  // Handlers pour les actions spécialisées
  const handleApprove = useCallback((order: Order) => {
    setSelectedOrder(order);
    setShowApproveModal(true);
  }, []);

  const handleReject = useCallback((order: Order) => {
    setSelectedOrder(order);
    setShowRejectModal(true);
  }, []);

  const handleProcessPayment = useCallback((order: Order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  }, []);

  const handleTrackDelivery = useCallback((order: Order) => {
    setSelectedOrder(order);
    setShowTrackModal(true);
  }, []);

  const handleCancel = useCallback((order: Order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  }, []);

  // Configuration des colonnes
  const columns = useMemo<ColumnDef<Order, unknown>[]>(
    () => [
      {
        accessorKey: "orderNumber",
        header: "Commande",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <div className="font-medium">{row.original.orderNumber}</div>
              <div className="text-sm text-gray-500">
                {row.original.productName}
              </div>
            </div>
          </div>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "farmerName",
        header: "Agriculteur",
        cell: ({ row }) => (
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-500 mr-2" />
            {row.original.farmerName}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "buyerName",
        header: "Acheteur",
        cell: ({ row }) => (
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-500 mr-2" />
            {row.original.buyerName}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "totalPrice",
        header: "Montant Total",
        cell: ({ row }) => (
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
            <span className="font-semibold">
              {row.original.totalPrice.toLocaleString()} FCFA
            </span>
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "productCategory",
        header: "Catégorie",
        cell: ({ row }) => (
          <Badge className="bg-blue-100 text-blue-800">
            {row.original.productCategory.charAt(0).toUpperCase() +
              row.original.productCategory.slice(1)}
          </Badge>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "createdAt",
        header: "Date Commande",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            {new Date(row.original.createdAt).toLocaleDateString("fr-FR")}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              row.original.status
            )}`}
          >
            {row.original.status.replace("_", " ").charAt(0).toUpperCase() +
              row.original.status.replace("_", " ").slice(1)}
          </span>
        ),
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleView(row.original)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {row.original.status === "PENDING" && (
              <>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleApprove(row.original)}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  variant="error"
                  size="sm"
                  onClick={() => handleReject(row.original)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
            {row.original.status === "IN_ESCROW" && (
              <Button
                variant="warning"
                size="sm"
                onClick={() => handleProcessPayment(row.original)}
                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
              >
                <DollarSign className="h-4 w-4" />
              </Button>
            )}
            {row.original.status === "IN_DELIVERY" && (
              <Button
                variant="warning"
                size="sm"
                onClick={() => handleTrackDelivery(row.original)}
                className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
              >
                <Truck className="h-4 w-4" />
              </Button>
            )}
            {row.original.status !== "CANCELLED" &&
              row.original.status !== "DELIVERED" && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCancel(row.original)}
                  className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
          </div>
        ),
      },
    ],
    [
      handleView,
      handleApprove,
      handleReject,
      handleProcessPayment,
      handleTrackDelivery,
      handleCancel,
    ]
  );

  // Configuration des champs du formulaire
  const formFields = useMemo(
    () => [
      {
        name: "orderNumber",
        label: "Numéro de Commande",
        type: "text" as const,
        placeholder: "ORD001",
        required: true,
      },
      {
        name: "productName",
        label: "Nom du Produit",
        type: "text" as const,
        placeholder: "Tomates",
        required: true,
      },
      {
        name: "farmerName",
        label: "Agriculteur",
        type: "text" as const,
        placeholder: "Jean Kouassi",
        required: true,
      },
      {
        name: "buyerName",
        label: "Acheteur",
        type: "text" as const,
        placeholder: "Restaurant Le Gourmet",
        required: true,
      },
      {
        name: "quantity",
        label: "Quantité",
        type: "number" as const,
        placeholder: "50",
        required: true,
        min: 1,
      },
      {
        name: "unitPrice",
        label: "Prix Unitaire",
        type: "number" as const,
        placeholder: "800",
        required: true,
        min: 1,
      },
      {
        name: "totalPrice",
        label: "Prix Total",
        type: "number" as const,
        placeholder: "40000",
        required: true,
        min: 1,
      },
      {
        name: "platformFee",
        label: "Frais de Plateforme",
        type: "number" as const,
        placeholder: "2000",
        required: true,
        min: 0,
      },
      {
        name: "status",
        label: "Statut",
        type: "select" as const,
        required: true,
        options: [
          { value: "PENDING", label: "En attente" },
          { value: "IN_ESCROW", label: "En séquestre" },
          { value: "RELEASED", label: "Libérée" },
          { value: "IN_DELIVERY", label: "En livraison" },
          { value: "DELIVERED", label: "Livrée" },
          { value: "CANCELLED", label: "Annulée" },
          { value: "DISPUTED", label: "Litige" },
        ],
      },
      {
        name: "deliveryAddress",
        label: "Adresse de Livraison",
        type: "textarea" as const,
        placeholder: "123 Rue du Commerce",
        required: true,
        rows: 2,
      },
      {
        name: "expectedDeliveryDate",
        label: "Date de Livraison Prévue",
        type: "date" as const,
        required: true,
      },
      {
        name: "cancellationReason",
        label: "Raison d'annulation",
        type: "textarea" as const,
        placeholder: "Raison...",
        rows: 2,
      },
    ],
    []
  );

  // Configuration des champs de visualisation
  const viewFields = useMemo(
    () => [
      { key: "orderNumber", label: "Numéro de Commande" },
      { key: "productName", label: "Nom du Produit" },
      { key: "farmerName", label: "Agriculteur" },
      { key: "buyerName", label: "Acheteur" },
      { key: "quantity", label: "Quantité" },
      { key: "unitPrice", label: "Prix Unitaire" },
      { key: "totalPrice", label: "Prix Total" },
      { key: "platformFee", label: "Frais de Plateforme" },
      { key: "status", label: "Statut" },
      { key: "deliveryAddress", label: "Adresse de Livraison" },
      { key: "expectedDeliveryDate", label: "Date de Livraison Prévue" },
      { key: "actualDeliveryDate", label: "Date de Livraison Réelle" },
      { key: "createdAt", label: "Date de Commande" },
      { key: "cancellationReason", label: "Raison d'annulation" },
      { key: "cancelledAt", label: "Annulée le" },
      { key: "escrowStartDate", label: "Début Séquestre" },
      { key: "escrowEndDate", label: "Fin Séquestre" },
      { key: "escrowTransactionId", label: "ID Transaction Séquestre" },
    ],
    []
  );

  // Configuration par défaut du formulaire
  const defaultFormData = useMemo(
    () => ({
      id: 0,
      buyerId: 0,
      offerId: 0,
      orderNumber: "",
      productName: "",
      description: "",
      farmerName: "",
      buyerName: "",
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
      platformFee: 0,
      status: "PENDING" as const,
      createdAt: new Date().toISOString(),
      productCategory: "other" as const,
      deliveryAddress: "",
      expectedDeliveryDate: "",
    }),
    []
  );

  // Règles de validation
  const validationRules = useMemo(
    () => ({
      orderNumber: (value: unknown) => {
        if (!value) return "Le numéro de commande est requis";
        return null;
      },
      productName: (value: unknown) => {
        if (!value) return "Le nom du produit est requis";
        return null;
      },
      farmerName: (value: unknown) => {
        if (!value) return "Le nom de l'agriculteur est requis";
        return null;
      },
      buyerName: (value: unknown) => {
        if (!value) return "Le nom de l'acheteur est requis";
        return null;
      },
      quantity: (value: unknown) => {
        if (typeof value !== "number" || value <= 0)
          return "La quantité doit être un nombre positif";
        return null;
      },
      unitPrice: (value: unknown) => {
        if (typeof value !== "number" || value <= 0)
          return "Le prix unitaire doit être un nombre positif";
        return null;
      },
      totalPrice: (value: unknown) => {
        if (typeof value !== "number" || value <= 0)
          return "Le prix total doit être un nombre positif";
        return null;
      },
      platformFee: (value: unknown) => {
        if (typeof value !== "number" || value < 0)
          return "Les frais de plateforme doivent être un nombre positif ou nul";
        return null;
      },
      status: (value: unknown) => {
        if (!value) return "Le statut est requis";
        return null;
      },
      deliveryAddress: (value: unknown) => {
        if (!value) return "L'adresse de livraison est requise";
        return null;
      },
      expectedDeliveryDate: (value: unknown) => {
        if (!value) return "La date de livraison prévue est requise";
        return null;
      },
    }),
    []
  );

  // Statistiques
  const stats = useMemo(
    () => [
      {
        label: "Total Commandes",
        value: orders.length,
        icon: ShoppingCart,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        label: "En Attente",
        value: orders.filter((o) => o.status === "PENDING").length,
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      },
      {
        label: "Livrée",
        value: orders.filter((o) => o.status === "DELIVERED").length,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      {
        label: "Annulée",
        value: orders.filter((o) => o.status === "CANCELLED").length,
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-100",
      },
    ],
    [orders]
  );

  // Handlers pour les soumissions de formulaires
  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to approve order
      // Example: await fetch(`/api/orders/${selectedOrder?.id}/approve`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ approvalNotes: e.target.approvalNotes.value }),
      // });
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Approving order:", selectedOrder);
      alert("Commande approuvée avec succès !");
      setShowApproveModal(false);
      setSelectedOrder(null);
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error("Error approving order:", error);
      alert("Erreur lors de l'approbation de la commande.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to reject order
      // Example: await fetch(`/api/orders/${selectedOrder?.id}/reject`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ rejectionReason: e.target.rejectionReason.value }),
      // });
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Rejecting order:", selectedOrder);
      alert("Commande rejetée avec succès !");
      setShowRejectModal(false);
      setSelectedOrder(null);
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error("Error rejecting order:", error);
      alert("Erreur lors du rejet de la commande.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to process payment
      // Example: await fetch(`/api/orders/${selectedOrder?.id}/process-payment`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ paymentDetails: e.target.paymentDetails.value }),
      // });
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Processing payment for order:", selectedOrder);
      alert("Paiement traité avec succès !");
      setShowPaymentModal(false);
      setSelectedOrder(null);
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Erreur lors du traitement du paiement.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to track delivery
      // Example: await fetch(`/api/orders/${selectedOrder?.id}/track-delivery`, {
      //   method: 'GET',
      //   headers: { 'Content-Type': 'application/json' },
      // });
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Tracking delivery for order:", selectedOrder);
      alert("Suivi de livraison mis à jour !");
      setShowTrackModal(false);
      setSelectedOrder(null);
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error("Error tracking delivery:", error);
      alert("Erreur lors du suivi de la livraison.");
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to cancel order
      // Example: await fetch(`/api/orders/${selectedOrder?.id}/cancel`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ cancellationReason: e.target.cancellationReason.value }),
      // });
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Cancelling order:", selectedOrder);
      alert("Commande annulée avec succès !");
      setShowCancelModal(false);
      setSelectedOrder(null);
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Erreur lors de l'annulation de la commande.");
    } finally {
      setIsLoading(false);
    }
  };

  // Configuration pour la page de gestion des commandes
  const config = useMemo(
    () => ({
      title: "Gestion des Commandes",
      description: "Gérez les commandes, les paiements et les livraisons",
      icon: ShoppingCart,
      stats,
      formFields,
      viewFields,
      columns,
      defaultFormData,
      validationRules,
    }),
    [stats, formFields, viewFields, columns, defaultFormData, validationRules]
  );

  return (
    <>
      <ManagementPage<Order> config={config} data={orders} />

      {/* Modal de visualisation */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Détails de la Commande"
        size="xl"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Informations Commande
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Numéro:
                    </span>
                    <span className="font-mono text-sm">
                      {selectedOrder.orderNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Produit:
                    </span>
                    <span className="text-sm">{selectedOrder.productName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Quantité:
                    </span>
                    <span className="text-sm">{selectedOrder.quantity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Total:
                    </span>
                    <span className="font-semibold text-sm">
                      {selectedOrder.totalPrice.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Statut:
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status
                        .replace("_", " ")
                        .charAt(0)
                        .toUpperCase() +
                        selectedOrder.status.replace("_", " ").slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Détails Parties
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Agriculteur:
                    </span>
                    <span className="text-sm">{selectedOrder.farmerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Acheteur:
                    </span>
                    <span className="text-sm">{selectedOrder.buyerName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Date Commande:
                    </span>
                    <span className="text-sm">
                      {new Date(selectedOrder.createdAt).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                  {selectedOrder.expectedDeliveryDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Livraison Prévue:
                      </span>
                      <span className="text-sm">
                        {new Date(
                          selectedOrder.expectedDeliveryDate
                        ).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  )}
                  {selectedOrder.actualDeliveryDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        Livraison Réelle:
                      </span>
                      <span className="text-sm">
                        {new Date(
                          selectedOrder.actualDeliveryDate
                        ).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Détails de livraison */}
            {selectedOrder.deliveryAddress && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Livraison
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Adresse de livraison
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.deliveryAddress}
                  </p>
                  {selectedOrder.deliveryNotes && (
                    <p className="text-sm text-gray-500 mt-2">
                      Notes: {selectedOrder.deliveryNotes}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Raison d'annulation */}
            {selectedOrder.cancellationReason && (
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-3">
                  Annulation
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">
                      Raison d'annulation
                    </span>
                  </div>
                  <p className="text-sm text-red-700">
                    {selectedOrder.cancellationReason}
                  </p>
                  {selectedOrder.cancelledAt && (
                    <p className="text-sm text-red-600 mt-2">
                      Annulée le:{" "}
                      {new Date(selectedOrder.cancelledAt).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Détails de l'escrow */}
            {selectedOrder.escrowTransactionId && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Séquestre
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">
                      Transaction Séquestre
                    </span>
                  </div>
                  <p className="text-sm text-blue-700">
                    ID: {selectedOrder.escrowTransactionId}
                  </p>
                  {selectedOrder.escrowStartDate && (
                    <p className="text-sm text-blue-600 mt-2">
                      Début:{" "}
                      {new Date(
                        selectedOrder.escrowStartDate
                      ).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                  {selectedOrder.escrowEndDate && (
                    <p className="text-sm text-blue-600 mt-2">
                      Fin:{" "}
                      {new Date(selectedOrder.escrowEndDate).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal d'approbation */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approuver Commande"
        size="md"
      >
        {selectedOrder && (
          <OrderActions
            order={selectedOrder}
            onApprove={handleApprove}
            onReject={handleReject}
            onProcessPayment={handleProcessPayment}
            onTrackDelivery={handleTrackDelivery}
            onCancel={handleCancel}
          />
        )}

        <ModalForm
          onSubmit={handleApproveSubmit}
          onCancel={() => setShowApproveModal(false)}
          submitText="Approuver"
          isLoading={isLoading}
        >
          <FormField
            label="Notes d'approbation (optionnel)"
            name="approvalNotes"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Ajoutez des notes sur cette approbation..."
            rows={3}
          />
        </ModalForm>
      </Modal>

      {/* Modal de rejet */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Rejeter Commande"
        size="md"
      >
        {selectedOrder && (
          <OrderActions
            order={selectedOrder}
            onApprove={handleApprove}
            onReject={handleReject}
            onProcessPayment={handleProcessPayment}
            onTrackDelivery={handleTrackDelivery}
            onCancel={handleCancel}
          />
        )}

        <ModalForm
          onSubmit={handleRejectSubmit}
          onCancel={() => setShowRejectModal(false)}
          submitText="Rejeter"
          isLoading={isLoading}
          submitVariant="danger"
        >
          <FormField
            label="Raison du rejet"
            name="rejectionReason"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Expliquez pourquoi cette commande est rejetée..."
            required
            rows={3}
          />
        </ModalForm>
      </Modal>

      {/* Modal de traitement de paiement */}
      <Modal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Traiter Paiement"
        size="md"
      >
        {selectedOrder && (
          <OrderActions
            order={selectedOrder}
            onApprove={handleApprove}
            onReject={handleReject}
            onProcessPayment={handleProcessPayment}
            onTrackDelivery={handleTrackDelivery}
            onCancel={handleCancel}
          />
        )}

        <ModalForm
          onSubmit={handleProcessPaymentSubmit}
          onCancel={() => setShowPaymentModal(false)}
          submitText="Traiter"
          isLoading={isLoading}
        >
          <FormField
            label="Détails du paiement"
            name="paymentDetails"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Informations de transaction, ID Hedera, etc."
            required
            rows={3}
          />
        </ModalForm>
      </Modal>

      {/* Modal de suivi de livraison */}
      <Modal
        isOpen={showTrackModal}
        onClose={() => setShowTrackModal(false)}
        title="Suivre Livraison"
        size="md"
      >
        {selectedOrder && (
          <OrderActions
            order={selectedOrder}
            onApprove={handleApprove}
            onReject={handleReject}
            onProcessPayment={handleProcessPayment}
            onTrackDelivery={handleTrackDelivery}
            onCancel={handleCancel}
          />
        )}

        <ModalForm
          onSubmit={handleTrackDeliverySubmit}
          onCancel={() => setShowTrackModal(false)}
          submitText="Mettre à jour Suivi"
          isLoading={isLoading}
        >
          <FormField
            label="Statut de livraison actuel"
            name="currentDeliveryStatus"
            type="select"
            value=""
            onChange={() => {}}
            options={[
              { value: "PENDING", label: "En attente" },
              { value: "IN_DELIVERY", label: "En livraison" },
              { value: "DELIVERED", label: "Livrée" },
              { value: "FAILED", label: "Échouée" },
            ]}
          />
          <FormField
            label="Notes de suivi"
            name="trackingNotes"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Ajoutez des notes de suivi..."
            rows={3}
          />
        </ModalForm>
      </Modal>

      {/* Modal d'annulation de commande */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Annuler Commande"
        size="md"
      >
        {selectedOrder && (
          <OrderActions
            order={selectedOrder}
            onApprove={handleApprove}
            onReject={handleReject}
            onProcessPayment={handleProcessPayment}
            onTrackDelivery={handleTrackDelivery}
            onCancel={handleCancel}
          />
        )}

        <ModalForm
          onSubmit={handleCancelSubmit}
          onCancel={() => setShowCancelModal(false)}
          submitText="Annuler Commande"
          isLoading={isLoading}
          submitVariant="danger"
        >
          <FormField
            label="Raison d'annulation"
            name="cancellationReason"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Expliquez la raison de l'annulation..."
            required
            rows={3}
          />
        </ModalForm>
      </Modal>
    </>
  );
};

export default OrdersManagementOptimized;
