import React, { useState, useMemo } from "react";
import {
  Shield,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  Calendar,
  Mail,
  Phone,
  User,
  Settings,
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

// Types pour la conformité RGPD
interface GDPRUser {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  userType: "farmer" | "buyer" | "logistics";
  status: "active" | "inactive" | "deleted";
  consentStatus: "granted" | "denied" | "withdrawn" | "pending";
  dataRetention: {
    personalData: string;
    transactionData: string;
    locationData: string;
    communicationData: string;
  };
  rights: {
    rightToAccess: boolean;
    rightToRectification: boolean;
    rightToErasure: boolean;
    rightToPortability: boolean;
    rightToObject: boolean;
  };
  lastConsentUpdate: string;
  dataProcessingPurposes: string[];
  thirdPartySharing: boolean;
  createdAt: string;
  lastActivity: string;
  dataExportRequests: number;
  deletionRequests: number;
}

// Données simulées
const mockGDPRUsers: GDPRUser[] = [
  {
    id: "1",
    userId: "F001",
    fullName: "Jean Kouassi",
    email: "jean.kouassi@email.com",
    phone: "+225 07 12 34 56 78",
    userType: "farmer",
    status: "active",
    consentStatus: "granted",
    dataRetention: {
      personalData: "2025-01-15",
      transactionData: "2027-01-15",
      locationData: "2025-01-15",
      communicationData: "2025-01-15",
    },
    rights: {
      rightToAccess: true,
      rightToRectification: true,
      rightToErasure: false,
      rightToPortability: true,
      rightToObject: true,
    },
    lastConsentUpdate: "2024-01-15T10:30:00Z",
    dataProcessingPurposes: [
      "service_provision",
      "transaction_processing",
      "communication",
    ],
    thirdPartySharing: false,
    createdAt: "2024-01-01T00:00:00Z",
    lastActivity: "2024-01-15T14:30:00Z",
    dataExportRequests: 0,
    deletionRequests: 0,
  },
  {
    id: "2",
    userId: "B001",
    fullName: "Marie Traoré",
    email: "marie.traore@restaurant.com",
    phone: "+225 05 98 76 54 32",
    userType: "buyer",
    status: "active",
    consentStatus: "granted",
    dataRetention: {
      personalData: "2025-01-10",
      transactionData: "2027-01-10",
      locationData: "2025-01-10",
      communicationData: "2025-01-10",
    },
    rights: {
      rightToAccess: true,
      rightToRectification: true,
      rightToErasure: false,
      rightToPortability: true,
      rightToObject: true,
    },
    lastConsentUpdate: "2024-01-10T14:20:00Z",
    dataProcessingPurposes: [
      "service_provision",
      "transaction_processing",
      "marketing",
    ],
    thirdPartySharing: true,
    createdAt: "2024-01-01T00:00:00Z",
    lastActivity: "2024-01-15T12:15:00Z",
    dataExportRequests: 1,
    deletionRequests: 0,
  },
  {
    id: "3",
    userId: "F002",
    fullName: "Ahmed Diallo",
    email: "ahmed.diallo@email.com",
    phone: "+225 06 11 22 33 44",
    userType: "farmer",
    status: "inactive",
    consentStatus: "withdrawn",
    dataRetention: {
      personalData: "2024-02-08",
      transactionData: "2024-02-08",
      locationData: "2024-02-08",
      communicationData: "2024-02-08",
    },
    rights: {
      rightToAccess: true,
      rightToRectification: true,
      rightToErasure: true,
      rightToPortability: true,
      rightToObject: true,
    },
    lastConsentUpdate: "2024-01-08T16:45:00Z",
    dataProcessingPurposes: [],
    thirdPartySharing: false,
    createdAt: "2024-01-01T00:00:00Z",
    lastActivity: "2024-01-08T16:45:00Z",
    dataExportRequests: 0,
    deletionRequests: 1,
  },
];

const GDPRCompliance: React.FC = () => {
  const [gdprUsers, setGdprUsers] = useState<GDPRUser[]>(mockGDPRUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [consentFilter, setConsentFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<GDPRUser | null>(null);
  const [exportFormat, setExportFormat] = useState("json");

  // Filtrage des données
  const filteredUsers = useMemo(() => {
    return gdprUsers.filter((user) => {
      const matchesSearch =
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.userId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      const matchesConsent =
        consentFilter === "all" || user.consentStatus === consentFilter;
      const matchesType = typeFilter === "all" || user.userType === typeFilter;

      return matchesSearch && matchesStatus && matchesConsent && matchesType;
    });
  }, [gdprUsers, searchTerm, statusFilter, consentFilter, typeFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fonctions utilitaires
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "Actif",
      },
      inactive: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        text: "Inactif",
      },
      deleted: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "Supprimé",
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

  const getConsentBadge = (consent: string) => {
    const consentConfig = {
      granted: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "Accordé",
      },
      denied: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "Refusé",
      },
      withdrawn: {
        color: "bg-orange-100 text-orange-800",
        icon: AlertTriangle,
        text: "Retiré",
      },
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
        text: "En attente",
      },
    };

    const config = consentConfig[consent as keyof typeof consentConfig];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = {
      farmer: { icon: Users, color: "text-green-600" },
      buyer: { icon: User, color: "text-blue-600" },
      logistics: { icon: Shield, color: "text-purple-600" },
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    const Icon = config.icon;
    return <Icon className={`h-4 w-4 ${config.color}`} />;
  };

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      farmer: "Agriculteur",
      buyer: "Acheteur",
      logistics: "Logistique",
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  // Actions
  const handleView = (user: GDPRUser) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleConsentManagement = (user: GDPRUser) => {
    setSelectedUser(user);
    setShowConsentModal(true);
  };

  const handleDataExport = (user: GDPRUser) => {
    setSelectedUser(user);
    setShowExportModal(true);
  };

  const handleDataDeletion = (user: GDPRUser) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmConsentUpdate = (newConsent: string) => {
    if (selectedUser) {
      setGdprUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                consentStatus: newConsent as "granted" | "denied" | "pending",
                lastConsentUpdate: new Date().toISOString(),
              }
            : user
        )
      );
      setShowConsentModal(false);
      setSelectedUser(null);
    }
  };

  const confirmDataExport = () => {
    if (selectedUser) {
      // Simulation d'export des données
      const userData = {
        personalInfo: {
          fullName: selectedUser.fullName,
          email: selectedUser.email,
          phone: selectedUser.phone,
          userType: selectedUser.userType,
        },
        consentHistory: {
          currentStatus: selectedUser.consentStatus,
          lastUpdate: selectedUser.lastConsentUpdate,
        },
        dataRetention: selectedUser.dataRetention,
        rights: selectedUser.rights,
        exportDate: new Date().toISOString(),
      };

      const dataStr =
        exportFormat === "json"
          ? JSON.stringify(userData, null, 2)
          : Object.entries(userData)
              .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
              .join("\n");

      const mimeType =
        exportFormat === "json" ? "application/json" : "text/plain";
      const blob = new Blob([dataStr], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gdpr-data-${selectedUser.userId}-${
        new Date().toISOString().split("T")[0]
      }.${exportFormat}`;
      a.click();
      window.URL.revokeObjectURL(url);

      // Mettre à jour le compteur
      setGdprUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? { ...user, dataExportRequests: user.dataExportRequests + 1 }
            : user
        )
      );

      setShowExportModal(false);
      setSelectedUser(null);
    }
  };

  const confirmDataDeletion = () => {
    if (selectedUser) {
      setGdprUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                status: "deleted" as const,
                consentStatus: "withdrawn" as const,
                deletionRequests: user.deletionRequests + 1,
              }
            : user
        )
      );
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const handleExport = () => {
    const data = filteredUsers.map((user) => ({
      "ID Utilisateur": user.userId,
      "Nom Complet": user.fullName,
      Email: user.email,
      Téléphone: user.phone,
      Type: getTypeLabel(user.userType),
      Statut: user.status,
      Consentement: user.consentStatus,
      "Dernière mise à jour": new Date(
        user.lastConsentUpdate
      ).toLocaleDateString("fr-FR"),
      "Partage tiers": user.thirdPartySharing ? "Oui" : "Non",
      "Demandes export": user.dataExportRequests,
      "Demandes suppression": user.deletionRequests,
    }));

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gdpr-compliance-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Configuration des colonnes
  const columns: ColumnDef<GDPRUser>[] = [
    {
      accessorKey: "userId",
      header: "ID Utilisateur",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(row.original.userType)}
          <span className="font-medium">{row.getValue("userId")}</span>
        </div>
      ),
    },
    {
      accessorKey: "fullName",
      header: "Nom Complet",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("fullName")}</div>
          <div className="text-sm text-gray-500">{row.original.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "userType",
      header: "Type",
      cell: ({ row }) => (
        <Badge className="bg-blue-100 text-blue-800">
          {getTypeLabel(row.getValue("userType"))}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "consentStatus",
      header: "Consentement",
      cell: ({ row }) => getConsentBadge(row.getValue("consentStatus")),
    },
    {
      accessorKey: "thirdPartySharing",
      header: "Partage Tiers",
      cell: ({ row }) => (
        <Badge
          className={
            row.getValue("thirdPartySharing")
              ? "bg-orange-100 text-orange-800"
              : "bg-green-100 text-green-800"
          }
        >
          {row.getValue("thirdPartySharing") ? "Oui" : "Non"}
        </Badge>
      ),
    },
    {
      accessorKey: "lastConsentUpdate",
      header: "Dernière MAJ",
      cell: ({ row }) => (
        <div className="text-sm">
          {new Date(row.getValue("lastConsentUpdate")).toLocaleDateString(
            "fr-FR"
          )}
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleConsentManagement(row.original)}
            className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
          >
            <Shield className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDataExport(row.original)}
            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
          >
            <Download className="h-4 w-4" />
          </Button>
          {row.original.rights.rightToErasure && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDataDeletion(row.original)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Statistiques
  const stats = useMemo(() => {
    const total = gdprUsers.length;
    const active = gdprUsers.filter((u) => u.status === "active").length;
    const consentGranted = gdprUsers.filter(
      (u) => u.consentStatus === "granted"
    ).length;
    const consentWithdrawn = gdprUsers.filter(
      (u) => u.consentStatus === "withdrawn"
    ).length;
    const totalExportRequests = gdprUsers.reduce(
      (sum, u) => sum + u.dataExportRequests,
      0
    );
    const totalDeletionRequests = gdprUsers.reduce(
      (sum, u) => sum + u.deletionRequests,
      0
    );

    return {
      total,
      active,
      consentGranted,
      consentWithdrawn,
      totalExportRequests,
      totalDeletionRequests,
    };
  }, [gdprUsers]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Conformité RGPD</h1>
          <p className="text-gray-600 mt-1">
            Gestion des données personnelles et droits des utilisateurs
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
            <Settings className="h-4 w-4" />
            Configuration RGPD
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Utilisateurs
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actifs</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.active}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Consentement Accordé
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.consentGranted}
              </p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Consentement Retiré
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.consentWithdrawn}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Exports Demandés
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {stats.totalExportRequests}
              </p>
            </div>
            <Download className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Suppressions Demandées
              </p>
              <p className="text-2xl font-bold text-red-600">
                {stats.totalDeletionRequests}
              </p>
            </div>
            <Trash2 className="h-8 w-8 text-red-600" />
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
              { value: "active", label: "Actif" },
              { value: "inactive", label: "Inactif" },
              { value: "deleted", label: "Supprimé" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Statut"
          />
          <FilterButton
            options={[
              { value: "all", label: "Tous les consentements" },
              { value: "granted", label: "Accordé" },
              { value: "denied", label: "Refusé" },
              { value: "withdrawn", label: "Retiré" },
              { value: "pending", label: "En attente" },
            ]}
            value={consentFilter}
            onChange={setConsentFilter}
            placeholder="Consentement"
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
        </div>
      </Card>

      {/* Tableau */}
      <Card className="p-6">
        <DataTable
          data={paginatedUsers}
          columns={columns}
          searchTerm=""
          onSearchChange={() => {}}
        />

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
        title="Détails RGPD"
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
                    <User className="h-5 w-5 text-gray-400" />
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
                      Créé le{" "}
                      {new Date(selectedUser.createdAt).toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Statut RGPD
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Statut:</span>
                    {getStatusBadge(selectedUser.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Consentement:</span>
                    {getConsentBadge(selectedUser.consentStatus)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Type:</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {getTypeLabel(selectedUser.userType)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Partage tiers:</span>
                    <Badge
                      className={
                        selectedUser.thirdPartySharing
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }
                    >
                      {selectedUser.thirdPartySharing ? "Oui" : "Non"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Rétention des données */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Rétention des Données
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedUser.dataRetention).map(
                  ([key, value]) => (
                    <div key={key} className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-600 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </div>
                      <div className="text-sm">
                        {new Date(value).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Droits */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Droits RGPD
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(selectedUser.rights).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      {value ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <span className="text-sm">{value ? "Oui" : "Non"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Finalités de traitement */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Finalités de Traitement
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedUser.dataProcessingPurposes.map((purpose, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800">
                    {purpose.replace(/_/g, " ")}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Statistiques */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Statistiques
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-blue-800 mb-1">
                    Demandes d'export
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedUser.dataExportRequests}
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-red-800 mb-1">
                    Demandes de suppression
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {selectedUser.deletionRequests}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de gestion du consentement */}
      <Modal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        title="Gestion du Consentement"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">
                  Gestion du Consentement
                </span>
              </div>
              <p className="text-sm text-blue-700">
                Gestion du consentement pour{" "}
                <strong>{selectedUser.fullName}</strong>. Le consentement actuel
                est : <strong>{selectedUser.consentStatus}</strong>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau statut de consentement
                </label>
                <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="granted">Accordé</option>
                  <option value="denied">Refusé</option>
                  <option value="withdrawn">Retiré</option>
                  <option value="pending">En attente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison du changement (optionnel)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Expliquez la raison de ce changement de consentement..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConsentModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={() => confirmConsentUpdate("granted")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Shield className="h-4 w-4 mr-2" />
                Mettre à jour
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal d'export des données */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export des Données Personnelles"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Download className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">
                  Droit à la portabilité
                </span>
              </div>
              <p className="text-sm text-green-700">
                Export des données personnelles de{" "}
                <strong>{selectedUser.fullName}</strong>. Les données seront
                exportées dans le format sélectionné.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Format d'export
              </label>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="json">JSON (Structured)</option>
                <option value="txt">TXT (Human Readable)</option>
                <option value="csv">CSV (Spreadsheet)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Données à inclure
              </label>
              <div className="space-y-2">
                {[
                  "Informations personnelles",
                  "Historique des transactions",
                  "Données de localisation",
                  "Communications",
                  "Préférences",
                ].map((item) => (
                  <label key={item} className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowExportModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={confirmDataExport}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Exporter les Données
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de suppression des données */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Suppression des Données Personnelles"
        size="md"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trash2 className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800">
                  Droit à l'effacement
                </span>
              </div>
              <p className="text-sm text-red-700">
                <strong>ATTENTION :</strong> Cette action supprimera
                définitivement toutes les données personnelles de{" "}
                <strong>{selectedUser.fullName}</strong>. Cette action est
                irréversible.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison de la suppression
              </label>
              <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent">
                <option value="user_request">Demande de l'utilisateur</option>
                <option value="consent_withdrawn">Consentement retiré</option>
                <option value="data_no_longer_needed">
                  Données plus nécessaires
                </option>
                <option value="legal_obligation">Obligation légale</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirmation
              </label>
              <input
                type="text"
                placeholder="Tapez 'SUPPRIMER' pour confirmer"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={confirmDataDeletion}
                className="bg-red-600 hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer Définitivement
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default GDPRCompliance;
