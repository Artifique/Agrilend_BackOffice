import React, { useState, useMemo } from 'react';
import { Plus, CheckCircle, XCircle, Clock, TrendingUp, DollarSign, Calendar, User, MapPin, AlertTriangle, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ModalForm from '../components/ModalForm';
import FormField from '../components/FormField';
import { useNotificationHelpers } from '../hooks/useNotificationHelpers';

interface Loan {
  id: number;
  borrower: string;
  amount: number;
  interestRate: number;
  term: number;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'defaulted';
  applicationDate: string;
  approvalDate?: string;
  dueDate?: string;
  purpose: string;
  location: string;
  riskScore: number;
  monthlyPayment: number;
}

const LoansManagement: React.FC = () => {
  const { showSuccess, showWarning, showInfo } = useNotificationHelpers();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [viewingLoan, setViewingLoan] = useState<Loan | null>(null);
  const [deletingLoan, setDeletingLoan] = useState<Loan | null>(null);
  const [approvingLoan, setApprovingLoan] = useState<Loan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newLoan, setNewLoan] = useState({
    borrower: '',
    amount: '',
    interestRate: '',
    term: '',
    purpose: '',
    location: '',
    riskScore: ''
  });

  const loans: Loan[] = [
    {
      id: 1,
      borrower: 'Jean Kouassi',
      amount: 15000,
      interestRate: 8.5,
      term: 24,
      status: 'active',
      applicationDate: '2024-01-15',
      approvalDate: '2024-01-20',
      dueDate: '2026-01-20',
      purpose: 'Achat d\'équipements agricoles',
      location: 'Abidjan, Côte d\'Ivoire',
      riskScore: 75,
      monthlyPayment: 680
    },
    {
      id: 2,
      borrower: 'Marie Diabaté',
      amount: 25000,
      interestRate: 7.2,
      term: 36,
      status: 'pending',
      applicationDate: '2024-02-20',
      purpose: 'Expansion de la ferme',
      location: 'Bouaké, Côte d\'Ivoire',
      riskScore: 85,
      monthlyPayment: 780
    },
    {
      id: 3,
      borrower: 'Ibrahim Traoré',
      amount: 8000,
      interestRate: 9.0,
      term: 18,
      status: 'approved',
      applicationDate: '2024-03-10',
      approvalDate: '2024-03-15',
      dueDate: '2025-09-15',
      purpose: 'Semences et engrais',
      location: 'San-Pédro, Côte d\'Ivoire',
      riskScore: 65,
      monthlyPayment: 520
    },
    {
      id: 4,
      borrower: 'Fatou Keita',
      amount: 12000,
      interestRate: 6.8,
      term: 30,
      status: 'completed',
      applicationDate: '2023-12-01',
      approvalDate: '2023-12-05',
      dueDate: '2024-12-05',
      purpose: 'Irrigation',
      location: 'Yamoussoukro, Côte d\'Ivoire',
      riskScore: 90,
      monthlyPayment: 420
    }
  ];

  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Loan>();
    return [
      columnHelper.accessor('id', {
        header: 'Prêt',
        cell: ({ row }) => (
          <div className="flex items-center">
            <div className="h-10 w-10 bg-gradient-to-br from-[#4CAF50] to-[#1E90FF] rounded-full flex items-center justify-center text-white font-semibold">
              #{row.original.id}
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-900">{row.original.purpose}</p>
              <p className="text-sm text-gray-500">{row.original.term} mois • {row.original.interestRate}%</p>
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('borrower', {
        header: 'Emprunteur',
        cell: ({ row }) => (
          <div className="space-y-1">
            <div className="flex items-center text-sm text-gray-900">
              <User className="h-4 w-4 mr-2" />
              {row.original.borrower}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-2" />
              {row.original.location}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor('amount', {
        header: 'Montant',
        cell: ({ row }) => (
          <div className="text-sm">
            <p className="font-medium text-gray-900">€{row.original.amount.toLocaleString()}</p>
            <p className="text-gray-500">€{row.original.monthlyPayment}/mois</p>
          </div>
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Statut',
        cell: ({ row }) => {
          const getStatusIcon = (status: string) => {
            switch (status) {
              case 'approved': return <CheckCircle className="h-4 w-4 text-[#4CAF50]" />;
              case 'active': return <TrendingUp className="h-4 w-4 text-[#1E90FF]" />;
              case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />;
              case 'defaulted': return <XCircle className="h-4 w-4 text-red-500" />;
              case 'pending': return <Clock className="h-4 w-4 text-orange-500" />;
              default: return null;
            }
          };
          const getStatusColor = (status: string) => {
            switch (status) {
              case 'approved': return 'bg-[#4CAF50]/10 text-[#4CAF50] border-[#4CAF50]/20';
              case 'active': return 'bg-[#1E90FF]/10 text-[#1E90FF] border-[#1E90FF]/20';
              case 'completed': return 'bg-green-50 text-green-600 border-green-200';
              case 'defaulted': return 'bg-red-50 text-red-600 border-red-200';
              case 'pending': return 'bg-orange-50 text-orange-600 border-orange-200';
              default: return 'bg-gray-50 text-gray-600 border-gray-200';
            }
          };
          return (
            <div className="flex items-center">
              {getStatusIcon(row.original.status)}
              <span className={`ml-2 inline-flex px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(row.original.status)}`}>
                {row.original.status === 'pending' ? 'En attente' : 
                 row.original.status === 'approved' ? 'Approuvé' :
                 row.original.status === 'active' ? 'Actif' :
                 row.original.status === 'completed' ? 'Terminé' : 'En défaut'}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor('riskScore', {
        header: 'Risque',
        cell: ({ row }) => {
          const getRiskColor = (score: number) => {
            if (score >= 80) return 'text-[#4CAF50] bg-[#4CAF50]/10';
            if (score >= 60) return 'text-orange-500 bg-orange-100';
            return 'text-red-500 bg-red-100';
          };
          return (
            <div className="flex items-center">
              <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getRiskColor(row.original.riskScore)}`}>
                {row.original.riskScore}/100
              </span>
              {row.original.riskScore < 60 && (
                <AlertTriangle className="h-4 w-4 text-red-500 ml-2" />
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor('dueDate', {
        header: 'Échéance',
        cell: ({ row }) => (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {row.original.dueDate ? new Date(row.original.dueDate).toLocaleDateString('fr-FR') : 'N/A'}
          </div>
        ),
      })
    ];
  }, []) as ColumnDef<Loan, unknown>[];

  const handleView = (loan: Loan) => {
    setViewingLoan(loan);
    setShowViewModal(true);
  };

  const handleEdit = (loan: Loan) => {
    setEditingLoan(loan);
    setNewLoan({
      borrower: loan.borrower,
      amount: loan.amount.toString(),
      interestRate: loan.interestRate.toString(),
      term: loan.term.toString(),
      purpose: loan.purpose,
      location: loan.location,
      riskScore: loan.riskScore.toString()
    });
    setShowEditModal(true);
  };

  const handleDelete = (loan: Loan) => {
    setDeletingLoan(loan);
    setShowDeleteModal(true);
  };

  const handleAddLoan = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewLoan({
      borrower: '',
      amount: '',
      interestRate: '',
      term: '',
      purpose: '',
      location: '',
      riskScore: ''
    });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingLoan(null);
    setNewLoan({
      borrower: '',
      amount: '',
      interestRate: '',
      term: '',
      purpose: '',
      location: '',
      riskScore: ''
    });
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingLoan(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingLoan(null);
  };

  const handleCloseApproveModal = () => {
    setShowApproveModal(false);
    setApprovingLoan(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewLoan(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Délai optimisé pour une meilleure performance
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setIsLoading(false);
    handleCloseModal();
    showSuccess('Succès', 'Prêt ajouté avec succès !');
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLoan) return;
    
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setIsLoading(false);
    handleCloseEditModal();
    showSuccess('Succès', 'Prêt modifié avec succès !');
  };

  const handleConfirmDelete = async () => {
    if (!deletingLoan) return;
    
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setIsLoading(false);
    handleCloseDeleteModal();
    showSuccess('Succès', 'Prêt supprimé avec succès !');
  };

  const handleConfirmApprove = async () => {
    if (!approvingLoan) return;
    
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setIsLoading(false);
    handleCloseApproveModal();
    showSuccess('Succès', 'Prêt approuvé avec succès !');
  };

  // Fonction pour approuver un prêt spécifique
  const handleApprove = async (loan: Loan) => {
    setApprovingLoan(loan);
    setShowApproveModal(true);
  };

  // Fonction pour approuver les demandes depuis les actions rapides
  const handleQuickApproveRequests = () => {
    // Trouver le premier prêt en attente
    const pendingLoan = loans.find(l => l.status === 'pending');
    
    if (pendingLoan) {
      handleApprove(pendingLoan);
    } else {
      showWarning('Information', 'Aucune demande de prêt en attente trouvée.');
    }
  };

  // Fonction pour gérer les défauts depuis les actions rapides
  const handleQuickManageDefaults = () => {
    // Trouver le premier prêt en défaut
    const defaultedLoan = loans.find(l => l.status === 'defaulted');
    
    if (defaultedLoan) {
      showInfo('Gestion du défaut', `Gestion du défaut pour le prêt #${defaultedLoan.id} - Montant: €${defaultedLoan.amount.toLocaleString()}`);
    } else {
      showWarning('Information', 'Aucun prêt en défaut trouvé.');
    }
  };

  const totalAmount = loans.reduce((sum, loan) => sum + loan.amount, 0);
  const activeLoans = loans.filter(loan => loan.status === 'active').length;
  const pendingLoans = loans.filter(loan => loan.status === 'pending').length;
  const completedLoans = loans.filter(loan => loan.status === 'completed').length;

  return (
    <div className="space-y-8">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Supervision des Prêts</h1>
            <p className="text-white/90 text-lg">Gérez et supervisez tous les prêts agricoles</p>
          </div>
          <button 
            onClick={handleAddLoan}
            data-action="add-loan"
            className="bg-white/20 backdrop-blur-sm rounded-xl p-4 hover:bg-white/30 transition-all duration-300"
          >
            <Plus className="h-8 w-8" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Volume Total</p>
              <p className="text-2xl font-bold text-gray-900">€{totalAmount.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-gradient-to-br from-[#4CAF50] to-[#1E90FF] rounded-xl">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Prêts Actifs</p>
              <p className="text-2xl font-bold text-[#1E90FF]">{activeLoans}</p>
            </div>
            <div className="p-3 bg-[#1E90FF]/10 rounded-xl">
              <TrendingUp className="h-6 w-6 text-[#1E90FF]" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-orange-500">{pendingLoans}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-xl">
              <Clock className="h-6 w-6 text-orange-500" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Terminés</p>
              <p className="text-2xl font-bold text-[#4CAF50]">{completedLoans}</p>
            </div>
            <div className="p-3 bg-[#4CAF50]/10 rounded-xl">
              <CheckCircle className="h-6 w-6 text-[#4CAF50]" />
            </div>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        data={loans}
        columns={columns}
        searchPlaceholder="Rechercher par emprunteur ou objet..."
        showSearch={true}
        showPagination={true}
        pageSize={10}
        showActions={true}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Graphique de répartition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Répartition par Statut</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#1E90FF] rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Prêts Actifs</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{activeLoans}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">En Attente</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{pendingLoans}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#4CAF50] rounded-full mr-3"></div>
                <span className="text-sm font-medium text-gray-700">Terminés</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{completedLoans}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Actions Rapides</h3>
          <div className="space-y-3">
            <button 
              onClick={handleAddLoan}
            data-action="add-loan"
              className="w-full p-3 bg-gradient-to-r from-[#4CAF50] to-[#1E90FF] text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Prêt
            </button>
            <button 
              onClick={handleQuickApproveRequests}
              className="w-full p-3 bg-gradient-to-r from-[#1E90FF] to-[#4CAF50] text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approuver Demandes
            </button>
            <button 
              onClick={handleQuickManageDefaults}
              className="w-full p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Gérer Défauts
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {/* Modal d'ajout de prêt */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title="Nouveau Prêt"
        type="success"
        size="lg"
      >
        <ModalForm
          onSubmit={handleSubmitLoan}
          onCancel={handleCloseModal}
          submitText="Créer le prêt"
          isLoading={isLoading}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Emprunteur"
              name="borrower"
              type="text"
              value={newLoan.borrower}
              onChange={handleInputChange}
              placeholder="Jean Kouassi"
              required
            />
            
            <FormField
              label="Montant (€)"
              name="amount"
              type="number"
              value={newLoan.amount}
              onChange={handleInputChange}
              placeholder="15000"
              required
              min={1000}
              max={100000}
            />
            
            <FormField
              label="Taux d'intérêt (%)"
              name="interestRate"
              type="number"
              value={newLoan.interestRate}
              onChange={handleInputChange}
              placeholder="8.5"
              required
              min={1}
              max={20}
              step={0.1}
            />
            
            <FormField
              label="Durée (mois)"
              name="term"
              type="number"
              value={newLoan.term}
              onChange={handleInputChange}
              placeholder="24"
              required
              min={6}
              max={60}
            />
            
            <FormField
              label="Score de risque"
              name="riskScore"
              type="number"
              value={newLoan.riskScore}
              onChange={handleInputChange}
              placeholder="75"
              required
              min={0}
              max={100}
            />
            
            <FormField
              label="Localisation"
              name="location"
              type="text"
              value={newLoan.location}
              onChange={handleInputChange}
              placeholder="Abidjan, Côte d'Ivoire"
              required
            />
          </div>
          
          <FormField
            label="Objet du prêt"
            name="purpose"
            type="textarea"
            value={newLoan.purpose}
            onChange={handleInputChange}
            placeholder="Décrivez l'utilisation prévue du prêt..."
            required
            rows={3}
          />
        </ModalForm>
      </Modal>

      {/* Modal d'édition de prêt */}
      <Modal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        title="Modifier le Prêt"
        type="info"
        size="lg"
      >
        <ModalForm
          onSubmit={handleSubmitEdit}
          onCancel={handleCloseEditModal}
          submitText="Modifier le prêt"
          isLoading={isLoading}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Emprunteur"
              name="borrower"
              type="text"
              value={newLoan.borrower}
              onChange={handleInputChange}
              placeholder="Jean Kouassi"
              required
            />
            
            <FormField
              label="Montant (€)"
              name="amount"
              type="number"
              value={newLoan.amount}
              onChange={handleInputChange}
              placeholder="15000"
              required
              min={1000}
              max={100000}
            />
            
            <FormField
              label="Taux d'intérêt (%)"
              name="interestRate"
              type="number"
              value={newLoan.interestRate}
              onChange={handleInputChange}
              placeholder="8.5"
              required
              min={1}
              max={20}
              step={0.1}
            />
            
            <FormField
              label="Durée (mois)"
              name="term"
              type="number"
              value={newLoan.term}
              onChange={handleInputChange}
              placeholder="24"
              required
              min={6}
              max={60}
            />
            
            <FormField
              label="Score de risque"
              name="riskScore"
              type="number"
              value={newLoan.riskScore}
              onChange={handleInputChange}
              placeholder="75"
              required
              min={0}
              max={100}
            />
            
            <FormField
              label="Localisation"
              name="location"
              type="text"
              value={newLoan.location}
              onChange={handleInputChange}
              placeholder="Abidjan, Côte d'Ivoire"
              required
            />
          </div>
          
          <FormField
            label="Objet du prêt"
            name="purpose"
            type="textarea"
            value={newLoan.purpose}
            onChange={handleInputChange}
            placeholder="Décrivez l'utilisation prévue du prêt..."
            required
            rows={3}
          />
        </ModalForm>
      </Modal>

      {/* Modal de visualisation de prêt */}
      <Modal
        isOpen={showViewModal}
        onClose={handleCloseViewModal}
        title="Détails du Prêt"
        type="default"
        size="lg"
      >
        {viewingLoan && (
          <div className="space-y-6">
            {/* Header avec ID et statut */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#4CAF50]/10 to-[#1E90FF]/10 rounded-lg">
              <div className="flex items-center">
                <div className="h-12 w-12 bg-gradient-to-br from-[#4CAF50] to-[#1E90FF] rounded-full flex items-center justify-center text-white font-bold mr-4">
                  #{viewingLoan.id}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{viewingLoan.purpose}</h3>
                  <p className="text-sm text-gray-600">{viewingLoan.borrower}</p>
                </div>
              </div>
              <div className="flex items-center">
                {viewingLoan.status === 'pending' && <Clock className="h-5 w-5 text-orange-500 mr-2" />}
                {viewingLoan.status === 'approved' && <CheckCircle className="h-5 w-5 text-[#4CAF50] mr-2" />}
                {viewingLoan.status === 'active' && <TrendingUp className="h-5 w-5 text-[#1E90FF] mr-2" />}
                {viewingLoan.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-600 mr-2" />}
                {viewingLoan.status === 'defaulted' && <XCircle className="h-5 w-5 text-red-500 mr-2" />}
                <span className="text-sm font-medium text-gray-700">
                  {viewingLoan.status === 'pending' ? 'En attente' : 
                   viewingLoan.status === 'approved' ? 'Approuvé' :
                   viewingLoan.status === 'active' ? 'Actif' :
                   viewingLoan.status === 'completed' ? 'Terminé' : 'En défaut'}
                </span>
              </div>
            </div>

            {/* Informations financières */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <DollarSign className="h-5 w-5 text-[#4CAF50] mr-2" />
                  <span className="text-sm font-medium text-gray-600">Montant</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">€{viewingLoan.amount.toLocaleString()}</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <TrendingUp className="h-5 w-5 text-[#1E90FF] mr-2" />
                  <span className="text-sm font-medium text-gray-600">Taux d'intérêt</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{viewingLoan.interestRate}%</p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-orange-500 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Durée</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{viewingLoan.term} mois</p>
              </div>
            </div>

            {/* Détails du prêt */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Emprunteur</p>
                    <p className="font-medium">{viewingLoan.borrower}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Localisation</p>
                    <p className="font-medium">{viewingLoan.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Date de demande</p>
                    <p className="font-medium">{new Date(viewingLoan.applicationDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Paiement mensuel</p>
                    <p className="font-medium">€{viewingLoan.monthlyPayment}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Score de risque</p>
                    <p className="font-medium">{viewingLoan.riskScore}/100</p>
                  </div>
                </div>
                
                {viewingLoan.dueDate && (
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Échéance</p>
                      <p className="font-medium">{new Date(viewingLoan.dueDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-gradient-to-r from-[#4CAF50]/5 to-[#1E90FF]/5 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Objet du prêt</h4>
              <p className="text-gray-700">{viewingLoan.purpose}</p>
            </div>

            {/* Bouton de fermeture */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleCloseViewModal}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de suppression de prêt */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Supprimer le Prêt"
        type="error"
        size="sm"
      >
        {deletingLoan && (
          <div className="space-y-4">
            <div className="text-center">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Êtes-vous sûr de vouloir supprimer ce prêt ?
              </h3>
              <p className="text-gray-600">
                Cette action est irréversible. Le prêt <strong>#{deletingLoan.id}</strong> de <strong>{deletingLoan.borrower}</strong> sera définitivement supprimé.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">Attention !</p>
                  <p>Toutes les données associées à ce prêt seront également supprimées.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCloseDeleteModal}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Suppression...</span>
                  </div>
                ) : (
                  'Supprimer définitivement'
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal d'approbation de prêt */}
      <Modal
        isOpen={showApproveModal}
        onClose={handleCloseApproveModal}
        title="Approuver le Prêt"
        type="success"
        size="md"
      >
        {approvingLoan && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Approuver ce prêt ?
              </h3>
              <p className="text-gray-600">
                Le prêt <strong>#{approvingLoan.id}</strong> de <strong>{approvingLoan.borrower}</strong> sera approuvé et activé.
              </p>
            </div>

            {/* Résumé du prêt */}
            <div className="bg-gradient-to-r from-[#4CAF50]/10 to-[#1E90FF]/10 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Résumé du prêt</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Montant</p>
                  <p className="font-medium">€{approvingLoan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Durée</p>
                  <p className="font-medium">{approvingLoan.term} mois</p>
                </div>
                <div>
                  <p className="text-gray-500">Taux</p>
                  <p className="font-medium">{approvingLoan.interestRate}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Paiement mensuel</p>
                  <p className="font-medium">€{approvingLoan.monthlyPayment}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCloseApproveModal}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmApprove}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Approbation...</span>
                  </div>
                ) : (
                  'Approuver le prêt'
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LoansManagement;