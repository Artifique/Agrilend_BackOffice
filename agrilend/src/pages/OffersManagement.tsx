
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Package,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  DollarSign,
  Clock,
  AlertCircle,
} from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../components/DataTable";
import {
  getOffers,
  Offer,
  OfferPage,
  approveOffer,
  rejectOffer,
} from "../services/offerService";
import { Button } from "../components/ui";
import Modal from "../components/Modal";
import ModalForm from "../components/ModalForm";
import FormField from "../components/FormField";
import { useNotificationHelpers } from "../hooks/useNotificationHelpers";

const OffersManagement: React.FC = () => {
  const [offerPage, setOfferPage] = useState<OfferPage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  const { showSuccess, showError } = useNotificationHelpers();

  const fetchOffers = useCallback(async (page = 0, size = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOffers(page, size);
      setOfferPage(data);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setError("Impossible de charger les offres.");
      showError("Erreur", "Impossible de charger les offres.");
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handlePageChange = (page: number) => {
    fetchOffers(page, offerPage?.size);
  };

  const handleApproveClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowApproveModal(true);
  };

  const handleRejectClick = (offer: Offer) => {
    setSelectedOffer(offer);
    setShowRejectModal(true);
  };

  const handleSubmitApprove = async () => {
    if (!selectedOffer) return;

    try {
      await approveOffer(selectedOffer.id);
      showSuccess("Succès", "Offre approuvée avec succès !");
      setShowApproveModal(false);
      setSelectedOffer(null);
      fetchOffers(offerPage?.page, offerPage?.size);
    } catch (error) {
      showError("Erreur", "Impossible d'approuver l'offre.");
    }
  };

  const handleSubmitReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer) return;

    try {
      await rejectOffer(selectedOffer.id, rejectReason);
      showSuccess("Succès", "Offre rejetée avec succès !");
      setShowRejectModal(false);
      setRejectReason("");
      setSelectedOffer(null);
      fetchOffers(offerPage?.page, offerPage?.size);
    } catch (error) {
      showError("Erreur", "Impossible de rejeter l'offre.");
    }
  };

  const columns = useMemo<ColumnDef<Offer>[]>(
    () => [
      {
        accessorKey: "productName",
        header: "Produit",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Package className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <div className="font-medium">{row.original.productName}</div>
              <div className="text-sm text-gray-500">
                {row.original.productDescription}
              </div>
            </div>
          </div>
        ),
        enableSorting: true,
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
        accessorKey: "availableQuantity",
        header: "Quantité",
        cell: ({ row }) =>
          `${row.original.availableQuantity} ${row.original.productUnit}`,
        enableSorting: true,
      },
      {
        accessorKey: "suggestedUnitPrice",
        header: "Prix Suggéré",
        cell: ({ row }) => (
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
            <span className="font-semibold">
              {row.original.suggestedUnitPrice.toLocaleString()} FCFA/
              {row.original.productUnit}
            </span>
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => {
          const status = row.original.status;
          const colors = {
            PENDING_VALIDATION: "bg-yellow-100 text-yellow-800",
            ACTIVE: "bg-green-100 text-green-800",
            REJECTED: "bg-red-100 text-red-800",
            DRAFT: "bg-gray-100 text-gray-800",
            SOLD_OUT: "bg-purple-100 text-purple-800",
            EXPIRED: "bg-gray-400 text-gray-900",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                colors[status as keyof typeof colors]
              }`}
            >
              {status.replace("_", " ").charAt(0).toUpperCase() +
                status.replace("_", " ").slice(1)}
            </span>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "availabilityDate",
        header: "Disponibilité",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            {new Date(row.original.availabilityDate).toLocaleDateString()}
          </div>
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleApproveClick(row.original)}
              className="text-green-600 hover:text-green-800"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRejectClick(row.original)}
              className="text-red-600 hover:text-red-800"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [fetchOffers]
  );

  const stats = useMemo(
    () => [
      {
        label: "Total Offres",
        value: offerPage?.totalElements || 0,
        icon: Package,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        label: "En Attente",
        value: offerPage?.content.filter((p) => p.status === "PENDING_VALIDATION")
          .length,
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      },
      {
        label: "Approuvées",
        value: offerPage?.content.filter((p) => p.status === "ACTIVE").length,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      {
        label: "Rejetées",
        value: offerPage?.content.filter((p) => p.status === "REJECTED").length,
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-100",
      },
    ],
    [offerPage]
  );

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestion des Offres</h1>
            <p className="text-blue-100">
              Suivez, validez et gérez les offres de produits des agriculteurs.
            </p>
          </div>
          <div className="p-4 bg-white bg-opacity-20 rounded-xl">
            <Package className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const StatIcon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
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
      {error && <p className="text-red-500">{error}</p>}
      {offerPage && (
        <DataTable<Offer>
          columns={columns}
          data={offerPage.content}
          pageCount={offerPage.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approuver l'offre"
        size="md"
      >
        {selectedOffer && (
            <div className="space-y-4">
                <div className="flex items-center">
                    <AlertCircle className="h-6 w-6 text-green-600 mr-3" />
                    <div>
                        <p className="text-gray-900 font-medium">
                        Êtes-vous sûr de vouloir approuver cette offre ?
                        </p>
                    </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                        <strong>Produit :</strong> {selectedOffer.productName}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Agriculteur :</strong> {selectedOffer.farmerName}
                    </p>
                    <p className="text-sm text-gray-600">
                        <strong>Quantité :</strong> {selectedOffer.availableQuantity} {selectedOffer.productUnit}
                    </p>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowApproveModal(false)}>Annuler</Button>
                    <Button variant="success" onClick={handleSubmitApprove}>Approuver</Button>
                </div>
            </div>
        )}
      </Modal>

      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Rejeter l'offre"
        size="md"
      >
        <ModalForm
          onSubmit={handleSubmitReject}
          onCancel={() => setShowRejectModal(false)}
          submitText="Rejeter"
          isLoading={isLoading}
          submitVariant="danger"
        >
          <FormField
            label="Raison du rejet"
            name="rejectionReason"
            type="textarea"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Expliquez pourquoi l'offre est rejetée..."
            required
            rows={4}
          />
        </ModalForm>
      </Modal>
    </div>
  );
};

export default OffersManagement;
