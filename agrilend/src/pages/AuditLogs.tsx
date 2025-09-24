import React, { useState, useMemo, useCallback } from "react";
import {
  FileText,
  Download,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Activity,
  Database,
  Key,
  DollarSign,
  Truck,
  Users,
  Settings,
  BarChart3,
  RefreshCw,
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
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

// Types pour les logs d'audit
interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userType: "admin" | "farmer" | "buyer" | "logistics" | "system";
  action: string;
  category:
    | "authentication"
    | "transaction"
    | "user_management"
    | "system"
    | "security"
    | "financial"
    | "logistics";
  severity: "low" | "medium" | "high" | "critical";
  status: "success" | "failure" | "warning" | "info";
  resource: string;
  resourceId?: string;
  details: {
    ipAddress?: string;
    userAgent?: string;
    location?: string;
    changes?: {
      field: string;
      oldValue: string | number | null | undefined; // Modified
      newValue: string | number | null | undefined; // Modified
    }[];
    metadata?: { [key: string]: string | number | boolean };
  };
  blockchainTxId?: string;
  hederaAccountId?: string;
  sessionId?: string;
  requestId?: string;
}

// Données simulées
const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2024-01-15T14:30:25Z",
    userId: "ADMIN001",
    userName: "Admin User",
    userType: "admin",
    action: "USER_CREATED",
    category: "user_management",
    severity: "medium",
    status: "success",
    resource: "User",
    resourceId: "F001",
    details: {
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "Abidjan, Côte d'Ivoire",
      changes: [
        { field: "status", oldValue: null, newValue: "active" },
        { field: "role", oldValue: null, newValue: "farmer" },
      ],
      metadata: { source: "admin_panel", reason: "manual_creation" },
    },
    sessionId: "sess_abc123",
    requestId: "req_xyz789",
  },
  {
    id: "2",
    timestamp: "2024-01-15T14:25:10Z",
    userId: "F001",
    userName: "Jean Kouassi",
    userType: "farmer",
    action: "LOGIN_SUCCESS",
    category: "authentication",
    severity: "low",
    status: "success",
    resource: "Authentication",
    details: {
      ipAddress: "192.168.1.150",
      userAgent:
        "Mozilla/5.0 (Android 10; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0",
      location: "Bouaké, Côte d'Ivoire",
      metadata: { loginMethod: "password", mfaUsed: false },
    },
    sessionId: "sess_def456",
    requestId: "req_abc123",
  },
  {
    id: "3",
    timestamp: "2024-01-15T14:20:45Z",
    userId: "B001",
    userName: "Marie Traoré",
    userType: "buyer",
    action: "TRANSACTION_CREATED",
    category: "transaction",
    severity: "high",
    status: "success",
    resource: "Transaction",
    resourceId: "TXN001",
    details: {
      ipAddress: "192.168.1.200",
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
      location: "Abidjan, Côte d'Ivoire",
      changes: [
        { field: "amount", oldValue: null, newValue: 125.5 },
        { field: "currency", oldValue: null, newValue: "EUR" },
        { field: "status", oldValue: null, newValue: "pending" },
      ],
      metadata: { paymentMethod: "hedera_token", escrowEnabled: true },
    },
    blockchainTxId: "0.0.1234567@1642251645.123456789",
    hederaAccountId: "0.0.2345678",
    sessionId: "sess_ghi789",
    requestId: "req_def456",
  },
  {
    id: "4",
    timestamp: "2024-01-15T14:15:30Z",
    userId: "SYSTEM",
    userName: "System",
    userType: "system",
    action: "KEY_ROTATION_COMPLETED",
    category: "security",
    severity: "critical",
    status: "success",
    resource: "HederaKey",
    resourceId: "KEY001",
    details: {
      changes: [
        { field: "status", oldValue: "active", newValue: "rotated" },
        {
          field: "lastRotation",
          oldValue: "2023-10-15T00:00:00Z",
          newValue: "2024-01-15T14:15:30Z",
        },
      ],
      metadata: { rotationType: "scheduled", newKeyId: "KEY002" },
    },
    blockchainTxId: "0.0.3456789@1642251330.987654321",
    hederaAccountId: "0.0.3456789",
    requestId: "req_sys001",
  },
  {
    id: "5",
    timestamp: "2024-01-15T14:10:15Z",
    userId: "ADMIN001",
    userName: "Admin User",
    userType: "admin",
    action: "KYC_APPROVED",
    category: "user_management",
    severity: "medium",
    status: "success",
    resource: "KYC",
    resourceId: "KYC001",
    details: {
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "Abidjan, Côte d'Ivoire",
      changes: [
        { field: "status", oldValue: "pending", newValue: "approved" },
        { field: "verificationScore", oldValue: 75, newValue: 95 },
      ],
      metadata: { reviewer: "ADMIN001", reviewDuration: "2h 15m" },
    },
    sessionId: "sess_abc123",
    requestId: "req_kyc001",
  },
  {
    id: "6",
    timestamp: "2024-01-15T14:05:00Z",
    userId: "L001",
    userName: "Transport Express SARL",
    userType: "logistics",
    action: "DELIVERY_STATUS_UPDATED",
    category: "logistics",
    severity: "medium",
    status: "success",
    resource: "Delivery",
    resourceId: "DEL001",
    details: {
      ipAddress: "192.168.1.250",
      userAgent:
        "Mozilla/5.0 (Android 11; Mobile; rv:78.0) Gecko/78.0 Firefox/78.0",
      location: "Yamoussoukro, Côte d'Ivoire",
      changes: [
        { field: "status", oldValue: "in_transit", newValue: "delivered" },
        {
          field: "deliveredAt",
          oldValue: null,
          newValue: "2024-01-15T14:05:00Z",
        },
      ],
      metadata: {
        driver: "Driver001",
        vehicle: "VEH001",
        gpsLat: 6.8276,
        gpsLng: -5.2893,
      },
    },
    sessionId: "sess_log001",
    requestId: "req_del001",
  },
  {
    id: "7",
    timestamp: "2024-01-15T14:00:20Z",
    userId: "UNKNOWN",
    userName: "Unknown User",
    userType: "system",
    action: "LOGIN_FAILED",
    category: "authentication",
    severity: "medium",
    status: "failure",
    resource: "Authentication",
    details: {
      ipAddress: "192.168.1.300",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "Unknown",
      metadata: {
        loginMethod: "password",
        failureReason: "invalid_credentials",
        attempts: 3,
        blocked: true,
      },
    },
    requestId: "req_fail001",
  },
  {
    id: "8",
    timestamp: "2024-01-15T13:55:45Z",
    userId: "ADMIN001",
    userName: "Admin User",
    userType: "admin",
    action: "PRICING_CONFIGURATION_UPDATED",
    category: "system",
    severity: "high",
    status: "success",
    resource: "Pricing",
    details: {
      ipAddress: "192.168.1.100",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      location: "Abidjan, Côte d'Ivoire",
      changes: [
        { field: "commissionRate", oldValue: 0.05, newValue: 0.06 },
        { field: "minimumOrder", oldValue: 50, newValue: 75 },
      ],
      metadata: {
        reason: "market_adjustment",
        effectiveDate: "2024-01-16T00:00:00Z",
      },
    },
    sessionId: "sess_abc123",
    requestId: "req_price001",
  },
];

