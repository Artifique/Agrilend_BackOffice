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
import Modal from "../components/Modal";
import ModalForm from "../components/ModalForm";
import FormField from "../components/FormField";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "../types";
import { Button, Badge } from "../components/ui";
import { ManagementPage } from "../components/ManagementPage";
import { getAllOrders } from "../services/orderService"; // Import the service

// Utility function for status color
function getStatusColor(status: Order["status"]): string {
  switch (status) {
    case "PENDING": return "bg-yellow-100 text-yellow-800";
    case "IN_ESCROW": return "bg-blue-100 text-blue-800";
    case "RELEASED": return "bg-green-100 text-green-800";
    case "IN_DELIVERY": return "bg-orange-100 text-orange-800";
    case "DELIVERED": return "bg-green-100 text-green-800";
    case "CANCELLED": return "bg-red-100 text-red-800";
    case "DISPUTED": return "bg-purple-100 text-purple-800";
    default: return "bg-gray-100 text-gray-800";
  }
}

// Order Actions Component (simplified for brevity, ensure props match Order type)
interface OrderActionsProps {
  order: Order;
  // Add action handlers as props
}

const OrderActions: React.FC<OrderActionsProps> = ({ order }) => {
  // Action logic here...
  return <div>Actions for {order.orderNumber}</div>;
};

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const fetchedOrders = await getAllOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      // Optionally, show an error notification to the user
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleView = useCallback((order: Order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  }, []);

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
              <div className="text-sm text-gray-500">{row.original.productName}</div>
            </div>
          </div>
        ),
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
      },
      {
        accessorKey: "totalAmount", // Changed from totalPrice
        header: "Montant Total",
        cell: ({ row }) => (
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
            <span className="font-semibold">
              {row.original.totalAmount.toLocaleString()} FCFA
            </span>
          </div>
        ),
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
            {/* Other action buttons can be added here based on status */}
          </div>
        ),
      },
    ],
    [handleView]
  );

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

  const config = useMemo(
    () => ({
      title: "Gestion des Commandes",
      description: "Gérez les commandes, les paiements et les livraisons",
      icon: ShoppingCart,
      stats,
      columns,
      viewFields: [
        { key: "orderNumber", label: "N° Commande" },
        { key: "productName", label: "Produit" },
        { key: "status", label: "Statut" },
        { key: "totalAmount", label: "Montant Total" },
        { key: "orderedQuantity", label: "Quantité" },
        { key: "farmerName", label: "Agriculteur" },
        { key: "buyerName", label: "Acheteur" },
        { key: "createdAt", label: "Date création" },
      ],
      formFields: [], // Requis par ManagementPage
      defaultFormData: {}, // Requis par ManagementPage
    }),
    [stats, columns]
  );

  const dummyService = {
    create: async () => Promise.reject(new Error("Not implemented")),
    update: async () => Promise.reject(new Error("Not implemented")),
    remove: async () => Promise.reject(new Error("Not implemented")),
  };

  return (
    <>
      <ManagementPage<Order> config={config} data={orders} isLoading={isLoading} service={dummyService} />

      {/* La modale ci-dessous est maintenant gérée par ManagementPage et peut être supprimée à l'avenir */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Détails de la Commande"
        size="xl"
      >
        {selectedOrder && (
          <div className="space-y-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Informations Commande</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-sm font-medium text-gray-600">Numéro:</span><span className="font-mono text-sm">{selectedOrder.orderNumber}</span></div>
                  <div className="flex justify-between"><span className="text-sm font-medium text-gray-600">Produit:</span><span className="text-sm">{selectedOrder.productName}</span></div>
                  <div className="flex justify-between"><span className="text-sm font-medium text-gray-600">Quantité:</span><span className="text-sm">{selectedOrder.orderedQuantity} {selectedOrder.productUnit}</span></div>
                  <div className="flex justify-between"><span className="text-sm font-medium text-gray-600">Total:</span><span className="font-semibold text-sm">{selectedOrder.totalAmount.toLocaleString()} FCFA</span></div>
                  <div className="flex justify-between"><span className="text-sm font-medium text-gray-600">Statut:</span><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Détails Parties</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-sm font-medium text-gray-600">Agriculteur:</span><span className="text-sm">{selectedOrder.farmerName}</span></div>
                  <div className="flex justify-between"><span className="text-sm font-medium text-gray-600">Acheteur:</span><span className="text-sm">{selectedOrder.buyerName}</span></div>
                  <div className="flex justify-between"><span className="text-sm font-medium text-gray-600">Email Acheteur:</span><span className="text-sm">{selectedOrder.buyerEmail}</span></div>
                  <div className="flex justify-between"><span className="text-sm font-medium text-gray-600">Date Commande:</span><span className="text-sm">{new Date(selectedOrder.createdAt).toLocaleDateString("fr-FR")}</span></div>
                </div>
              </div>
            </div>

            {selectedOrder.deliveryAddress && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Livraison</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4 text-gray-600" /><span className="text-sm font-medium text-gray-700">Adresse</span></div>
                  <p className="text-sm text-gray-600">{selectedOrder.deliveryAddress}</p>
                  {selectedOrder.notes && <p className="text-sm text-gray-500 mt-2">Notes: {selectedOrder.notes}</p>}
                </div>
              </div>
            )}

            {selectedOrder.escrowTransactionId && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Séquestre</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2"><Shield className="h-4 w-4 text-blue-600" /><span className="text-sm font-medium text-blue-800">Transaction</span></div>
                  <p className="text-sm text-blue-700">ID: {selectedOrder.escrowTransactionId}</p>
                  {selectedOrder.escrowStartDate && <p className="text-sm text-blue-600 mt-2">Début: {new Date(selectedOrder.escrowStartDate).toLocaleDateString("fr-FR")}</p>}
                  {selectedOrder.escrowEndDate && <p className="text-sm text-blue-600 mt-2">Fin: {new Date(selectedOrder.escrowEndDate).toLocaleDateString("fr-FR")}</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default OrdersManagement;