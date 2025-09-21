import React, { useState, useMemo, useCallback } from 'react';
import { ShoppingCart, CheckCircle, XCircle, Clock, Package, User, Calendar, DollarSign, Truck, Lock, Unlock } from 'lucide-react';
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { ManagementPage } from '../components/ManagementPage';
import Modal from '../components/Modal';
import ModalForm from '../components/ModalForm';
import FormField from '../components/FormField';
import { Order } from '../types';

// Composant spécialisé pour les actions de commande
interface OrderActionsProps {
  order: Order;
  onApprove: (order: Order) => void;
  onCancel: (order: Order) => void;
  onRelease: (order: Order) => void;
}

const OrderActions: React.FC<OrderActionsProps> = ({ order, onApprove, onCancel, onRelease }) => {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'sequestered': return 'bg-blue-100 text-blue-800';
      case 'released': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: Order['category']) => {
    switch (category) {
      case 'vegetables': return 'bg-green-100 text-green-800';
      case 'fruits': return 'bg-orange-100 text-orange-800';
      case 'grains': return 'bg-yellow-100 text-yellow-800';
      case 'livestock': return 'bg-red-100 text-red-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {/* Informations de la commande */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Informations Générales</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium w-20">Produit:</span>
                <span>{order.product}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Quantité:</span>
                <span>{order.quantity} kg</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Statut:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Détails</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Agriculteur:</span>
                <span className="ml-2">{order.farmer}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Acheteur:</span>
                <span className="ml-2">{order.buyer}</span>
              </div>
              <div className="flex items-center">
                <Package className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Catégorie:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(order.category)}`}>
                  {order.category.charAt(0).toUpperCase() + order.category.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions disponibles */}
      <div className="flex flex-wrap gap-2">
        {order.status === 'pending' && (
          <>
            <button
              onClick={() => onApprove(order)}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approuver
            </button>
            <button
              onClick={() => onCancel(order)}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Annuler
            </button>
          </>
        )}
        
        {order.status === 'sequestered' && (
          <button
            onClick={() => onRelease(order)}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Unlock className="h-4 w-4 mr-2" />
            Libérer les fonds
          </button>
        )}

        {order.status === 'released' && (
          <button
            onClick={() => onApprove(order)}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Truck className="h-4 w-4 mr-2" />
            Marquer livré
          </button>
        )}

        <button className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          <Calendar className="h-4 w-4 mr-2" />
          Planifier livraison
        </button>
      </div>
    </div>
  );
};

// Configuration pour la page de gestion des commandes optimisée
const OrdersManagementOptimized: React.FC = () => {
  // États pour les modals spécialisés
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Données d'exemple
  const ordersData: Order[] = useMemo(() => [
    {
      id: 1,
      product: 'Tomates',
      description: 'Tomates fraîches de saison',
      farmer: 'Jean Kouassi',
      buyer: 'Restaurant Le Gourmet',
      quantity: 50,
      unitPrice: 800,
      totalAmount: 40000,
      status: 'pending',
      orderDate: '2024-09-20',
      deliveryDate: '2024-09-25',
      location: 'Abidjan',
      category: 'vegetables',
      sequesterAmount: 40000,
      platformFee: 2000,
      hederaTxId: '0.0.1234567@1678888888.123456789'
    },
    {
      id: 2,
      product: 'Mangues',
      description: 'Mangues Kent premium',
      farmer: 'Fatou Keita',
      buyer: 'Supermarché Fraîcheur',
      quantity: 100,
      unitPrice: 600,
      totalAmount: 60000,
      status: 'sequestered',
      orderDate: '2024-09-18',
      deliveryDate: '2024-09-23',
      location: 'Bouaké',
      category: 'fruits',
      sequesterAmount: 60000,
      platformFee: 3000,
      hederaTxId: '0.0.7654321@1678999999.987654321'
    },
    {
      id: 3,
      product: 'Riz',
      description: 'Riz parfumé de qualité supérieure',
      farmer: 'Ibrahim Traoré',
      buyer: 'Grossiste Céréales',
      quantity: 200,
      unitPrice: 500,
      totalAmount: 100000,
      status: 'delivered',
      orderDate: '2024-09-15',
      deliveryDate: '2024-09-20',
      location: 'San-Pédro',
      category: 'grains',
      sequesterAmount: 100000,
      platformFee: 5000,
      hederaTxId: '0.0.9876543@1678777777.543210987'
    },
    {
      id: 4,
      product: 'Avocats',
      description: 'Avocats Hass',
      farmer: 'Aisha Diallo',
      buyer: 'Hôtel Ivoire',
      quantity: 30,
      unitPrice: 1200,
      totalAmount: 36000,
      status: 'cancelled',
      orderDate: '2024-09-10',
      deliveryDate: '2024-09-15',
      location: 'Yamoussoukro',
      category: 'fruits',
      sequesterAmount: 36000,
      platformFee: 1800,
      hederaTxId: '0.0.1122334@1679111111.223344556'
    }
  ], []);

  // Handlers pour les actions spécialisées
  const handleApprove = useCallback((order: Order) => {
    setSelectedOrder(order);
    setShowApproveModal(true);
  }, []);

  const handleCancel = useCallback((order: Order) => {
    setSelectedOrder(order);
    setShowCancelModal(true);
  }, []);

  const handleRelease = useCallback((order: Order) => {
    setSelectedOrder(order);
    setShowReleaseModal(true);
  }, []);

  // Configuration des colonnes
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<Order>();
    return [
    columnHelper.accessor('product', {
      header: 'Produit',
      cell: (info) => (
        <div className="flex items-center">
          <Package className="h-5 w-5 text-gray-500 mr-2" />
          <div>
            <div className="font-medium">{info.getValue()}</div>
            <div className="text-sm text-gray-500">{info.row.original.description}</div>
          </div>
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('farmer', {
      header: 'Agriculteur',
      cell: (info) => (
        <div className="flex items-center">
          <User className="h-4 w-4 text-gray-500 mr-2" />
          {info.getValue()}
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('buyer', {
      header: 'Acheteur',
      cell: (info) => (
        <div className="flex items-center">
          <User className="h-4 w-4 text-gray-500 mr-2" />
          {info.getValue()}
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('quantity', {
      header: 'Quantité',
      cell: (info) => `${info.getValue()} kg`,
      enableSorting: true,
    }),
    columnHelper.accessor('totalAmount', {
      header: 'Montant Total',
      cell: (info) => (
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
          {info.getValue().toLocaleString()} FCFA
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
          sequestered: 'bg-blue-100 text-blue-800',
          released: 'bg-green-100 text-green-800',
          delivered: 'bg-green-100 text-green-800',
          cancelled: 'bg-red-100 text-red-800'
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
    columnHelper.accessor('category', {
      header: 'Catégorie',
      cell: (info) => {
        const category = info.getValue();
        const colors = {
          vegetables: 'bg-green-100 text-green-800',
          fruits: 'bg-orange-100 text-orange-800',
          grains: 'bg-yellow-100 text-yellow-800',
          livestock: 'bg-red-100 text-red-800',
          other: 'bg-gray-100 text-gray-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[category as keyof typeof colors]}`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        );
      },
      enableSorting: true,
      enableColumnFilter: true,
    }),
    columnHelper.accessor('orderDate', {
      header: 'Date Commande',
      cell: (info) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
          {info.getValue()}
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('deliveryDate', {
      header: 'Date Livraison',
      cell: (info) => (
        <div className="flex items-center">
          <Truck className="h-4 w-4 text-gray-500 mr-2" />
          {info.getValue() || 'Non définie'}
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
            title="Approuver la commande"
          >
            <CheckCircle className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleCancel(row.original)}
            className="text-red-600 hover:text-red-900 transition-colors"
            title="Annuler la commande"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      ),
    }),
    ];
  }, [handleApprove, handleCancel]);

  // Configuration des champs du formulaire
  const formFields = useMemo(() => [
    { name: 'product', label: 'Produit', type: 'text', placeholder: 'Tomates', required: true },
    { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Description du produit...', required: true, rows: 3 },
    { name: 'farmer', label: 'Agriculteur', type: 'text', placeholder: 'Nom de l\'agriculteur', required: true },
    { name: 'buyer', label: 'Acheteur', type: 'text', placeholder: 'Nom de l\'acheteur', required: true },
    { name: 'quantity', label: 'Quantité (kg)', type: 'number', placeholder: '50', required: true, min: 1 },
    { name: 'unitPrice', label: 'Prix unitaire (FCFA)', type: 'number', placeholder: '800', required: true, min: 1 },
    { name: 'location', label: 'Localisation', type: 'text', placeholder: 'Abidjan, Côte d\'Ivoire', required: true },
    {
      name: 'category', label: 'Catégorie', type: 'select', required: true,
      options: [
        { value: 'vegetables', label: 'Légumes' },
        { value: 'fruits', label: 'Fruits' },
        { value: 'grains', label: 'Céréales' },
        { value: 'livestock', label: 'Élevage' },
        { value: 'other', label: 'Autre' }
      ]
    },
    { name: 'deliveryDate', label: 'Date de livraison', type: 'date', required: true }
  ], []);

  // Configuration des champs de visualisation
  const viewFields = useMemo(() => [
    { key: 'product', label: 'Produit' },
    { key: 'description', label: 'Description' },
    { key: 'farmer', label: 'Agriculteur' },
    { key: 'buyer', label: 'Acheteur' },
    { key: 'quantity', label: 'Quantité' },
    { key: 'unitPrice', label: 'Prix unitaire' },
    { key: 'totalAmount', label: 'Montant total' },
    { key: 'status', label: 'Statut' },
    { key: 'orderDate', label: 'Date de commande' },
    { key: 'deliveryDate', label: 'Date de livraison' },
    { key: 'location', label: 'Localisation' },
    { key: 'category', label: 'Catégorie' },
    { key: 'sequesterAmount', label: 'Montant séquestré' },
    { key: 'platformFee', label: 'Frais de plateforme' },
    { key: 'hederaTxId', label: 'ID Transaction Hedera' }
  ], []);

  // Configuration par défaut du formulaire
  const defaultFormData = useMemo(() => ({
    product: '',
    description: '',
    farmer: '',
    buyer: '',
    quantity: '',
    unitPrice: '',
    totalAmount: 0,
    status: 'pending' as const,
    orderDate: new Date().toISOString().split('T')[0],
    deliveryDate: '',
    location: '',
    category: 'vegetables' as const,
    sequesterAmount: 0,
    platformFee: 0
  }), []);

  // Règles de validation
  const validationRules = useMemo(() => ({
    product: { required: true, minLength: 2 },
    description: { required: true, minLength: 10 },
    farmer: { required: true, minLength: 2 },
    buyer: { required: true, minLength: 2 },
    quantity: { required: true, min: 1 },
    unitPrice: { required: true, min: 1 },
    location: { required: true, minLength: 3 },
    category: { required: true },
    deliveryDate: { required: true }
  }), []);

  // Statistiques
  const stats = useMemo(() => [
    {
      label: 'Total Commandes',
      value: ordersData.length,
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'En Attente',
      value: ordersData.filter(o => o.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'Séquestrées',
      value: ordersData.filter(o => o.status === 'sequestered').length,
      icon: Lock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Livrées',
      value: ordersData.filter(o => o.status === 'delivered').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    }
  ], [ordersData]);

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'API optimisée
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setIsLoading(false);
    setShowApproveModal(false);
    setSelectedOrder(null);
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'API optimisée
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setIsLoading(false);
    setShowCancelModal(false);
    setSelectedOrder(null);
  };

  const handleReleaseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'API optimisée
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setIsLoading(false);
    setShowReleaseModal(false);
    setSelectedOrder(null);
  };

  const config = useMemo(() => ({
    title: 'Gestion des Commandes',
    description: 'Gérez les commandes entre agriculteurs et acheteurs, supervisez les paiements séquestrés',
    icon: ShoppingCart,
    stats,
    formFields,
    viewFields,
    columns: (_columnHelper: ReturnType<typeof createColumnHelper<Order>>) => columns as ColumnDef<Order, unknown>[],
    defaultFormData,
    validationRules
  }), [stats, formFields, viewFields, columns, defaultFormData, validationRules]);

  return (
    <>
      <ManagementPage<Order>
        config={config}
        data={ordersData}
      />

      {/* Modal d'approbation */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approuver une Commande"
        size="md"
      >
        {selectedOrder && (
          <OrderActions
            order={selectedOrder}
            onApprove={handleApprove}
            onCancel={handleCancel}
            onRelease={handleRelease}
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

      {/* Modal d'annulation */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Annuler une Commande"
        size="md"
      >
        {selectedOrder && (
          <OrderActions
            order={selectedOrder}
            onApprove={handleApprove}
            onCancel={handleCancel}
            onRelease={handleRelease}
          />
        )}
        
        <ModalForm
          onSubmit={handleCancelSubmit}
          onCancel={() => setShowCancelModal(false)}
          submitText="Annuler"
          isLoading={isLoading}
          submitVariant="danger"
        >
          <FormField
            label="Raison de l'annulation"
            name="cancellationReason"
            type="select"
            value=""
            onChange={() => {}}
            required
            options={[
              { value: 'farmer-unavailable', label: 'Agriculteur indisponible' },
              { value: 'buyer-request', label: 'Demande de l\'acheteur' },
              { value: 'quality-issue', label: 'Problème de qualité' },
              { value: 'logistics-issue', label: 'Problème logistique' },
              { value: 'other', label: 'Autre' }
            ]}
          />
          <FormField
            label="Commentaire"
            name="cancellationComment"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Détails de l'annulation..."
            required
            rows={3}
          />
        </ModalForm>
      </Modal>

      {/* Modal de libération des fonds */}
      <Modal
        isOpen={showReleaseModal}
        onClose={() => setShowReleaseModal(false)}
        title="Libérer les Fonds"
        size="md"
      >
        {selectedOrder && (
          <OrderActions
            order={selectedOrder}
            onApprove={handleApprove}
            onCancel={handleCancel}
            onRelease={handleRelease}
          />
        )}
        
        <ModalForm
          onSubmit={handleReleaseSubmit}
          onCancel={() => setShowReleaseModal(false)}
          submitText="Libérer"
          isLoading={isLoading}
        >
          <FormField
            label="Montant à libérer (FCFA)"
            name="releaseAmount"
            type="number"
            value=""
            onChange={() => {}}
            placeholder="0"
            required
            min={0}
          />
          <FormField
            label="Commentaire de libération"
            name="releaseComment"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Raison de la libération des fonds..."
            rows={3}
          />
        </ModalForm>
      </Modal>
    </>
  );
};

export default OrdersManagementOptimized;