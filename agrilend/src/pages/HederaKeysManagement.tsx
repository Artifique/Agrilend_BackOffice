import React, { useState, useMemo } from 'react';
import { 
  Key, Shield, RotateCcw, Download, Eye, EyeOff,
  Plus, AlertTriangle, CheckCircle, Clock, Zap,
  Lock, Copy, Activity
} from 'lucide-react';
import { DataTable } from '../components/DataTable';
import { Modal } from '../components/Modal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { SearchInput } from '../components/ui/SearchInput';
import { FilterButton } from '../components/ui/FilterButton';
import { Pagination } from '../components/ui/Pagination';
import { ColumnDef } from '@tanstack/react-table';

// Types pour les clés Hedera
interface HederaKey {
  id: string;
  accountId: string;
  publicKey: string;
  privateKey?: string; // Masqué par défaut pour la sécurité
  keyType: 'main' | 'backup' | 'cold' | 'hot';
  status: 'active' | 'inactive' | 'expired' | 'compromised';
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
  permissions: string[];
  owner: {
    id: string;
    name: string;
    type: 'farmer' | 'buyer' | 'platform' | 'logistics';
  };
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  rotationSchedule?: string;
  nextRotation?: string;
  backupLocation?: string;
  notes?: string;
}

// Données simulées
const mockHederaKeys: HederaKey[] = [
  {
    id: '1',
    accountId: '0.0.1234567',
    publicKey: '302a300506032b6570032100a1b2c3d4e5f6...',
    keyType: 'main',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    lastUsed: '2024-01-15T14:30:00Z',
    usageCount: 1250,
    permissions: ['transfer', 'tokenize', 'stake'],
    owner: {
      id: 'F001',
      name: 'Jean Kouassi',
      type: 'farmer'
    },
    securityLevel: 'high',
    rotationSchedule: 'quarterly',
    nextRotation: '2024-04-01T00:00:00Z',
    backupLocation: 'Vault-Secure-001',
    notes: 'Clé principale pour transactions agricoles'
  },
  {
    id: '2',
    accountId: '0.0.2345678',
    publicKey: '302a300506032b6570032100b2c3d4e5f6a1...',
    keyType: 'backup',
    status: 'inactive',
    createdAt: '2024-01-01T00:00:00Z',
    lastUsed: '2024-01-10T09:15:00Z',
    usageCount: 45,
    permissions: ['transfer'],
    owner: {
      id: 'B001',
      name: 'Marie Traoré',
      type: 'buyer'
    },
    securityLevel: 'medium',
    rotationSchedule: 'monthly',
    nextRotation: '2024-02-01T00:00:00Z',
    backupLocation: 'Vault-Secure-002'
  },
  {
    id: '3',
    accountId: '0.0.3456789',
    publicKey: '302a300506032b6570032100c3d4e5f6a1b2...',
    keyType: 'cold',
    status: 'active',
    createdAt: '2023-12-15T00:00:00Z',
    usageCount: 12,
    permissions: ['tokenize', 'stake'],
    owner: {
      id: 'PLATFORM',
      name: 'AGRILEND Platform',
      type: 'platform'
    },
    securityLevel: 'critical',
    rotationSchedule: 'yearly',
    nextRotation: '2024-12-15T00:00:00Z',
    backupLocation: 'Cold-Storage-001',
    notes: 'Clé froide pour staking et tokenisation'
  },
  {
    id: '4',
    accountId: '0.0.4567890',
    publicKey: '302a300506032b6570032100d4e5f6a1b2c3...',
    keyType: 'hot',
    status: 'compromised',
    createdAt: '2024-01-05T00:00:00Z',
    lastUsed: '2024-01-12T16:45:00Z',
    usageCount: 890,
    permissions: ['transfer'],
    owner: {
      id: 'L001',
      name: 'Transport Express SARL',
      type: 'logistics'
    },
    securityLevel: 'low',
    notes: 'Clé compromise - rotation urgente requise'
  }
];

