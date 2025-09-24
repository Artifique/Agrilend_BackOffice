import React, { useState, useMemo, useEffect } from "react";
import {
  UserCheck,
  Download,
  Upload,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  Shield,
  Users,
  Calendar,
  Phone,
  Mail,
} from "lucide-react";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import {
  Button,
  Badge,
  Card,
  SearchInput,
  FilterButton,
  Pagination,
} from "../components/ui";
import { ColumnDef } from "@tanstack/react-table";

// Types pour KYC
interface KYCUser {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: "farmer" | "buyer" | "logistics"; // Renamed from userType to align with users.role
  kycStatus: "pending" | "approved" | "rejected" | "expired"; // Renamed from status
  kycSubmittedAt: string; // Renamed from submittedAt
  kycReviewedAt?: string; // Renamed from reviewedAt
  kycReviewedBy?: string; // Renamed from reviewedBy
  documents: {
    idCardUrl?: string; // Simplified to URL only
    addressProofUrl?: string; // Simplified to URL only
    businessLicenseUrl?: string; // Simplified to URL only
    taxCertificateUrl?: string; // Simplified to URL only
  };
  verificationScore: number;
  riskLevel: "low" | "medium" | "high";
  kycNotes?: string; // Renamed from notes
  kycRejectionReason?: string; // Renamed from rejectionReason
}

