import React, { useState, useMemo, useCallback } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  AlertCircle,
  Package,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { createColumnHelper, CellContext } from "@tanstack/react-table";
import { ManagementPage } from "../components/ManagementPage";
import Modal from "../components/Modal";
import ModalForm from "../components/ModalForm";
import FormField from "../components/FormField";
import { Dispute } from "../types";

// Composant spécialisé pour les actions de litige
interface DisputeActionsProps {
  dispute: Dispute;
  onAssign: (dispute: Dispute) => void;
  onResolve: (dispute: Dispute) => void;
  onEscalate: (dispute: Dispute) => void;
}

const DisputeActions: React.FC<DisputeActionsProps> = ({
  dispute,
  onAssign,
  onResolve,
  onEscalate,
}) => {
  const getStatusColor = (status: Dispute["status"]) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: Dispute["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Informations du litige */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Informations Générales
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium w-20">Description:</span>
                <span>{dispute.description}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Statut:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    dispute.status
                  )}`}
                >
                  {dispute.status.charAt(0).toUpperCase() +
                    dispute.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Priorité:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                    dispute.priority
                  )}`}
                >
                  {dispute.priority.charAt(0).toUpperCase() +
                    dispute.priority.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Parties Concernées
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Agriculteur:</span>
                <span className="ml-2">{dispute.farmer}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Acheteur:</span>
                <span className="ml-2">{dispute.buyer}</span>
              </div>
              <div className="flex items-center">
                <Package className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Produit:</span>
                <span className="ml-2">{dispute.productType}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions disponibles */}
      <div className="flex flex-wrap gap-2">
        {dispute.status === "open" && (
          <>
            <button
              onClick={() => onAssign(dispute)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Assigner
            </button>
            <button
              onClick={() => onResolve(dispute)}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Résoudre
            </button>
          </>
        )}

        {dispute.status === "in-progress" && (
          <>
            <button
              onClick={() => onResolve(dispute)}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Résoudre
            </button>
            <button
              onClick={() => onEscalate(dispute)}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Escalader
            </button>
          </>
        )}

        {dispute.status === "closed" && (
          <button
            onClick={() => onResolve(dispute)}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Résoudre
          </button>
        )}

        <button className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          <MessageSquare className="h-4 w-4 mr-2" />
          Commenter
        </button>
      </div>
    </div>
  );
};

