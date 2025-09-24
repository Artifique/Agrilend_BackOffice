import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { DollarSign, CheckCircle, XCircle, Clock, Wallet, Shield, Activity, Coins, Zap } from 'lucide-react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { ManagementPage } from '../components/ManagementPage';
import Modal from '../components/Modal';
import ModalForm from '../components/ModalForm';
import FormField from '../components/FormField';

// Type pour les transactions financières
interface FinancialTransaction {
  id: number;
  type: 'TOKENIZATION' | 'ESCROW_DEPOSIT' | 'ESCROW_RELEASE' | 'FARMER_PAYMENT' | 'PLATFORM_FEE' | 'STAKING_REWARD' | 'REFUND';
  orderId: number;
  farmer: string;
  buyer: string;
  amount: number;
  description: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REVERSED';
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
      case 'ESCROW_DEPOSIT': return 'bg-blue-100 text-blue-800';
      case 'ESCROW_RELEASE': return 'bg-green-100 text-green-800';
      case 'STAKING_REWARD': return 'bg-purple-100 text-purple-800';
      case 'PLATFORM_FEE': return 'bg-orange-100 text-orange-800';
      case 'REFUND': return 'bg-red-100 text-red-800';
      case 'TOKENIZATION': return 'bg-indigo-100 text-indigo-800';
      case 'FARMER_PAYMENT': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: FinancialTransaction['status']) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'SUCCESS': return 'bg-green-100 text-green-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      case 'REVERSED': return 'bg-gray-400 text-gray-800';
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
                  {transaction.type.replace('_', ' ').charAt(0).toUpperCase() + transaction.type.replace('_', ' ').slice(1)}
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
        {transaction.status === 'PENDING' && (
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
        
        {transaction.type === 'ESCROW_DEPOSIT' && transaction.status === 'SUCCESS' && (
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
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]); // State to hold fetched transactions
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showStakeModal, setShowStakeModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to simulate fetching transactions from an API
  const fetchTransactions = async () => {
    setIsLoading(true);
    // In a real application, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500)); 
    const fetchedTransactions: FinancialTransaction[] = [
      {
        id: 1,
        type: 'ESCROW_DEPOSIT',
        orderId: 101,
        farmer: 'Jean Kouassi',
        buyer: 'Restaurant Le Gourmet',
        amount: 40000,
        description: 'Séquestre pour commande de tomates',
        status: 'PENDING',
        createdAt: '2024-09-20',
        platformFee: 2000,
        hederaTxId: '0.0.1234567@1678888888.123456789'
      },
      {
        id: 2,
        type: 'ESCROW_RELEASE',
        orderId: 102,
        farmer: 'Fatou Keita',
        buyer: 'Supermarché Fraîcheur',
        amount: 60000,
        description: 'Libération des fonds pour mangues',
        status: 'SUCCESS',
        createdAt: '2024-09-18',
        completedAt: '2024-09-19',
        platformFee: 3000,
        hederaTxId: '0.0.7654321@1678999999.987654321'
      },
      {
        id: 3,
        type: 'STAKING_REWARD',
        orderId: 103,
        farmer: 'Ibrahim Traoré',
        buyer: 'Grossiste Céréales',
        amount: 100000,
        description: 'Mise en staking pour récompenses',
        status: 'SUCCESS',
        createdAt: '2024-09-15',
        completedAt: '2024-09-16',
        stakingReward: 5000,
        hederaTxId: '0.0.9876543@1678777777.543210987'
      },
      {
        id: 4,
        type: 'PLATFORM_FEE',
        orderId: 104,
        farmer: 'Aisha Diallo',
        buyer: 'Hôtel Ivoire',
        amount: 1800,
        description: 'Frais de plateforme',
        status: 'FAILED',
        createdAt: '2024-09-10',
        platformFee: 1800,
        hederaTxId: '0.0.1122334@1679111111.223344556'
      },
      {
        id: 5,
        type: 'REFUND',
        orderId: 105,
        farmer: 'Moussa Koné',
        buyer: 'Client Test',
        amount: 5000,
        description: 'Remboursement commande annulée',
        status: 'REVERSED',
        createdAt: '2024-09-22',
        hederaTxId: '0.0.9988776@1679222222.334455667'
      }
    ];
    setTransactions(fetchedTransactions);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []); // Fetch transactions on component mount

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
            TOKENIZATION: 'bg-indigo-100 text-indigo-800',
            ESCROW_DEPOSIT: 'bg-blue-100 text-blue-800',
            ESCROW_RELEASE: 'bg-green-100 text-green-800',
            FARMER_PAYMENT: 'bg-teal-100 text-teal-800',
            PLATFORM_FEE: 'bg-orange-100 text-orange-800',
            STAKING_REWARD: 'bg-purple-100 text-purple-800',
            REFUND: 'bg-red-100 text-red-800'
          };
          return (
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type as keyof typeof colors]}`}>
                {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
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
            PENDING: 'bg-yellow-100 text-yellow-800',
            SUCCESS: 'bg-green-100 text-green-800',
            FAILED: 'bg-red-100 text-red-800',
            REVERSED: 'bg-gray-400 text-gray-800'
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
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approuver
            </button>
            <button
              onClick={() => handleReject(row.original)}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
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
        { value: 'TOKENIZATION', label: 'Tokenisation' },
        { value: 'ESCROW_DEPOSIT', label: 'Dépôt Séquestre' },
        { value: 'ESCROW_RELEASE', label: 'Libération Séquestre' },
        { value: 'FARMER_PAYMENT', label: 'Paiement Agriculteur' },
        { value: 'PLATFORM_FEE', label: 'Frais Plateforme' },
        { value: 'STAKING_REWARD', label: 'Récompense Staking' },
        { value: 'REFUND', label: 'Remboursement' }
      ]
    },
    { name: 'orderId', label: 'ID Commande', type: 'number' as const, placeholder: '123', required: true, min: 1 },
    { name: 'farmer', label: 'Agriculteur', type: 'text' as const, placeholder: 'Nom de l\'agriculteur', required: true },
    { name: 'buyer', label: 'Acheteur', type: 'text' as const, placeholder: 'Nom de l\'acheteur', required: true },
    { name: 'amount', label: 'Montant (FCFA)', type: 'number' as const, placeholder: '50000', required: true, min: 1 },
    { name: 'description', label: 'Description', type: 'textarea' as const, placeholder: 'Description de la transaction...', required: true, rows: 3 },
    { name: 'platformFee', label: 'Frais de plateforme (FCFA)', type: 'number' as const, placeholder: '2500', min: 0 },
    { name: 'stakingReward', label: 'Récompense staking (FCFA)', type: 'number' as const, placeholder: '1000', min: 0 }
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
    type: 'ESCROW_DEPOSIT' as const,
    orderId: 0,
    farmer: '',
    buyer: '',
    amount: 0,
    description: '',
    status: 'PENDING' as const,
    createdAt: new Date().toISOString().split('T')[0],
    platformFee: 0,
    stakingReward: 0
  }), []);

  // Règles de validation
  const validationRules = useMemo(() => ({
    type: (value: unknown) => { if (!value) return 'Le type de transaction est requis'; return null; },
    orderId: (value: unknown) => { if (typeof value !== 'number' || value < 1) return 'L\'ID de commande doit être un nombre positif'; return null; },
    farmer: (value: unknown) => { if (!value || (typeof value === 'string' && value.length < 2)) return 'L\'agriculteur est requis'; return null; },
    buyer: (value: unknown) => { if (!value || (typeof value === 'string' && value.length < 2)) return 'L\'acheteur est requis'; return null; },
    amount: (value: unknown) => { if (typeof value !== 'number' || value < 1) return 'Le montant doit être un nombre positif'; return null; },
    description: (value: unknown) => { if (!value || (typeof value === 'string' && value.length < 10)) return 'La description doit contenir au moins 10 caractères'; return null; },
    platformFee: (value: unknown) => { if (typeof value !== 'number' || value < 0) return 'Les frais de plateforme doivent être un nombre positif'; return null; },
    stakingReward: (value: unknown) => { if (typeof value !== 'number' || value < 0) return 'La récompense de staking doit être un nombre positif'; return null; },
  }), []);

  // Statistiques
  const stats = useMemo(() => [
    {
      label: 'Total Transactions',
      value: transactions.length,
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'En Attente',
      value: transactions.filter(t => t.status === 'PENDING').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'Complétées',
      value: transactions.filter(t => t.status === 'SUCCESS').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'En Staking',
      value: transactions.filter(t => t.type === 'STAKING_REWARD').length,
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ], [transactions]);

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to approve transaction
      // Example: await fetch(`/api/transactions/${selectedTransaction?.id}/approve`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ approvalComment: e.target.approvalComment.value }),
      // });
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      console.log('Approving transaction:', selectedTransaction);
      alert('Transaction approuvée avec succès !');
      setShowApproveModal(false);
      setSelectedTransaction(null);
      fetchTransactions(); // Refresh transactions list
    } catch (error) {
      console.error('Error approving transaction:', error);
      alert('Erreur lors de l\'approbation de la transaction.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to reject transaction
      // Example: await fetch(`/api/transactions/${selectedTransaction?.id}/reject`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ rejectionReason: e.target.rejectionReason.value, rejectionComment: e.target.rejectionComment.value }),
      // });
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      console.log('Rejecting transaction:', selectedTransaction);
      alert('Transaction rejetée avec succès !');
      setShowRejectModal(false);
      setSelectedTransaction(null);
      fetchTransactions(); // Refresh transactions list
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      alert('Erreur lors du rejet de la transaction.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to stake transaction
      // Example: await fetch(`/api/transactions/${selectedTransaction?.id}/stake`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ stakeAmount: e.target.stakeAmount.value, stakingDuration: e.target.stakingDuration.value, stakingComment: e.target.stakingComment.value }),
      // });
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      console.log('Staking transaction:', selectedTransaction);
      alert('Transaction mise en staking avec succès !');
      setShowStakeModal(false);
      setSelectedTransaction(null);
      fetchTransactions(); // Refresh transactions list
    } catch (error) {
      console.error('Error staking transaction:', error);
      alert('Erreur lors de la mise en staking de la transaction.');
    } finally {
      setIsLoading(false);
    }
  };

  const config = useMemo(() => ({
    title: 'Gestion Financière',
    description: 'Gérez les transactions financières, les paiements séquestrés et les récompenses de staking',
    icon: DollarSign,
    stats,
    formFields,
    viewFields,
    columns: columns as ColumnDef<FinancialTransaction, unknown>[],
    defaultFormData,
    validationRules
  }), [stats, formFields, viewFields, columns, defaultFormData, validationRules]);

  return (
    <>
      <ManagementPage<FinancialTransaction>
        config={config}
        data={transactions}
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