const HederaKeysManagement: React.FC = () => {
  const [hederaKeys, setHederaKeys] = useState<HederaKey[]>(mockHederaKeys);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [securityFilter, setSecurityFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showRotateModal, setShowRotateModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState<HederaKey | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState<{ [key: string]: boolean }>({});

  // Filtrage des données
  const filteredKeys = useMemo(() => {
    return hederaKeys.filter(key => {
      const matchesSearch = key.accountId.includes(searchTerm) ||
                          key.publicKey.includes(searchTerm) ||
                          key.owner.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || key.status === statusFilter;
      const matchesType = typeFilter === 'all' || key.keyType === typeFilter;
      const matchesSecurity = securityFilter === 'all' || key.securityLevel === securityFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesSecurity;
    });
  }, [hederaKeys, searchTerm, statusFilter, typeFilter, securityFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredKeys.length / itemsPerPage);
  const paginatedKeys = filteredKeys.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fonctions utilitaires
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Actif' },
      inactive: { color: 'bg-gray-100 text-gray-800', icon: Clock, text: 'Inactif' },
      expired: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, text: 'Expiré' },
      compromised: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, text: 'Compromis' }
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

  const getSecurityBadge = (level: string) => {
    const securityConfig = {
      low: { color: 'bg-red-100 text-red-800', text: 'Faible' },
      medium: { color: 'bg-yellow-100 text-yellow-800', text: 'Moyen' },
      high: { color: 'bg-blue-100 text-blue-800', text: 'Élevé' },
      critical: { color: 'bg-purple-100 text-purple-800', text: 'Critique' }
    };
    
    const config = securityConfig[level as keyof typeof securityConfig];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = {
      main: { icon: Key, color: 'text-blue-600' },
      backup: { icon: Shield, color: 'text-green-600' },
      cold: { icon: Lock, color: 'text-purple-600' },
      hot: { icon: Zap, color: 'text-orange-600' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig];
    const Icon = config.icon;
    return <Icon className={`h-4 w-4 ${config.color}`} />;
  };

  const getTypeLabel = (type: string) => {
    const typeLabels = {
      main: 'Principale',
      backup: 'Sauvegarde',
      cold: 'Froide',
      hot: 'Chaude'
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const getOwnerTypeLabel = (type: string) => {
    const typeLabels = {
      farmer: 'Agriculteur',
      buyer: 'Acheteur',
      platform: 'Plateforme',
      logistics: 'Logistique'
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  // Actions
  const handleView = (key: HederaKey) => {
    setSelectedKey(key);
    setShowViewModal(true);
  };

  const handleGenerateKey = () => {
    setShowGenerateModal(true);
  };

  const handleRotateKey = (key: HederaKey) => {
    setSelectedKey(key);
    setShowRotateModal(true);
  };

  const handleBackupKey = (key: HederaKey) => {
    setSelectedKey(key);
    setShowBackupModal(true);
  };

  const togglePrivateKeyVisibility = (keyId: string) => {
    setShowPrivateKey(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Ici vous pourriez ajouter une notification de succès
  };

  const confirmRotateKey = () => {
    if (selectedKey) {
      setHederaKeys(prev => prev.map(key => 
        key.id === selectedKey.id 
          ? { 
              ...key, 
              status: 'inactive' as const,
              lastUsed: new Date().toISOString()
            }
          : key
      ));
      setShowRotateModal(false);
      setSelectedKey(null);
    }
  };

  const confirmBackupKey = () => {
    if (selectedKey) {
      // Simulation de sauvegarde
      console.log(`Sauvegarde de la clé ${selectedKey.id}`);
      setShowBackupModal(false);
      setSelectedKey(null);
    }
  };

  const handleExport = () => {
    const data = filteredKeys.map(key => ({
      'ID Clé': key.id,
      'Account ID': key.accountId,
      'Type': getTypeLabel(key.keyType),
      'Statut': key.status,
      'Niveau Sécurité': key.securityLevel,
      'Propriétaire': key.owner.name,
      'Type Propriétaire': getOwnerTypeLabel(key.owner.type),
      'Créé le': new Date(key.createdAt).toLocaleDateString('fr-FR'),
      'Dernière utilisation': key.lastUsed ? new Date(key.lastUsed).toLocaleDateString('fr-FR') : 'N/A',
      'Utilisations': key.usageCount,
      'Permissions': key.permissions.join(', '),
      'Rotation': key.rotationSchedule || 'N/A',
      'Prochaine rotation': key.nextRotation ? new Date(key.nextRotation).toLocaleDateString('fr-FR') : 'N/A'
    }));

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hedera-keys-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Configuration des colonnes
  const columns: ColumnDef<HederaKey>[] = [
    {
      accessorKey: 'accountId',
      header: 'Account ID',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(row.original.keyType)}
          <span className="font-mono text-sm">{row.getValue('accountId')}</span>
        </div>
      )
    },
    {
      accessorKey: 'owner',
      header: 'Propriétaire',
      cell: ({ row }) => {
        const owner = row.original.owner;
        return (
          <div>
            <div className="font-medium">{owner.name}</div>
            <div className="text-sm text-gray-500">{getOwnerTypeLabel(owner.type)}</div>
          </div>
        );
      }
    },
    {
      accessorKey: 'keyType',
      header: 'Type',
      cell: ({ row }) => (
        <Badge className="bg-blue-100 text-blue-800">
          {getTypeLabel(row.getValue('keyType'))}
        </Badge>
      )
    },
    {
      accessorKey: 'status',
      header: 'Statut',
      cell: ({ row }) => getStatusBadge(row.getValue('status'))
    },
    {
      accessorKey: 'securityLevel',
      header: 'Sécurité',
      cell: ({ row }) => getSecurityBadge(row.getValue('securityLevel'))
    },
    {
      accessorKey: 'usageCount',
      header: 'Utilisations',
      cell: ({ row }) => (
        <div className="text-center">
          <span className="font-medium">{row.getValue('usageCount')}</span>
        </div>
      )
    },
    {
      accessorKey: 'lastUsed',
      header: 'Dernière utilisation',
      cell: ({ row }) => {
        const lastUsed = row.getValue('lastUsed') as string;
        return (
          <div className="text-sm">
            {lastUsed ? new Date(lastUsed).toLocaleDateString('fr-FR') : 'Jamais'}
          </div>
        );
      }
    },
    {
      id: 'actions',
      header: 'Actions',
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
          {row.original.status === 'active' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRotateKey(row.original)}
                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBackupKey(row.original)}
                className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
              >
                <Download className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  // Statistiques
  const stats = useMemo(() => {
    const total = hederaKeys.length;
    const active = hederaKeys.filter(k => k.status === 'active').length;
    const compromised = hederaKeys.filter(k => k.status === 'compromised').length;
    const critical = hederaKeys.filter(k => k.securityLevel === 'critical').length;
    const totalUsage = hederaKeys.reduce((sum, k) => sum + k.usageCount, 0);
    
    return { total, active, compromised, critical, totalUsage };
  }, [hederaKeys]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Clés Hedera</h1>
          <p className="text-gray-600 mt-1">Sécurité et gestion des clés blockchain</p>
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
          <Button
            onClick={handleGenerateKey}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Générer Clé
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clés</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Key className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actives</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compromises</p>
              <p className="text-2xl font-bold text-red-600">{stats.compromised}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critiques</p>
              <p className="text-2xl font-bold text-purple-600">{stats.critical}</p>
            </div>
            <Shield className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsage}</p>
            </div>
            <Activity className="h-8 w-8 text-gray-600" />
          </div>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <SearchInput
            placeholder="Rechercher par Account ID, clé publique ou propriétaire..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="flex-1 min-w-64"
          />
          <FilterButton
            options={[
              { value: 'all', label: 'Tous les statuts' },
              { value: 'active', label: 'Actif' },
              { value: 'inactive', label: 'Inactif' },
              { value: 'expired', label: 'Expiré' },
              { value: 'compromised', label: 'Compromis' }
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Statut"
          />
          <FilterButton
            options={[
              { value: 'all', label: 'Tous les types' },
              { value: 'main', label: 'Principale' },
              { value: 'backup', label: 'Sauvegarde' },
              { value: 'cold', label: 'Froide' },
              { value: 'hot', label: 'Chaude' }
            ]}
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="Type"
          />
          <FilterButton
            options={[
              { value: 'all', label: 'Tous les niveaux' },
              { value: 'low', label: 'Faible' },
              { value: 'medium', label: 'Moyen' },
              { value: 'high', label: 'Élevé' },
              { value: 'critical', label: 'Critique' }
            ]}
            value={securityFilter}
            onChange={setSecurityFilter}
            placeholder="Sécurité"
          />
        </div>
      </Card>

      {/* Tableau */}
      <Card className="p-6">
        <DataTable
          data={paginatedKeys}
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
        title="Détails de la Clé Hedera"
        size="xl"
      >
        {selectedKey && (
          <div className="space-y-6">
            {/* Informations générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Informations de la Clé</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Account ID:</span>
                    <span className="font-mono text-sm">{selectedKey.accountId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Type:</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {getTypeLabel(selectedKey.keyType)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Statut:</span>
                    {getStatusBadge(selectedKey.status)}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Niveau Sécurité:</span>
                    {getSecurityBadge(selectedKey.securityLevel)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Propriétaire</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Nom:</span>
                    <span className="text-sm">{selectedKey.owner.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Type:</span>
                    <Badge className="bg-green-100 text-green-800">
                      {getOwnerTypeLabel(selectedKey.owner.type)}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Utilisations:</span>
                    <span className="text-sm font-medium">{selectedKey.usageCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Créé le:</span>
                    <span className="text-sm">{new Date(selectedKey.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clé publique */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Clé Publique</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Clé publique (DER format)</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(selectedKey.publicKey)}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <code className="text-xs font-mono text-gray-800 break-all">
                  {selectedKey.publicKey}
                </code>
              </div>
            </div>

            {/* Clé privée (masquée par défaut) */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Clé Privée</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Clé privée (SENSIBLE)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePrivateKeyVisibility(selectedKey.id)}
                      className="h-8 w-8 p-0"
                    >
                      {showPrivateKey[selectedKey.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(selectedKey.privateKey || '')}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <code className="text-xs font-mono text-gray-800 break-all">
                  {showPrivateKey[selectedKey.id] 
                    ? (selectedKey.privateKey || 'Clé privée non disponible')
                    : '••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••'
                  }
                </code>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Permissions</h3>
              <div className="flex flex-wrap gap-2">
                {selectedKey.permissions.map((permission, index) => (
                  <Badge key={index} className="bg-blue-100 text-blue-800">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Rotation */}
            {selectedKey.rotationSchedule && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Rotation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-600 mb-1">Fréquence</div>
                    <div className="text-sm">{selectedKey.rotationSchedule}</div>
                  </div>
                  {selectedKey.nextRotation && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-gray-600 mb-1">Prochaine rotation</div>
                      <div className="text-sm">{new Date(selectedKey.nextRotation).toLocaleDateString('fr-FR')}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sauvegarde */}
            {selectedKey.backupLocation && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Sauvegarde</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Localisation de sauvegarde</span>
                  </div>
                  <div className="text-sm text-green-700">{selectedKey.backupLocation}</div>
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedKey.notes && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {selectedKey.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal de génération de clé */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Générer une Nouvelle Clé"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-blue-800">Génération de Clé Hedera</span>
            </div>
            <p className="text-sm text-blue-700">
              Une nouvelle paire de clés sera générée selon les standards de sécurité Hedera.
              La clé privée sera chiffrée et stockée de manière sécurisée.
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de clé
              </label>
              <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="main">Principale</option>
                <option value="backup">Sauvegarde</option>
                <option value="cold">Froide</option>
                <option value="hot">Chaude</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Propriétaire
              </label>
              <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="">Sélectionner un propriétaire...</option>
                <option value="F001">Jean Kouassi (Agriculteur)</option>
                <option value="B001">Marie Traoré (Acheteur)</option>
                <option value="L001">Transport Express SARL (Logistique)</option>
                <option value="PLATFORM">AGRILEND Platform</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau de sécurité
              </label>
              <select className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="medium">Moyen</option>
                <option value="high">Élevé</option>
                <option value="critical">Critique</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions
              </label>
              <div className="space-y-2">
                {['transfer', 'tokenize', 'stake', 'freeze'].map(permission => (
                  <label key={permission} className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm capitalize">{permission}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowGenerateModal(false)}
            >
              Annuler
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Key className="h-4 w-4 mr-2" />
              Générer la Clé
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal de rotation */}
      <Modal
        isOpen={showRotateModal}
        onClose={() => setShowRotateModal(false)}
        title="Rotation de Clé"
        size="md"
      >
        {selectedKey && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <RotateCcw className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Rotation de Clé</span>
              </div>
              <p className="text-sm text-yellow-700">
                Vous êtes sur le point de désactiver la clé <strong>{selectedKey.accountId}</strong>.
                Une nouvelle clé sera générée automatiquement.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Clé actuelle:</span>
                <span className="font-mono text-sm">{selectedKey.accountId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Propriétaire:</span>
                <span className="text-sm">{selectedKey.owner.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Utilisations:</span>
                <span className="text-sm font-medium">{selectedKey.usageCount}</span>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRotateModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={confirmRotateKey}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Désactiver et Roter
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de sauvegarde */}
      <Modal
        isOpen={showBackupModal}
        onClose={() => setShowBackupModal(false)}
        title="Sauvegarde de Clé"
        size="md"
      >
        {selectedKey && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Sauvegarde Sécurisée</span>
              </div>
              <p className="text-sm text-green-700">
                La clé sera sauvegardée dans un coffre-fort sécurisé avec chiffrement de niveau militaire.
              </p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Clé:</span>
                <span className="font-mono text-sm">{selectedKey.accountId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Type:</span>
                <span className="text-sm">{getTypeLabel(selectedKey.keyType)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Niveau Sécurité:</span>
                {getSecurityBadge(selectedKey.securityLevel)}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Localisation de sauvegarde
              </label>
              <input
                type="text"
                placeholder="Ex: Vault-Secure-003"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowBackupModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={confirmBackupKey}
                className="bg-green-600 hover:bg-green-700"
              >
                <Shield className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HederaKeysManagement;