// Configuration pour la page de gestion des litiges optimisée
const DisputesManagementOptimized: React.FC = () => {
  // États pour les modals spécialisés
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // États pour les formulaires
  const [assignFormData, setAssignFormData] = useState({
    assignedTo: "",
    comment: "",
  });

  const [resolveFormData, setResolveFormData] = useState({
    resolution: "",
    resolutionComment: "",
    compensation: "",
  });

  // Données d'exemple
  const disputesData: Dispute[] = useMemo(
    () => [
      {
        id: 1,
        farmer: "Jean Kouassi",
        buyer: "Restaurant Le Gourmet",
        orderId: 101,
        productType: "Fruits",
        category: "non-delivery",
        status: "in-progress",
        priority: "high",
        description:
          "Le lot de mangues commandé le 10/09 n'a pas été livré à temps.",
        createdAt: "2024-09-12",
        assignedTo: "Fatou Keita",
        hederaTxId: "0.0.1234567@1678888888.123456789",
      },
      {
        id: 2,
        farmer: "Ibrahim Traoré",
        buyer: "Supermarché Fraîcheur",
        orderId: 102,
        productType: "Légumes",
        category: "quality",
        status: "open" as const,
        priority: "medium" as const,
        description:
          "Les avocats reçus sont trop mûrs et ne peuvent pas être vendus.",
        createdAt: "2024-09-14",
        assignedTo: "Non assigné",
        hederaTxId: "0.0.7654321@1678999999.987654321",
      },
      {
        id: 3,
        farmer: "Aisha Diallo",
        buyer: "Grossiste Céréales",
        orderId: 103,
        productType: "Céréales",
        category: "cancellation",
        status: "resolved",
        priority: "low",
        description:
          "L'acheteur a annulé la commande de riz 2 jours avant la livraison prévue.",
        createdAt: "2024-09-01",
        resolvedAt: "2024-09-05",
        assignedTo: "Fatou Keita",
        hederaTxId: "0.0.9876543@1678777777.543210987",
      },
      {
        id: 4,
        farmer: "Moussa Koné",
        buyer: "Hôtel Ivoire",
        orderId: 104,
        productType: "Divers",
        category: "payment",
        status: "closed",
        priority: "urgent",
        description:
          "Le paiement en HBAR pour la commande 104 n'a pas été débloqué.",
        createdAt: "2024-09-18",
        resolvedAt: "2024-09-19",
        assignedTo: "Admin Système",
        hederaTxId: "0.0.1122334@1679111111.223344556",
      },
    ],
    []
  );

  // Handlers pour les actions spécialisées
  const handleAssign = useCallback((dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowAssignModal(true);
  }, []);

  const handleResolve = useCallback((dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowResolveModal(true);
  }, []);

  const handleEscalate = useCallback(() => {
    // Logique d'escalade
  }, []);

  // Handlers pour les formulaires
  const handleAssignFormChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setAssignFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleResolveFormChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setResolveFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const resetAssignForm = useCallback(() => {
    setAssignFormData({ assignedTo: "", comment: "" });
  }, []);

  const resetResolveForm = useCallback(() => {
    setResolveFormData({
      resolution: "",
      resolutionComment: "",
      compensation: "",
    });
  }, []);

  // Handlers pour fermer les modals
  const handleCloseAssignModal = useCallback(() => {
    setShowAssignModal(false);
    setSelectedDispute(null);
    resetAssignForm();
  }, [resetAssignForm]);

  const handleCloseResolveModal = useCallback(() => {
    setShowResolveModal(false);
    setSelectedDispute(null);
    resetResolveForm();
  }, [resetResolveForm]);

  // Configuration des colonnes
  const columns = useCallback(
    (columnHelper: ReturnType<typeof createColumnHelper<Dispute>>) => {
      return [
        columnHelper.accessor("description", {
          header: "Description du Litige",
          cell: (info: CellContext<Dispute, unknown>) => (
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-gray-500 mr-2" />
              <div>
                <div className="font-medium">{String(info.getValue())}</div>
                <div className="text-sm text-gray-500">
                  #{info.row.original.orderId}
                </div>
              </div>
            </div>
          ),
          enableSorting: true,
        }),
        columnHelper.accessor("farmer", {
          header: "Agriculteur",
          cell: (info: CellContext<Dispute, unknown>) => (
            <div className="flex items-center">
              <User className="h-4 w-4 text-gray-500 mr-2" />
              {String(info.getValue())}
            </div>
          ),
          enableSorting: true,
        }),
        columnHelper.accessor("buyer", {
          header: "Acheteur",
          cell: (info: CellContext<Dispute, unknown>) => (
            <div className="flex items-center">
              <User className="h-4 w-4 text-gray-500 mr-2" />
              {String(info.getValue())}
            </div>
          ),
          enableSorting: true,
        }),
        columnHelper.accessor("productType", {
          header: "Type Produit",
          cell: (info: CellContext<Dispute, unknown>) => (
            <div className="flex items-center">
              <Package className="h-4 w-4 text-gray-500 mr-2" />
              {String(info.getValue())}
            </div>
          ),
          enableSorting: true,
        }),
        columnHelper.accessor("category", {
          header: "Catégorie",
          cell: (info: CellContext<Dispute, unknown>) =>
            String(info.getValue()).charAt(0).toUpperCase() +
            String(info.getValue()).slice(1).replace("-", " "),
          enableSorting: true,
          enableColumnFilter: true,
        }),
        columnHelper.accessor("status", {
          header: "Statut",
          cell: (info: CellContext<Dispute, unknown>) => {
            const status = String(info.getValue());
            const colors = {
              open: "bg-blue-100 text-blue-800",
              "in-progress": "bg-yellow-100 text-yellow-800",
              resolved: "bg-green-100 text-green-800",
              closed: "bg-red-100 text-red-800",
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
        columnHelper.accessor("priority", {
          header: "Priorité",
          cell: (info: CellContext<Dispute, unknown>) => {
            const priority = String(info.getValue());
            const colors = {
              low: "bg-green-100 text-green-800",
              medium: "bg-yellow-100 text-yellow-800",
              high: "bg-orange-100 text-orange-800",
              urgent: "bg-red-100 text-red-800",
            };
            return (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  colors[priority as keyof typeof colors]
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </span>
            );
          },
          enableSorting: true,
          enableColumnFilter: true,
        }),
        columnHelper.accessor("createdAt", {
          header: "Date Création",
          cell: (info: CellContext<Dispute, unknown>) => (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
              {String(info.getValue())}
            </div>
          ),
          enableSorting: true,
        }),
        columnHelper.accessor("resolvedAt", {
          header: "Date Résolution",
          cell: (info: CellContext<Dispute, unknown>) => (
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-500 mr-2" />
              {info.getValue() ? String(info.getValue()) : "Non résolu"}
            </div>
          ),
          enableSorting: true,
        }),
        columnHelper.display({
          id: "actions",
          header: "Actions",
          cell: ({ row }) => (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleAssign(row.original)}
                className="text-blue-600 hover:text-blue-900 transition-colors"
                title="Assigner le litige"
              >
                <UserPlus className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleResolve(row.original)}
                className="text-green-600 hover:text-green-900 transition-colors"
                title="Résoudre le litige"
              >
                <CheckCircle className="h-5 w-5" />
              </button>
            </div>
          ),
        }),
      ];
    },
    [handleAssign, handleResolve]
  );

  // Configuration des champs du formulaire
  const formFields = useMemo(
    () => [
      {
        name: "description",
        label: "Description",
        type: "textarea" as const,
        placeholder: "Détails du litige...",
        required: true,
        rows: 3,
      },
      {
        name: "farmer",
        label: "Agriculteur",
        type: "text" as const,
        placeholder: "Nom de l'agriculteur",
        required: true,
      },
      {
        name: "buyer",
        label: "Acheteur",
        type: "text" as const,
        placeholder: "Nom de l'acheteur",
        required: true,
      },
      {
        name: "orderId",
        label: "ID Commande",
        type: "number" as const,
        placeholder: "123",
        required: true,
        min: 1,
      },
      {
        name: "productType",
        label: "Type de Produit",
        type: "text" as const,
        placeholder: "Fruits, Légumes, etc.",
        required: true,
      },
      {
        name: "category",
        label: "Catégorie",
        type: "select" as const,
        required: true,
        options: [
          { value: "non-delivery", label: "Non-livraison" },
          { value: "cancellation", label: "Annulation" },
          { value: "quality", label: "Qualité" },
          { value: "payment", label: "Paiement" },
          { value: "logistics", label: "Logistique" },
          { value: "other", label: "Autre" },
        ],
      },
      {
        name: "priority",
        label: "Priorité",
        type: "select" as const,
        required: true,
        options: [
          { value: "low", label: "Faible" },
          { value: "medium", label: "Moyenne" },
          { value: "high", label: "Élevée" },
          { value: "urgent", label: "Urgente" },
        ],
      },
      {
        name: "assignedTo",
        label: "Assigné à",
        type: "text" as const,
        placeholder: "Nom de l'administrateur",
        required: false,
      },
    ],
    []
  );

  // Configuration des champs de visualisation
  const viewFields = useMemo(
    () => [
      { key: "description", label: "Description" },
      { key: "farmer", label: "Agriculteur" },
      { key: "buyer", label: "Acheteur" },
      { key: "orderId", label: "ID Commande" },
      { key: "productType", label: "Type de Produit" },
      { key: "category", label: "Catégorie" },
      { key: "status", label: "Statut" },
      { key: "priority", label: "Priorité" },
      { key: "createdAt", label: "Date Création" },
      { key: "resolvedAt", label: "Date Résolution" },
      { key: "assignedTo", label: "Assigné à" },
      { key: "hederaTxId", label: "ID Transaction Hedera" },
    ],
    []
  );

  // Configuration par défaut du formulaire
  const defaultFormData = useMemo(
    () => ({
      description: "",
      farmer: "",
      buyer: "",
      orderId: 0,
      productType: "",
      priority: "medium" as const,
      category: "other" as const,
      assignedTo: "",
      status: "open" as const,
      createdAt: new Date().toISOString().split("T")[0],
    }),
    []
  );

  // Règles de validation
  const validationRules = useMemo(
    () => ({
      description: (value: unknown) => {
        const str = String(value);
        if (!str.trim()) return "La description est requise";
        if (str.length < 10)
          return "La description doit contenir au moins 10 caractères";
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
      orderId: (value: unknown) => {
        const num = Number(value);
        if (!num || num < 1)
          return "L'ID de commande doit être un nombre positif";
        return null;
      },
      productType: (value: unknown) => {
        const str = String(value);
        if (!str.trim()) return "Le type de produit est requis";
        if (str.length < 2)
          return "Le type de produit doit contenir au moins 2 caractères";
        return null;
      },
      category: (value: unknown) => {
        if (!value) return "La catégorie est requise";
        return null;
      },
      priority: (value: unknown) => {
        if (!value) return "La priorité est requise";
        return null;
      },
    }),
    []
  );

  // Statistiques
  const stats = useMemo(
    () => [
      {
        label: "Total Litiges",
        value: disputesData.length,
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-100",
      },
      {
        label: "En Cours",
        value: disputesData.filter(
          (d) => d.status === "open" || d.status === "in-progress"
        ).length,
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      },
      {
        label: "Résolus",
        value: disputesData.filter((d) => d.status === "resolved").length,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      {
        label: "Fermés",
        value: disputesData.filter((d) => d.status === "closed").length,
        icon: AlertCircle,
        color: "text-red-600",
        bgColor: "bg-red-100",
      },
    ],
    [disputesData]
  );

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'API optimisée
    await new Promise((resolve) => setTimeout(resolve, 200));

    setIsLoading(false);
    setShowAssignModal(false);
    setSelectedDispute(null);
    resetAssignForm();
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'API optimisée
    await new Promise((resolve) => setTimeout(resolve, 200));

    setIsLoading(false);
    setShowResolveModal(false);
    setSelectedDispute(null);
    resetResolveForm();
  };

  const config = useMemo(
    () => ({
      title: "Gestion des Litiges",
      description:
        "Gérez les litiges entre agriculteurs et acheteurs, assurez la résolution équitable",
      icon: AlertTriangle,
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
      <ManagementPage<Dispute> config={config} data={disputesData} />

      {/* Modal d'assignation */}
      <Modal
        isOpen={showAssignModal}
        onClose={handleCloseAssignModal}
        title="Assigner un Litige"
        size="lg"
      >
        {selectedDispute && (
          <DisputeActions
            dispute={selectedDispute}
            onAssign={handleAssign}
            onResolve={handleResolve}
            onEscalate={handleEscalate}
          />
        )}

        <ModalForm
          onSubmit={handleAssignSubmit}
          onCancel={handleCloseAssignModal}
          submitText="Assigner"
          isLoading={isLoading}
        >
          <FormField
            label="Assigné à"
            name="assignedTo"
            type="text"
            value={assignFormData.assignedTo}
            onChange={handleAssignFormChange}
            placeholder="Nom de l'administrateur"
            required
          />
          <FormField
            label="Commentaire"
            name="comment"
            type="textarea"
            value={assignFormData.comment}
            onChange={handleAssignFormChange}
            placeholder="Commentaire sur l'assignation..."
            rows={3}
          />
        </ModalForm>
      </Modal>

      {/* Modal de résolution */}
      <Modal
        isOpen={showResolveModal}
        onClose={handleCloseResolveModal}
        title="Résoudre un Litige"
        size="lg"
      >
        {selectedDispute && (
          <DisputeActions
            dispute={selectedDispute}
            onAssign={handleAssign}
            onResolve={handleResolve}
            onEscalate={handleEscalate}
          />
        )}

        <ModalForm
          onSubmit={handleResolveSubmit}
          onCancel={handleCloseResolveModal}
          submitText="Résoudre"
          isLoading={isLoading}
        >
          <FormField
            label="Résolution"
            name="resolution"
            type="select"
            value={resolveFormData.resolution}
            onChange={handleResolveFormChange}
            required
            options={[
              {
                value: "resolved-farmer",
                label: "Résolu en faveur de l'agriculteur",
              },
              {
                value: "resolved-buyer",
                label: "Résolu en faveur de l'acheteur",
              },
              { value: "resolved-partial", label: "Résolution partielle" },
              { value: "resolved-no-fault", label: "Aucune faute" },
            ]}
          />
          <FormField
            label="Commentaire de résolution"
            name="resolutionComment"
            type="textarea"
            value={resolveFormData.resolutionComment}
            onChange={handleResolveFormChange}
            placeholder="Détails de la résolution..."
            required
            rows={4}
          />
          <FormField
            label="Compensation (€)"
            name="compensation"
            type="number"
            value={resolveFormData.compensation}
            onChange={handleResolveFormChange}
            placeholder="0.00"
            min={0}
            step={0.01}
          />
        </ModalForm>
      </Modal>
    </>
  );
};

export default DisputesManagementOptimized;
