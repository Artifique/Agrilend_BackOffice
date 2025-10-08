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
  Eye,
  Edit,
  MapPin,
  Shield,
} from "lucide-react";
import Modal from "../components/Modal";
import ModalForm from "../components/ModalForm";
import FormField from "../components/FormField";
import { ColumnDef } from "@tanstack/react-table";
import { Order } from "../types";
import { Button } from "../components/ui";
import DataTable from "../components/DataTable";
import { getAllOrders, updateOrderStatus } from "../services/orderService";
import { useNotificationHelpers } from "../hooks/useNotificationHelpers";

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

const OrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order["status"] | "">("");
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotificationHelpers();

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedOrders = await getAllOrders();
      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      showError("Erreur", "Impossible de charger les commandes.");
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewClick = (order: Order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  const handleUpdateStatusClick = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const handleSubmitStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !newStatus) return;

    try {
      await updateOrderStatus(String(selectedOrder.id), newStatus);
      showSuccess("Succès", "Statut de la commande mis à jour.");
      setShowStatusModal(false);
      setSelectedOrder(null);
      setNewStatus("");
      fetchOrders();
    } catch (error) {
      showError("Erreur", "Impossible de mettre à jour le statut.");
    }
  };

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
        accessorKey: "totalAmount",
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
              onClick={() => handleViewClick(row.original)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleUpdateStatusClick(row.original)}
              className="text-green-600 hover:text-green-800"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [fetchOrders]
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

  const statusOptions = [
    { value: "PENDING", label: "En attente" },
    { value: "IN_ESCROW", label: "En séquestre" },
    { value: "RELEASED", label: "Libérée" },
    { value: "IN_DELIVERY", label: "En livraison" },
    { value: "DELIVERED", label: "Livrée" },
    { value: "CANCELLED", label: "Annulée" },
    { value: "DISPUTED", label: "En litige" },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestion des Commandes</h1>
            <p className="text-blue-100">Gérez les commandes, les paiements et les livraisons</p>
          </div>
          <div className="p-4 bg-white bg-opacity-20 rounded-xl">
            <ShoppingCart className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                  <StatIcon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isLoading && <p>Chargement...</p>}
      {!isLoading && (
        <DataTable<Order>
          columns={columns}
          data={orders}
        />
      )}

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

      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Mettre à jour le statut de la commande"
        size="md"
      >
        <ModalForm
          onSubmit={handleSubmitStatusUpdate}
          onCancel={() => setShowStatusModal(false)}
          submitText="Mettre à jour"
          isLoading={isLoading}
        >
          <FormField
            label="Statut de la commande"
            name="status"
            type="select"
            value={newStatus || ""}
            onChange={(e) => setNewStatus(e.target.value as Order["status"])}
            options={statusOptions}
            required
          />
        </ModalForm>
      </Modal>
    </div>
  );
};

export default OrdersManagement;