const KYCManagement: React.FC = () => {
  const [kycUsers, setKycUsers] = useState<KYCUser[]>([]); // State to hold fetched KYC users
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<KYCUser | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to simulate fetching KYC users from an API
  const fetchKYCUsers = async () => {
    setIsLoading(true);
    // In a real application, this would be an API call
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockKYCUsers: KYCUser[] = [
      {
        id: "1",
        userId: "F001",
        fullName: "Jean Kouassi",
        email: "jean.kouassi@email.com",
        phone: "+225 07 12 34 56 78",
        role: "farmer",
        kycStatus: "pending",
        kycSubmittedAt: "2024-01-15T10:30:00Z",
        documents: {
          idCardUrl: "/documents/id_001.pdf",
          addressProofUrl: "/documents/address_001.pdf",
          businessLicenseUrl: "/documents/business_001.pdf",
        },
        verificationScore: 75,
        riskLevel: "low",
        kycNotes: "Agriculteur expérimenté avec 10 ans d'expérience",
      },
      {
        id: "2",
        userId: "B001",
        fullName: "Marie Traoré",
        email: "marie.traore@restaurant.com",
        phone: "+225 05 98 76 54 32",
        role: "buyer",
        kycStatus: "approved",
        kycSubmittedAt: "2024-01-10T14:20:00Z",
        kycReviewedAt: "2024-01-12T09:15:00Z",
        kycReviewedBy: "Admin User",
        documents: {
          idCardUrl: "/documents/id_002.pdf",
          addressProofUrl: "/documents/address_002.pdf",
          businessLicenseUrl: "/documents/business_002.pdf",
          taxCertificateUrl: "/documents/tax_002.pdf",
        },
        verificationScore: 95,
        riskLevel: "low",
        kycNotes: "Restauratrice avec établissement vérifié",
      },
      {
        id: "3",
        userId: "F002",
        fullName: "Ahmed Diallo",
        email: "ahmed.diallo@email.com",
        phone: "+225 06 11 22 33 44",
        role: "farmer",
        kycStatus: "rejected",
        kycSubmittedAt: "2024-01-08T16:45:00Z",
        kycReviewedAt: "2024-01-09T11:30:00Z",
        kycReviewedBy: "Admin User",
        documents: {
          idCardUrl: "/documents/id_003.pdf",
          businessLicenseUrl: "/documents/business_003.pdf",
        },
        verificationScore: 45,
        riskLevel: "high",
        kycNotes: "Documents incomplets",
        kycRejectionReason: "Justificatif de domicile manquant",
      },
      {
        id: "4",
        userId: "L001",
        fullName: "Transport Express SARL",
        email: "contact@transport-express.ci",
        phone: "+225 20 30 40 50",
        role: "logistics",
        kycStatus: "approved",
        kycSubmittedAt: "2024-01-05T08:15:00Z",
        kycReviewedAt: "2024-01-07T14:20:00Z",
        kycReviewedBy: "Admin User",
        documents: {
          idCardUrl: "/documents/id_004.pdf",
          addressProofUrl: "/documents/address_004.pdf",
          businessLicenseUrl: "/documents/business_004.pdf",
          taxCertificateUrl: "/documents/tax_004.pdf",
        },
        verificationScore: 98,
        riskLevel: "low",
        kycNotes: "Entreprise de transport agréée",
      },
    ];
    setKycUsers(mockKYCUsers);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchKYCUsers();
  }, []); // Fetch KYC users on component mount

  // Filtrage des données
  const filteredUsers = useMemo(() => {
    return kycUsers.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || user.kycStatus === statusFilter;
      const matchesType = typeFilter === "all" || user.role === typeFilter;
      const matchesRisk = riskFilter === "all" || user.riskLevel === riskFilter;

      return matchesSearch && matchesStatus && matchesType && matchesRisk;
    });
  }, [kycUsers, searchTerm, statusFilter, typeFilter, riskFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(
    () =>
      filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [filteredUsers, currentPage, itemsPerPage]
  );

  // Fonctions utilitaires
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        text: "En attente",
      },
      approved: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "Approuvé",
      },
      rejected: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "Rejeté",
      },
      expired: {
        color: "bg-gray-100 text-gray-800",
        icon: AlertTriangle,
        text: "Expiré",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getRiskBadge = (risk: string) => {
    const riskConfig = {
      low: { color: "bg-green-100 text-green-800", text: "Faible" },
      medium: { color: "bg-yellow-100 text-yellow-800", text: "Moyen" },
      high: { color: "bg-red-100 text-red-800", text: "Élevé" },
    };

    const config = riskConfig[risk as keyof typeof riskConfig];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = {
      farmer: { icon: Users, color: "text-green-600" },
      buyer: { icon: UserCheck, color: "text-blue-600" },
      logistics: { icon: Shield, color: "text-purple-600" },
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    const Icon = config.icon;
    return <Icon className={`h-4 w-4 ${config.color}`} />;
  };

  // Actions
  const handleView = (user: KYCUser) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleApprove = (user: KYCUser) => {
    setSelectedUser(user);
    setApprovalNotes(user.kycNotes || "");
    setShowApproveModal(true);
  };

  const handleReject = (user: KYCUser) => {
    setSelectedUser(user);
    setRejectionReason(user.kycRejectionReason || "");
    setShowRejectModal(true);
  };

  const confirmApprove = async () => {
    if (selectedUser) {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call to approve KYC
        // Example: await fetch(`/api/kyc-users/${selectedUser.id}/approve`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ approvalNotes }),
        // });
        await new Promise((resolve) => setTimeout(resolve, 500));
        alert("KYC approuvé avec succès !");
        setShowApproveModal(false);
        setSelectedUser(null);
        setApprovalNotes("");
        fetchKYCUsers(); // Refresh KYC users list
      } catch (error) {
        console.error("Error approving KYC:", error);
        alert("Erreur lors de l'approbation du KYC.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const confirmReject = async () => {
    if (selectedUser) {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call to reject KYC
        // Example: await fetch(`/api/kyc-users/${selectedUser.id}/reject`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ rejectionReason }),
        // });
        await new Promise((resolve) => setTimeout(resolve, 500));
        alert("KYC rejeté avec succès !");
        setShowRejectModal(false);
        setSelectedUser(null);
        setRejectionReason("");
        fetchKYCUsers(); // Refresh KYC users list
      } catch (error) {
        console.error("Error rejecting KYC:", error);
        alert("Erreur lors du rejet du KYC.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleExport = () => {
    const data = filteredUsers.map((user) => ({
      "ID Utilisateur": user.userId,
      "Nom Complet": user.fullName,
      Email: user.email,
      Téléphone: user.phone,
      Type: user.role,
      Statut: user.kycStatus,
      "Score de Vérification": user.verificationScore,
      "Niveau de Risque": user.riskLevel,
      "Date de Soumission": new Date(user.kycSubmittedAt).toLocaleDateString(
        "fr-FR"
      ),
      "Date de Révision": user.kycReviewedAt
        ? new Date(user.kycReviewedAt).toLocaleDateString("fr-FR")
        : "N/A",
      "Révisé par": user.kycReviewedBy || "N/A",
    }));

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kyc-users-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Configuration des colonnes
  const columns: ColumnDef<KYCUser>[] = [
    {
      accessorKey: "userId",
      header: "ID Utilisateur",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(row.original.role)}
          <span className="font-medium">{row.original.userId}</span>
        </div>
      ),
    },
    {
      accessorKey: "fullName",
      header: "Nom Complet",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.fullName}</div>
          <div className="text-sm text-gray-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Type",
      cell: ({ row }) => {
        const typeLabels = {
          farmer: "Agriculteur",
          buyer: "Acheteur",
          logistics: "Logistique",
        };
        return (
          <Badge className="bg-blue-100 text-blue-800">
            {typeLabels[row.original.role as keyof typeof typeLabels]}
          </Badge>
        );
      },
    },
    {
      accessorKey: "kycStatus",
      header: "Statut",
      cell: ({ row }) => getStatusBadge(row.original.kycStatus),
    },
    {
      accessorKey: "verificationScore",
      header: "Score",
      cell: ({ row }) => {
        const score = row.original.verificationScore;
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  score >= 80
                    ? "bg-green-500"
                    : score >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-sm font-medium">{score}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: "riskLevel",
      header: "Risque",
      cell: ({ row }) => getRiskBadge(row.original.riskLevel),
    },
    {
      accessorKey: "kycSubmittedAt",
      header: "Soumis le",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.original.kycSubmittedAt).toLocaleDateString("fr-FR")}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleView(row.original)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.original.kycStatus === "pending" && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleApprove(row.original)}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReject(row.original)}
                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  // Statistiques
  const stats = useMemo(() => {
    const total = kycUsers.length;
    const pending = kycUsers.filter((u) => u.kycStatus === "pending").length;
    const approved = kycUsers.filter((u) => u.kycStatus === "approved").length;
    const rejected = kycUsers.filter((u) => u.kycStatus === "rejected").length;
    const highRisk = kycUsers.filter((u) => u.riskLevel === "high").length;

    return { total, pending, approved, rejected, highRisk };
  }, [kycUsers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion KYC</h1>
          <p className="text-gray-600 mt-1">
            Validation des identités et conformité réglementaire
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Importer Documents
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En attente</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approuvés</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.approved}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejetés</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.rejected}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Risque élevé</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.highRisk}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <SearchInput
            placeholder="Rechercher par nom, email ou ID..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="flex-1 min-w-64"
          />
          <FilterButton
            options={[
              { value: "all", label: "Tous les statuts" },
              { value: "pending", label: "En attente" },
              { value: "approved", label: "Approuvé" },
              { value: "rejected", label: "Rejeté" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Statut"
          />
          <FilterButton
            options={[
              { value: "all", label: "Tous les types" },
              { value: "farmer", label: "Agriculteur" },
              { value: "buyer", label: "Acheteur" },
              { value: "logistics", label: "Logistique" },
            ]}
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="Type"
          />
          <FilterButton
            options={[
              { value: "all", label: "Tous les risques" },
              { value: "low", label: "Faible" },
              { value: "medium", label: "Moyen" },
              { value: "high", label: "Élevé" },
            ]}
            value={riskFilter}
            onChange={setRiskFilter}
            placeholder="Risque"
          />
        </div>
      </Card>

      {/* Tableau */}
      <Card className="p-6">
        <DataTable data={paginatedUsers} columns={columns} />

        {totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Modal de visualisation */}
      <Modal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Détails KYC"
        size="xl"
      >
        {selectedUser && (
          <div className="space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Informations Personnelles
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">{selectedUser.fullName}</p>
                      <p className="text-sm text-gray-500">
                        ID: {selectedUser.userId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">{selectedUser.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-sm">
                      Soumis le{" "}
                      {new Date(selectedUser.kycSubmittedAt).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Statut et Vérification
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Statut:</span>
                    {getStatusBadge(selectedUser.kycStatus)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Type:</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {selectedUser.role === "farmer"
                        ? "Agriculteur"
                        : selectedUser.role === "buyer"
                        ? "Acheteur"
                        : "Logistique"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Score:</span>
                    <span className="font-medium">
                      {selectedUser.verificationScore}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Risque:</span>
                    {getRiskBadge(selectedUser.riskLevel)}
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedUser.documents).map(
                  ([key, url]) =>
                    url && (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium capitalize">
                            {key === "idCardUrl"
                              ? "Pièce d'identité"
                              : key === "addressProofUrl"
                              ? "Justificatif de domicile"
                              : key === "businessLicenseUrl"
                              ? "Licence commerciale"
                              : "Certificat fiscal"}
                          </span>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />{" "}
                            {/* Assuming uploaded means verified for now */}
                            <Shield className="h-4 w-4 text-blue-500" />{" "}
                            {/* Placeholder for verified status */}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(url, "_blank")}
                          className="w-full"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Voir le document
                        </Button>
                      </div>
                    )
                )}
              </div>
            </div>

            {/* Notes */}
            {selectedUser.kycNotes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Notes
                </h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedUser.kycNotes}
                </p>
              </div>
            )}

            {/* Raison de rejet */}
            {selectedUser.kycRejectionReason && (
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-2">
                  Raison de rejet
                </h3>
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  {selectedUser.kycRejectionReason}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal d'approbation */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approuver KYC"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Approbation KYC
                </span>
              </div>
              <p className="text-sm text-green-700">
                Vous êtes sur le point d'approuver le KYC de{" "}
                <strong>{selectedUser.fullName}</strong>. Cette action ne peut
                pas être annulée.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes d'approbation (optionnel)
              </label>
              <textarea
                value={approvalNotes}
                onChange={(e) => setApprovalNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder="Ajoutez des notes sur cette approbation..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowApproveModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={confirmApprove}
loading={isLoading}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approuver
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de rejet */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Rejeter KYC"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">Rejet KYC</span>
              </div>
              <p className="text-sm text-red-700">
                Vous êtes sur le point de rejeter le KYC de{" "}
                <strong>{selectedUser.fullName}</strong>. Veuillez fournir une
                raison claire pour ce rejet.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison du rejet *
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={3}
                placeholder="Expliquez pourquoi ce KYC est rejeté..."
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRejectModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={confirmReject}
                disabled={!rejectionReason.trim()}
                className="bg-red-600 hover:bg-red-700"
                loading={isLoading}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeter
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default KYCManagement;