const AuditLogs: React.FC = () => {
  const [auditLogs] = useState<AuditLog[]>(mockAuditLogs);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [userTypeFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  // Filtrage des données
  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || log.category === categoryFilter;
      const matchesSeverity =
        severityFilter === "all" || log.severity === severityFilter;
      const matchesStatus =
        statusFilter === "all" || log.status === statusFilter;
      const matchesUserType =
        userTypeFilter === "all" || log.userType === userTypeFilter;

      // Filtrage par date
      let matchesDate = true;
      if (dateRange !== "all") {
        const logDate = new Date(log.timestamp);
        const now = new Date();

        switch (dateRange) {
          case "today": {
            matchesDate = logDate.toDateString() === now.toDateString();
            break;
          }
          case "week": {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            matchesDate = logDate >= weekAgo;
            break;
          }
          case "month": {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            matchesDate = logDate >= monthAgo;
            break;
          }
        }
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSeverity &&
        matchesStatus &&
        matchesUserType &&
        matchesDate
      );
    });
  }, [
    auditLogs,
    searchTerm,
    categoryFilter,
    severityFilter,
    statusFilter,
    userTypeFilter,
    dateRange,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fonctions utilitaires
  const getSeverityBadge = useCallback((severity: AuditLog["severity"]) => {
    const severityConfig = {
      low: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "Faible",
      },
      medium: {
        color: "bg-yellow-100 text-yellow-800",
        icon: AlertTriangle,
        text: "Moyen",
      },
      high: {
        color: "bg-orange-100 text-orange-800",
        icon: AlertTriangle,
        text: "Élevé",
      },
      critical: {
        color: "bg-red-100 text-red-800",
        icon: AlertTriangle,
        text: "Critique",
      },
    };

    const config = severityConfig[severity];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  }, []);

  const getStatusBadge = useCallback((status: AuditLog["status"]) => {
    const statusConfig = {
      success: {
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
        text: "Succès",
      },
      failure: {
        color: "bg-red-100 text-red-800",
        icon: XCircle,
        text: "Échec",
      },
      warning: {
        color: "bg-yellow-100 text-yellow-800",
        icon: AlertTriangle,
        text: "Avertissement",
      },
      info: {
        color: "bg-blue-100 text-blue-800",
        icon: Activity,
        text: "Info",
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  }, []);

  const getCategoryIcon = useCallback((category: AuditLog["category"]) => {
    const categoryConfig = {
      authentication: { icon: Shield, color: "text-blue-600" },
      transaction: { icon: DollarSign, color: "text-green-600" },
      user_management: { icon: Users, color: "text-purple-600" },
      system: { icon: Settings, color: "text-gray-600" },
      security: { icon: Key, color: "text-red-600" },
      financial: { icon: BarChart3, color: "text-yellow-600" },
      logistics: { icon: Truck, color: "text-orange-600" },
    };

    const config = categoryConfig[category];
    const Icon = config.icon;
    return <Icon className={`h-4 w-4 ${config.color}`} />;
  }, []);

  const getCategoryLabel = useCallback((category: AuditLog["category"]) => {
    const categoryLabels = {
      authentication: "Authentification",
      transaction: "Transaction",
      user_management: "Gestion Utilisateurs",
      system: "Système",
      security: "Sécurité",
      financial: "Financier",
      logistics: "Logistique",
    };
    return categoryLabels[category] || category;
  }, []);

  const getUserTypeLabel = useCallback((type: AuditLog["userType"]) => {
    const typeLabels = {
      admin: "Administrateur",
      farmer: "Agriculteur",
      buyer: "Acheteur",
      logistics: "Logistique",
      system: "Système",
    };
    return typeLabels[type] || type;
  }, []);

  // Actions
  const handleView = useCallback((log: AuditLog) => {
    setSelectedLog(log);
    setShowViewModal(true);
  }, []);

  const handleExport = useCallback(() => {
    const data = filteredLogs.map((log) => ({
      ID: log.id,
      Timestamp: new Date(log.timestamp).toLocaleString("fr-FR"),
      Utilisateur: log.userName,
      "Type Utilisateur": getUserTypeLabel(log.userType),
      Action: log.action,
      Catégorie: getCategoryLabel(log.category),
      Sévérité: log.severity,
      Statut: log.status,
      Ressource: log.resource,
      "ID Ressource": log.resourceId || "N/A",
      "Adresse IP": log.details.ipAddress || "N/A",
      Localisation: log.details.location || "N/A",
      "Transaction Blockchain": log.blockchainTxId || "N/A",
      "Account Hedera": log.hederaAccountId || "N/A",
      "Session ID": log.sessionId || "N/A",
      "Request ID": log.requestId || "N/A",
    }));

    const csv = [
      Object.keys(data[0]).join(","),
      ...data.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }, [filteredLogs, getUserTypeLabel, getCategoryLabel]);

  const handleRefresh = useCallback(() => {
    // Simulation de rafraîchissement des données
    console.log("Rafraîchissement des logs d'audit...");
  }, []);

  // Configuration des colonnes
  const columnHelper = createColumnHelper<AuditLog>(); // Define columnHelper here

  const columns: ColumnDef<AuditLog, unknown>[] = useMemo(
    () => [
      columnHelper.accessor("timestamp", {
        header: "Date/Heure",
        cell: (info) => (
          <div className="text-sm">
            <div className="font-medium">
              {new Date(info.getValue() as string).toLocaleDateString("fr-FR")}
            </div>
            <div className="text-gray-500">
              {new Date(info.getValue() as string).toLocaleTimeString("fr-FR")}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("userName", {
        header: "Utilisateur",
        cell: (info) => {
          const log = info.row.original;
          return (
            <div>
              <div className="font-medium">{log.userName}</div>
              <div className="text-sm text-gray-500">
                {getUserTypeLabel(log.userType)}
              </div>
            </div>
          );
        },
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: (info) => {
          const log = info.row.original;
          return (
            <div className="flex items-center gap-2">
              {getCategoryIcon(log.category)}
              <span className="font-medium">{log.action}</span>
            </div>
          );
        },
      }),
      columnHelper.accessor("category", {
        header: "Catégorie",
        cell: (info) => (
          <Badge className="bg-blue-100 text-blue-800">
            {getCategoryLabel(info.getValue() as AuditLog["category"])}
          </Badge>
        ),
      }),
      columnHelper.accessor("severity", {
        header: "Sévérité",
        cell: (info) =>
          getSeverityBadge(info.getValue() as AuditLog["severity"]),
      }),
      columnHelper.accessor("status", {
        header: "Statut",
        cell: (info) => getStatusBadge(info.getValue() as AuditLog["status"]),
      }),
      columnHelper.accessor("resource", {
        header: "Ressource",
        cell: (info) => {
          const log = info.row.original;
          return (
            <div>
              <div className="font-medium">{log.resource}</div>
              {log.resourceId && (
                <div className="text-sm text-gray-500">{log.resourceId}</div>
              )}
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <Button
            variant="secondary" // Changed from "outline"
            size="sm"
            onClick={() => handleView(info.row.original)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
        ),
      }),
    ],
    [
      columnHelper,
      getSeverityBadge,
      getStatusBadge,
      getCategoryIcon,
      getCategoryLabel,
      getUserTypeLabel,
      handleView,
    ]
  );

  // Statistiques
  const stats = useMemo(() => {
    const total = auditLogs.length;
    const critical = auditLogs.filter((l) => l.severity === "critical").length;
    const failures = auditLogs.filter((l) => l.status === "failure").length;
    const today = auditLogs.filter((l) => {
      const logDate = new Date(l.timestamp);
      const now = new Date();
      return logDate.toDateString() === now.toDateString();
    }).length;
    const blockchainTxs = auditLogs.filter((l) => l.blockchainTxId).length;

    return { total, critical, failures, today, blockchainTxs };
  }, [auditLogs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Journalisation et Traçabilité
          </h1>
          <p className="text-gray-600 mt-1">
            Logs d'audit et traçabilité complète des actions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
          <Button
            variant="secondary"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Logs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critiques</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.critical}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Échecs</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.failures}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
              <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Transactions BC
              </p>
              <p className="text-2xl font-bold text-green-600">
                {stats.blockchainTxs}
              </p>
            </div>
            <Database className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <SearchInput
            placeholder="Rechercher par action, utilisateur, ressource..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="flex-1 min-w-64"
          />
          <FilterButton
            options={[
              { value: "all", label: "Toutes les catégories" },
              { value: "authentication", label: "Authentification" },
              { value: "transaction", label: "Transaction" },
              { value: "user_management", label: "Gestion Utilisateurs" },
              { value: "system", label: "Système" },
              { value: "security", label: "Sécurité" },
              { value: "financial", label: "Financier" },
              { value: "logistics", label: "Logistique" },
            ]}
            value={categoryFilter}
            onChange={setCategoryFilter}
            placeholder="Catégorie"
          />
          <FilterButton
            options={[
              { value: "all", label: "Toutes les sévérités" },
              { value: "low", label: "Faible" },
              { value: "medium", label: "Moyen" },
              { value: "high", label: "Élevé" },
              { value: "critical", label: "Critique" },
            ]}
            value={severityFilter}
            onChange={setSeverityFilter}
            placeholder="Sévérité"
          />
          <FilterButton
            options={[
              { value: "all", label: "Tous les statuts" },
              { value: "success", label: "Succès" },
              { value: "failure", label: "Échec" },
              { value: "warning", label: "Avertissement" },
              { value: "info", label: "Info" },
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Statut"
          />
          <FilterButton
            options={[
              { value: "all", label: "Toutes les périodes" },
              { value: "today", label: "Aujourd'hui" },
              { value: "week", label: "Cette semaine" },
              { value: "month", label: "Ce mois" },
            ]}
            value={dateRange}
            onChange={setDateRange}
            placeholder="Période"
          />
        </div>
      </Card>

      {/* Tableau */}
      <Card className="p-6">
        <DataTable data={paginatedLogs} columns={columns} />

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
        title="Détails du Log d'Audit"
        size="xl"
      >
        {selectedLog && (
          <div className="space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Informations Générales
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      ID Log:
                    </span>
                    <span className="font-mono text-sm">{selectedLog.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Timestamp:
                    </span>
                    <span className="text-sm">
                      {new Date(selectedLog.timestamp).toLocaleString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Action:
                    </span>
                    <span className="text-sm font-medium">
                      {selectedLog.action}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Catégorie:
                    </span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {getCategoryLabel(selectedLog.category)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Utilisateur et Statut
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Utilisateur:
                    </span>
                    <span className="text-sm">{selectedLog.userName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Type:
                    </span>
                    <Badge className="bg-green-100 text-green-800">
                      {getUserTypeLabel(selectedLog.userType)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Sévérité:
                    </span>
                    {getSeverityBadge(selectedLog.severity)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Statut:
                    </span>
                    {getStatusBadge(selectedLog.status)}
                  </div>
                </div>
              </div>
            </div>

            {/* Ressource */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Ressource
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Ressource
                    </div>
                    <div className="text-sm font-medium">
                      {selectedLog.resource}
                    </div>
                  </div>
                  {selectedLog.resourceId && (
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">
                        ID Ressource
                      </div>
                      <div className="text-sm font-mono">
                        {selectedLog.resourceId}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Détails techniques */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Détails Techniques
              </h3>
              <div className="space-y-4">
                {selectedLog.details.ipAddress && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">
                          Adresse IP
                        </div>
                        <div className="text-sm font-mono">
                          {selectedLog.details.ipAddress}
                        </div>
                      </div>
                      {selectedLog.details.location && (
                        <div>
                          <div className="text-sm font-medium text-gray-600 mb-1">
                            Localisation
                          </div>
                          <div className="text-sm">
                            {selectedLog.details.location}
                          </div>
                        </div>
                      )}
                      {selectedLog.sessionId && (
                        <div>
                          <div className="text-sm font-medium text-gray-600 mb-1">
                            Session ID
                          </div>
                          <div className="text-sm font-mono">
                            {selectedLog.sessionId}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedLog.details.userAgent && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      User Agent
                    </div>
                    <div className="text-xs font-mono break-all">
                      {selectedLog.details.userAgent}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Changements */}
            {selectedLog.details.changes &&
              selectedLog.details.changes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Changements
                  </h3>
                  <div className="space-y-2">
                    {selectedLog.details.changes.map((change, index) => (
                      <div
                        key={index}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                      >
                        <div className="text-sm font-medium text-blue-800 mb-2">
                          {change.field}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div>
                            <div className="text-gray-600">
                              Ancienne valeur:
                            </div>
                            <div className="font-mono">
                              {JSON.stringify(change.oldValue)}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">
                              Nouvelle valeur:
                            </div>
                            <div className="font-mono">
                              {JSON.stringify(change.newValue)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Blockchain */}
            {(selectedLog.blockchainTxId || selectedLog.hederaAccountId) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Blockchain
                </h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedLog.blockchainTxId && (
                      <div>
                        <div className="text-sm font-medium text-green-800 mb-1">
                          Transaction ID
                        </div>
                        <div className="text-sm font-mono">
                          {selectedLog.blockchainTxId}
                        </div>
                      </div>
                    )}
                    {selectedLog.hederaAccountId && (
                      <div>
                        <div className="text-sm font-medium text-green-800 mb-1">
                          Account Hedera
                        </div>
                        <div className="text-sm font-mono">
                          {selectedLog.hederaAccountId}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Métadonnées */}
            {selectedLog.details.metadata &&
              Object.keys(selectedLog.details.metadata).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Métadonnées
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-xs font-mono text-gray-800 whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.details.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AuditLogs;
