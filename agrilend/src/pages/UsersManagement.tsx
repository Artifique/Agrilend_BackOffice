import React, { useMemo, useState } from 'react';
import { Users, Plus, Mail, Phone, Calendar, CheckCircle, XCircle, Clock, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ModalForm from '../components/ModalForm';
import FormField from '../components/FormField';

// Type pour les données d'utilisateur
type UserFormData = {
  name: string;
  email: string;
  phone: string;
  location: string;
  role: 'farmer' | 'buyer' | 'admin';
  status: 'active' | 'pending' | 'inactive';
};

// Objet de réinitialisation du formulaire
const initialUserForm: UserFormData = {
  name: '',
  email: '',
  phone: '',
  location: '',
  role: 'farmer',
  status: 'pending'
};

// Composant réutilisable pour le formulaire d'utilisateur
const UserForm: React.FC<{
  user: UserFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}> = ({ user, onChange }) => (
  <>
    <FormField
      label="Nom complet"
      name="name"
      type="text"
      value={user.name}
      onChange={onChange}
      placeholder="Jean Kouassi"
      required
    />
    
    <FormField
      label="Email"
      name="email"
      type="email"
      value={user.email}
      onChange={onChange}
      placeholder="jean.kouassi@email.com"
      required
    />
    
    <FormField
      label="Téléphone"
      name="phone"
      type="tel"
      value={user.phone}
      onChange={onChange}
      placeholder="+225 07 12 34 56"
      required
    />
    
    <FormField
      label="Localisation"
      name="location"
      type="text"
      value={user.location}
      onChange={onChange}
      placeholder="Abidjan, Côte d'Ivoire"
      required
    />
    
    <FormField
      label="Rôle"
      name="role"
      type="select"
      value={user.role}
      onChange={onChange}
      required
      options={[
        { value: 'farmer', label: 'Agriculteur' },
        { value: 'buyer', label: 'Acheteur' },
        { value: 'admin', label: 'Administrateur' }
      ]}
    />
    
    <FormField
      label="Statut"
      name="status"
      type="select"
      value={user.status}
      onChange={onChange}
      required
      options={[
        { value: 'active', label: 'Actif' },
        { value: 'pending', label: 'En attente' },
        { value: 'inactive', label: 'Inactif' }
      ]}
    />
  </>
);

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  role: 'farmer' | 'buyer' | 'admin';
  ordersCount: number;
  totalAmount: number;
}

const UsersManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newUser, setNewUser] = useState<UserFormData>(initialUserForm);

  const users: User[] = [
    {
      id: 1,
      name: 'Jean Kouassi',
      email: 'jean.kouassi@email.com',
      phone: '+225 07 12 34 56',
      location: 'Abidjan, Côte d\'Ivoire',
      joinDate: '2024-01-15',
      status: 'active',
      role: 'farmer',
      ordersCount: 3,
      totalAmount: 450.00
    },
    {
      id: 2,
      name: 'Marie Traoré',
      email: 'marie.traore@email.com',
      phone: '+225 07 23 45 67',
      location: 'Bouaké, Côte d\'Ivoire',
      joinDate: '2024-01-10',
      status: 'active',
      role: 'buyer',
      ordersCount: 5,
      totalAmount: 1200.00
    },
    {
      id: 3,
      name: 'Amadou Diallo',
      email: 'amadou.diallo@email.com',
      phone: '+225 07 34 56 78',
      location: 'Yamoussoukro, Côte d\'Ivoire',
      joinDate: '2024-01-08',
      status: 'pending',
      role: 'farmer',
      ordersCount: 0,
      totalAmount: 0.00
    },
    {
      id: 4,
      name: 'Fatou Sissoko',
      email: 'fatou.sissoko@email.com',
      phone: '+225 07 45 67 89',
      location: 'San-Pédro, Côte d\'Ivoire',
      joinDate: '2024-01-05',
      status: 'active',
      role: 'buyer',
      ordersCount: 2,
      totalAmount: 300.00
    },
    {
      id: 5,
      name: 'Kouadio N\'Guessan',
      email: 'kouadio.nguessan@email.com',
      phone: '+225 07 56 78 90',
      location: 'Grand-Bassam, Côte d\'Ivoire',
      joinDate: '2024-01-03',
      status: 'inactive',
      role: 'farmer',
      ordersCount: 1,
      totalAmount: 150.00
    }
  ];

  const columnHelper = createColumnHelper<User>();

  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('name', {
      header: 'Nom',
      cell: info => (
        <div className="font-medium text-gray-900">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => (
        <div className="flex items-center">
          <Mail className="h-4 w-4 text-gray-400 mr-2" />
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('phone', {
      header: 'Téléphone',
      cell: info => (
        <div className="flex items-center">
          <Phone className="h-4 w-4 text-gray-400 mr-2" />
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('role', {
      header: 'Rôle',
      cell: info => {
        const role = info.getValue();
        const roleConfig = {
          farmer: { label: 'Agriculteur', color: 'bg-green-100 text-green-800' },
          buyer: { label: 'Acheteur', color: 'bg-blue-100 text-blue-800' },
          admin: { label: 'Admin', color: 'bg-purple-100 text-purple-800' }
        };
        const config = roleConfig[role];
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        );
      },
    }),
    columnHelper.accessor('status', {
      header: 'Statut',
      cell: info => {
        const status = info.getValue();
        const statusConfig = {
          active: { label: 'Actif', color: 'bg-green-100 text-green-800', icon: CheckCircle },
          pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
          inactive: { label: 'Inactif', color: 'bg-red-100 text-red-800', icon: XCircle }
        };
        const config = statusConfig[status];
        const Icon = config.icon;
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </span>
        );
      },
    }),
    columnHelper.accessor('joinDate', {
      header: 'Date d\'inscription',
      cell: info => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
          {new Date(info.getValue()).toLocaleDateString('fr-FR')}
        </div>
      ),
    }),
    columnHelper.accessor('ordersCount', {
      header: 'Commandes',
      cell: info => (
        <div className="text-center">
          <span className="font-medium text-gray-900">
            {info.getValue()}
          </span>
        </div>
      ),
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Montant Total',
      cell: info => (
        <div className="text-right">
          <span className="font-medium text-green-600">
            €{info.getValue().toFixed(2)}
          </span>
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleView(row.original)}
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
            title="Voir les détails"
          >
            <Users className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEdit(row.original)}
            className="text-green-600 hover:text-green-800 transition-colors duration-200"
            title="Modifier"
          >
            <CheckCircle className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row.original)}
            className="text-red-600 hover:text-red-800 transition-colors duration-200"
            title="Supprimer"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    }),
  ] as ColumnDef<User, unknown>[], [columnHelper]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleView = (user: User) => {
    setViewingUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (user: User) => {
    setNewUser({
      name: user.name,
      email: user.email,
      phone: user.phone,
      location: user.location,
      role: user.role,
      status: user.status
    });
    setShowEditModal(true);
  };

  const handleDelete = (user: User) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setNewUser(initialUserForm);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setNewUser(initialUserForm);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewingUser(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setIsLoading(false);
    handleCloseModal();
    alert('Utilisateur ajouté avec succès !');
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setIsLoading(false);
    handleCloseEditModal();
    alert('Utilisateur modifié avec succès !');
  };

  const handleSubmitDelete = async () => {
    setIsLoading(true);
    
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setIsLoading(false);
    handleCloseDeleteModal();
    alert('Utilisateur supprimé avec succès !');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'inactive': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'farmer': return 'text-green-600 bg-green-50';
      case 'buyer': return 'text-blue-600 bg-blue-50';
      case 'admin': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              Gestion des Utilisateurs
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez les agriculteurs, acheteurs et administrateurs de la plateforme
            </p>
          </div>
          <button
            onClick={handleAddUser}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvel Utilisateur
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(user => user.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En Attente</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(user => user.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactifs</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(user => user.status === 'inactive').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <DataTable
          data={users}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>

      {/* Modals */}
      {/* Modal d'ajout d'utilisateur */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title="Nouvel Utilisateur"
        type="default"
        size="md"
      >
        <ModalForm
          onSubmit={handleSubmitUser}
          onCancel={handleCloseModal}
          submitText="Créer l'utilisateur"
          isLoading={isLoading}
        >
          <UserForm user={newUser} onChange={handleInputChange} />
        </ModalForm>
      </Modal>

      {/* Modal d'édition d'utilisateur */}
      <Modal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        title="Modifier l'Utilisateur"
        type="info"
        size="md"
      >
        <ModalForm
          onSubmit={handleSubmitEdit}
          onCancel={handleCloseEditModal}
          submitText="Modifier l'utilisateur"
          isLoading={isLoading}
        >
          <UserForm user={newUser} onChange={handleInputChange} />
        </ModalForm>
      </Modal>

      {/* Modal de visualisation d'utilisateur */}
      <Modal
        isOpen={showViewModal}
        onClose={handleCloseViewModal}
        title="Détails de l'Utilisateur"
        type="default"
        size="lg"
      >
        {viewingUser && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Personnelles</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Nom complet</p>
                      <p className="font-medium text-gray-900">{viewingUser.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{viewingUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Téléphone</p>
                      <p className="font-medium text-gray-900">{viewingUser.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Date d'inscription</p>
                      <p className="font-medium text-gray-900">
                        {new Date(viewingUser.joinDate).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut et Activité</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(viewingUser.status)}`}>
                      {viewingUser.status === 'active' && 'Actif'}
                      {viewingUser.status === 'pending' && 'En attente'}
                      {viewingUser.status === 'inactive' && 'Inactif'}
                    </span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(viewingUser.role)}`}>
                      {viewingUser.role === 'farmer' && 'Agriculteur'}
                      {viewingUser.role === 'buyer' && 'Acheteur'}
                      {viewingUser.role === 'admin' && 'Administrateur'}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Commandes :</strong> {viewingUser.ordersCount}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Montant total :</strong> €{viewingUser.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={() => {
                  handleCloseViewModal();
                  handleEdit(viewingUser);
                }}
                className="px-4 py-2 bg-[#1E90FF] text-white rounded-lg hover:bg-[#1E90FF]/90 transition-colors duration-200"
              >
                Modifier
              </button>
              <button
                onClick={handleCloseViewModal}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de suppression d'utilisateur */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        title="Supprimer l'Utilisateur"
        type="error"
        size="sm"
      >
        {deletingUser && (
          <div className="space-y-4">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <div>
                <p className="text-gray-900 font-medium">
                  Êtes-vous sûr de vouloir supprimer cet utilisateur ?
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Cette action est irréversible.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Nom :</strong> {deletingUser.name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Email :</strong> {deletingUser.email}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Rôle :</strong> {deletingUser.role === 'farmer' ? 'Agriculteur' : deletingUser.role === 'buyer' ? 'Acheteur' : 'Administrateur'}
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={handleSubmitDelete}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Trash2 className="h-4 w-4 mr-2" />
                )}
                Supprimer
              </button>
              <button
                onClick={handleCloseDeleteModal}
                disabled={isLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
export default UsersManagement;
