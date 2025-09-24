import React, { useState, useMemo, useCallback, useEffect } from "react";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Dispute } from "../types";
import { ManagementPage } from "../components/ManagementPage";
import Modal from "../components/Modal";
import ModalForm from "../components/ModalForm";
import FormField from "../components/FormField";
import { createColumnHelper } from "@tanstack/react-table";

const DisputesManagement: React.FC = () => {
  // États
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [showResolveModal, setShowResolveModal] = useState<boolean>(false);
  const [assignFormData, setAssignFormData] = useState<{
    assignedTo: string;
    comment: string;
  }>({ assignedTo: "", comment: "" });
  const [resolveFormData, setResolveFormData] = useState<{
    resolution: string;
    resolutionComment: string;
    compensation: string;
  }>({ resolution: "", resolutionComment: "", compensation: "" });

  // Fonctions pour fermer les modals
  const handleCloseAssignModal = useCallback(() => {
    setShowAssignModal(false);
    setSelectedDispute(null);
    setAssignFormData({ assignedTo: "", comment: "" });
  }, []);

  const handleCloseResolveModal = useCallback(() => {
    setShowResolveModal(false);
    setSelectedDispute(null);
    setResolveFormData({
      resolution: "",
      resolutionComment: "",
      compensation: "",
    });
  }, []);

  // Fetch disputes
  const fetchDisputes = useCallback(async () => {
    setIsLoading(true);
    // Simule un appel API
    await new Promise((resolve) => setTimeout(resolve, 500));
    const fetchedDisputes: Dispute[] = [
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
        status: "open",
        priority: "medium",
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
    ];
    setDisputes(fetchedDisputes);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  // ... (le reste du code jusqu'à la définition des colonnes)

  const columnHelper = createColumnHelper<Dispute>();

  // Colonnes pour la table
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", { header: "ID" }),
      columnHelper.accessor("description", { header: "Description" }),
      columnHelper.accessor("farmer", { header: "Agriculteur" }),
      columnHelper.accessor("buyer", { header: "Acheteur" }),
      columnHelper.accessor("orderId", { header: "ID Commande" }),
      columnHelper.accessor("status", {
        header: "Statut",
        cell: ({ row }: { row: { original: Dispute } }) => {
          const status = row.original.status;
          const colors = {
            open: "bg-blue-100 text-blue-800",
            "in-progress": "bg-yellow-100 text-yellow-800",
            resolved: "bg-green-100 text-green-800",
            closed: "bg-gray-100 text-gray-800",
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
      }),
      columnHelper.accessor("priority", { header: "Priorité" }),
      columnHelper.accessor("createdAt", { header: "Date Création" }),
      columnHelper.accessor("assignedTo", { header: "Assigné à" }),
    ],
    [columnHelper]
  );

  // Handlers pour les actions
  const handleAssign = useCallback((dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowAssignModal(true);
  }, []);

  const handleResolve = useCallback((dispute: Dispute) => {
    setSelectedDispute(dispute);
    setShowResolveModal(true);
  }, []);

  const handleEscalate = useCallback((dispute: Dispute) => {
    // Mettre ici la logique d'escalade du litige
    alert(`Escalade du litige ID: ${dispute.id}`);
  }, []);

  // Handlers pour les changements de formulaire
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

  // Soumission des formulaires
  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;
    console.log("Assignation du litige:", selectedDispute.id, assignFormData);
    // Logique de soumission API...
    handleCloseAssignModal();
    fetchDisputes();
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDispute) return;
    console.log("Résolution du litige:", selectedDispute.id, resolveFormData);
    // Logique de soumission API...
    handleCloseResolveModal();
    fetchDisputes();
  };

  // Champs pour la vue détaillée
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

  // Statistiques
  const stats = useMemo(
    () => [
      {
        label: "Total Litiges",
        value: disputes.length,
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-100",
      },
      {
        label: "En Cours",
        value: disputes.filter(
          (d) => d.status === "open" || d.status === "in-progress"
        ).length,
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      },
      {
        label: "Résolus",
        value: disputes.filter((d) => d.status === "resolved").length,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
    ],
    [disputes]
  );

  // Configuration de la page de management
  const config = useMemo(
    () => ({
      title: "Gestion des Litiges",
      description:
        "Suivi et résolution des litiges entre acheteurs et agriculteurs.",
      icon: AlertTriangle,
      stats,
      columns: () => columns,
      viewFields,
      // Les champs de formulaire, les valeurs par défaut et la validation
      // sont gérés par les modales spécifiques ci-dessous
      formFields: [],
      defaultFormData: {},
      validationRules: {},
    }),
    [stats, columns, viewFields]
  );

  return (
    <>
      <ManagementPage<Dispute>
        config={config}
        data={disputes}
        onAssign={handleAssign}
        onResolve={handleResolve}
        onEscalate={handleEscalate}
      />

      {/* Modal d'assignation */}
      {selectedDispute && (
        <Modal
          isOpen={showAssignModal}
          onClose={handleCloseAssignModal}
          title={`Assigner le litige #${selectedDispute.id}`}
          size="md"
        >
          <ModalForm
            onSubmit={handleAssignSubmit}
            onCancel={handleCloseAssignModal}
            submitText="Assigner"
            isLoading={isLoading}
          >
            <FormField
              label="Assigner à"
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
              placeholder="Ajouter un commentaire..."
              rows={3}
            />
          </ModalForm>
        </Modal>
      )}

      {/* Modal de résolution */}
      {selectedDispute && (
        <Modal
          isOpen={showResolveModal}
          onClose={handleCloseResolveModal}
          title={`Résoudre le litige #${selectedDispute.id}`}
          size="md"
        >
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
                  label: "En faveur de l'agriculteur",
                },
                { value: "resolved-buyer", label: "En faveur de l'acheteur" },
                { value: "resolved-partial", label: "Résolution partielle" },
                { value: "no-fault", label: "Aucune faute" },
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
              label="Compensation (HBAR)"
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
      )}
    </>
  );
};

export default DisputesManagement;
