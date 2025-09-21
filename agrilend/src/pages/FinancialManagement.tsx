import React, { useState, useMemo, useCallback } from 'react';
import { DollarSign, CheckCircle, XCircle, Clock, Wallet, Shield, Activity, Coins, Zap } from 'lucide-react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { ManagementPage } from '../components/ManagementPage';
import Modal from '../components/Modal';
import ModalForm from '../components/ModalForm';
import FormField from '../components/FormField';

// Type pour les transactions financières
interface FinancialTransaction {
  id: number;
  type: 'sequester' | 'release' | 'staking' | 'fee' | 'refund';
  orderId: number;
  farmer: string;
  buyer: string;
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  hederaTxId?: string;
  platformFee?: number;
  stakingReward?: number;
}

// Composant spécialisé pour les actions financières
interface FinancialActionsProps {
  transaction: FinancialTransaction;
  onApprove: (transaction: FinancialTransaction) => void;
  onReject: (transaction: FinancialTransaction) => void;
  onStake: (transaction: FinancialTransaction) => void;
}

const FinancialActions: React.FC<FinancialActionsProps> = ({ transaction, onApprove, onReject, onStake }) => {
  const getTypeColor = (type: FinancialTransaction['type']) => {
    switch (type) {
      case 'sequester': return 'bg-blue-100 text-blue-800';
      case 'release': return 'bg-green-100 text-green-800';
      case 'staking': return 'bg-purple-100 text-purple-800';
      case 'fee': return 'bg-orange-100 text-orange-800';
      case 'refund': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: FinancialTransaction['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Informations de la transaction */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Informations Générales</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium w-20">Type:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                  {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Montant:</span>
                <span className="font-semibold">{transaction.amount.toLocaleString()} FCFA</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Statut:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Détails</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Commande:</span>
                <span className="ml-2">#{transaction.orderId}</span>
              </div>
              <div className="flex items-center">
                <Wallet className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Agriculteur:</span>
                <span className="ml-2">{transaction.farmer}</span>
              </div>
              <div className="flex items-center">
                <Wallet className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Acheteur:</span>
                <span className="ml-2">{transaction.buyer}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions disponibles */}
      <div className="flex flex-wrap gap-2">
        {transaction.status === 'pending' && (
          <>
            <button
              onClick={() => onApprove(transaction)}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approuver
            </button>
            <button
              onClick={() => onReject(transaction)}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
            </button>
          </>
        )}
        
        {transaction.type === 'sequester' && transaction.status === 'completed' && (
          <button
            onClick={() => onStake(transaction)}
            className="flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Zap className="h-4 w-4 mr-2" />
            Mettre en staking
          </button>
        )}

        <button className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          <Activity className="h-4 w-4 mr-2" />
          Voir détails Hedera
        </button>
      </div>
    </div>
  );
};

// Configuration pour la page de gestion financière optimisée
const FinancialManagementOptimized: React.FC = () => {
  // États pour les modals spécialisés
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Données d'exemple
  const transactionsData: FinancialTransaction[] = useMemo(() => [
    {
      id: 1,
      type: 'sequester',
      orderId: 101,
      farmer: 'Jean Kouassi',
      buyer: 'Restaurant Le Gourmet',
      amount: 40000,
      description: 'Séquestre pour commande de tomates',
      status: 'pending',
      createdAt: '2024-09-20',
      platformFee: 2000,
      hederaTxId: '0.0.1234567@1678888888.123456789'
    },
    {
      id: 2,
      type: 'release',
      orderId: 102,
      farmer: 'Fatou Keita',
      buyer: 'Supermarché Fraîcheur',
      amount: 60000,
      description: 'Libération des fonds pour mangues',
      status: 'completed',
      createdAt: '2024-09-18',
      completedAt: '2024-09-19',
      platformFee: 3000,
      hederaTxId: '0.0.7654321@1678999999.987654321'
    },
    {
      id: 3,
      type: 'staking',
      orderId: 103,
      farmer: 'Ibrahim Traoré',
      buyer: 'Grossiste Céréales',
      amount: 100000,
      description: 'Mise en staking pour récompenses',
      status: 'completed',
      createdAt: '2024-09-15',
      completedAt: '2024-09-16',
      stakingReward: 5000,
      hederaTxId: '0.0.9876543@1678777777.543210987'
    },
    {
      id: 4,
      type: 'fee',
      orderId: 104,
      farmer: 'Aisha Diallo',
      buyer: 'Hôtel Ivoire',
      amount: 1800,
      description: 'Frais de plateforme',
      status: 'failed',
      createdAt: '2024-09-10',
      platformFee: 1800,
      hederaTxId: '0.0.1122334@1679111111.223344556'
    }
  ], []);

  // Handlers pour les actions spécialisées
  const handleApprove = useCallback((transaction: FinancialTransaction) => {
    setSelectedTransaction(transaction);
    setShowApproveModal(true);
  }, []);

  const handleReject = useCallback((transaction: FinancialTransaction) => {
    setSelectedTransaction(transaction);
    setShowRejectModal(true);
  }, []);

  const handleStake = useCallback((transaction: FinancialTransaction) => {
    setSelectedTransaction(transaction);
    setShowStakeModal(true);
  }, []);

  // Configuration des colonnes
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<FinancialTransaction>();
    return [
      columnHelper.accessor('type', {
        header: 'Type',
        cell: (info) => {
          const type = info.getValue();
          const colors = {
            sequester: 'bg-blue-100 text-blue-800',
            release: 'bg-green-100 text-green-800',
            staking: 'bg-purple-100 text-purple-800',
            fee: 'bg-orange-100 text-orange-800',
            refund: 'bg-red-100 text-red-800'
          };
          return (
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors]}`}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </span>
            </div>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('orderId', {
        header: 'Commande',
        cell: (info) => (
          <div className="flex items-center">
            <Shield className="h-4 w-4 text-gray-500 mr-2" />
            #{info.getValue()}
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('farmer', {
        header: 'Agriculteur',
        cell: (info) => (
          <div className="flex items-center">
            <Wallet className="h-4 w-4 text-gray-500 mr-2" />
            {info.getValue()}
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('buyer', {
        header: 'Acheteur',
        cell: (info) => (
          <div className="flex items-center">
            <Wallet className="h-4 w-4 text-gray-500 mr-2" />
            {info.getValue()}
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('amount', {
        header: 'Montant',
        cell: (info) => (
          <div className="flex items-center">
            <Coins className="h-4 w-4 text-gray-500 mr-2" />
            <span className="font-semibold">{info.getValue().toLocaleString()} FCFA</span>
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('status', {
        header: 'Statut',
        cell: (info) => {
          const status = info.getValue();
          const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            completed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800'
          };
          return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
      }),
      columnHelper.accessor('createdAt', {
        header: 'Date Création',
        cell: (info) => (
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            {info.getValue()}
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('completedAt', {
        header: 'Date Finalisation',
        cell: (info) => (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-gray-500 mr-2" />
            {info.getValue() || 'En cours'}
          </div>
        ),
        enableSorting: true,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleApprove(row.original)}
              className="text-green-600 hover:text-green-900 transition-colors"
              title="Approuver la transaction"
            >
              <CheckCircle className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleReject(row.original)}
              className="text-red-600 hover:text-red-900 transition-colors"
              title="Rejeter la transaction"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        ),
      }),
    ];
  }, [handleApprove, handleReject]);

  // Configuration des champs du formulaire
  const formFields = useMemo(() => [
    {
      name: 'type', label: 'Type de transaction', type: 'select', required: true,
      options: [
        { value: 'sequester', label: 'Séquestre' },
        { value: 'release', label: 'Libération' },
        { value: 'staking', label: 'Staking' },
        { value: 'fee', label: 'Frais de plateforme' },
        { value: 'refund', label: 'Remboursement' }
      ]
    },
    { name: 'orderId', label: 'ID Commande', type: 'number', placeholder: '123', required: true, min: 1 },
    { name: 'farmer', label: 'Agriculteur', type: 'text', placeholder: 'Nom de l\'agriculteur', required: true },
    { name: 'buyer', label: 'Acheteur', type: 'text', placeholder: 'Nom de l\'acheteur', required: true },
    { name: 'amount', label: 'Montant (FCFA)', type: 'number', placeholder: '50000', required: true, min: 1 },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Description de la transaction...', required: true, rows: 3 },
    { name: 'platformFee', label: 'Frais de plateforme (FCFA)', type: 'number', placeholder: '2500', min: 0 },
    { name: 'stakingReward', label: 'Récompense staking (FCFA)', type: 'number', placeholder: '1000', min: 0 }
  ], []);

  // Configuration des champs de visualisation
  const viewFields = useMemo(() => [
    { key: 'type', label: 'Type de transaction' },
    { key: 'orderId', label: 'ID Commande' },
    { key: 'farmer', label: 'Agriculteur' },
    { key: 'buyer', label: 'Acheteur' },
    { key: 'amount', label: 'Montant' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Statut' },
    { key: 'createdAt', label: 'Date de création' },
    { key: 'completedAt', label: 'Date de finalisation' },
    { key: 'platformFee', label: 'Frais de plateforme' },
    { key: 'stakingReward', label: 'Récompense staking' },
    { key: 'hederaTxId', label: 'ID Transaction Hedera' }
  ], []);

  // Configuration par défaut du formulaire
  const defaultFormData = useMemo(() => ({
    type: 'sequester' as const,
    orderId: '',
    farmer: '',
    buyer: '',
    amount: '',
    description: '',
    status: 'pending' as const,
    createdAt: new Date().toISOString().split('T')[0],
    platformFee: 0,
    stakingReward: 0
  }), []);

  // Règles de validation
  const validationRules = useMemo(() => ({
    type: { required: true },
    orderId: { required: true, min: 1 },
    farmer: { required: true, minLength: 2 },
    buyer: { required: true, minLength: 2 },
    amount: { required: true, min: 1 },
    description: { required: true, minLength: 10 }
  }), []);

  // Statistiques
  const stats = useMemo(() => [
    {
      label: 'Total Transactions',
      value: transactionsData.length,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'En Attente',
      value: transactionsData.filter(t => t.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'Complétées',
      value: transactionsData.filter(t => t.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'En Staking',
      value: transactionsData.filter(t => t.type === 'staking').length,
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ], [transactionsData]);

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log('Approving transaction:', selectedTransaction);
    setIsLoading(false);
    setShowApproveModal(false);
    setSelectedTransaction(null);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log('Rejecting transaction:', selectedTransaction);
    setIsLoading(false);
    setShowRejectModal(false);
    setSelectedTransaction(null);
  };

  const handleStakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log('Staking transaction:', selectedTransaction);
    setIsLoading(false);
    setShowStakeModal(false);
    setSelectedTransaction(null);
  };

  const config = useMemo(() => ({
    title: 'Gestion Financière',
    description: 'Gérez les transactions financières, les paiements séquestrés et les récompenses de staking',
    icon: DollarSign,
    stats,
    formFields,
    viewFields,
    columns: (_columnHelper: ReturnType<typeof createColumnHelper<FinancialTransaction>>) => columns as ColumnDef<FinancialTransaction, unknown>[],
    defaultFormData,
    validationRules
  }), [stats, formFields, viewFields, columns, defaultFormData, validationRules]);

  return (
    <>
      <ManagementPage<FinancialTransaction>
        config={config}
        data={transactionsData}
      />

      {/* Modal d'approbation */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approuver une Transaction"
        size="md"
      >
        {selectedTransaction && (
          <FinancialActions
            transaction={selectedTransaction}
            onApprove={handleApprove}
            onReject={handleReject}
            onStake={handleStake}
          />
        )}
        
        <ModalForm
          onSubmit={handleApproveSubmit}
          onCancel={() => setShowApproveModal(false)}
          submitText="Approuver"
          isLoading={isLoading}
        >
          <FormField
            label="Commentaire d'approbation"
            name="approvalComment"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Commentaire sur l'approbation..."
            rows={3}
          />
        </ModalForm>
      </Modal>

      {/* Modal de rejet */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Rejeter une Transaction"
        size="md"
      >
        {selectedTransaction && (
          <FinancialActions
            transaction={selectedTransaction}
            onApprove={handleApprove}
            onReject={handleReject}
            onStake={handleStake}
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
            type="select"
            value=""
            onChange={() => {}}
            required
            options={[
              { value: 'insufficient-funds', label: 'Fonds insuffisants' },
              { value: 'invalid-transaction', label: 'Transaction invalide' },
              { value: 'security-risk', label: 'Risque de sécurité' },
              { value: 'compliance-issue', label: 'Problème de conformité' },
              { value: 'other', label: 'Autre' }
            ]}
          />
          <FormField
            label="Commentaire"
            name="rejectionComment"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Détails du rejet..."
            required
            rows={3}
          />
        </ModalForm>
      </Modal>

      {/* Modal de staking */}
      <Modal
        isOpen={showStakeModal}
        onClose={() => setShowStakeModal(false)}
        title="Mettre en Staking"
        size="md"
      >
        {selectedTransaction && (
          <FinancialActions
            transaction={selectedTransaction}
            onApprove={handleApprove}
            onReject={handleReject}
            onStake={handleStake}
          />
        )}
        
        <ModalForm
          onSubmit={handleStakeSubmit}
          onCancel={() => setShowStakeModal(false)}
          submitText="Mettre en staking"
          isLoading={isLoading}
        >
          <FormField
            label="Montant à staker (FCFA)"
            name="stakeAmount"
            type="number"
            value=""
            onChange={() => {}}
            placeholder="0"
            required
            min={0}
          />
          <FormField
            label="Durée de staking (jours)"
            name="stakingDuration"
            type="number"
            value=""
            onChange={() => {}}
            placeholder="30"
            required
            min={1}
          />
          <FormField
            label="Commentaire"
            name="stakingComment"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Détails du staking..."
            rows={3}
          />
        </ModalForm>
      </Modal>
    </>
  );
};

export default FinancialManagementOptimized;
