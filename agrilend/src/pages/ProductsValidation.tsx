import React, { useState, useMemo, useCallback } from 'react';
import { Package, CheckCircle, XCircle, Clock, User, Calendar, DollarSign, AlertTriangle, Star, Shield } from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';
import { ManagementPage } from '../components/ManagementPage';
import Modal from '../components/Modal';
import ModalForm from '../components/ModalForm';
import FormField from '../components/FormField';

// Type pour les offres de produits
interface ProductOffer {
  id: number;
  product: string;
  description: string;
  farmer: string;
  quantity: number;
  unitPrice: number;
  qualityGrade: 'A' | 'B' | 'C';
  category: 'vegetables' | 'fruits' | 'grains' | 'livestock' | 'other';
  location: string;
  availabilityDate: string;
  expiryDate: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  images?: string[];
  certifications?: string[];
}

// Composant spécialisé pour les actions de validation de produit
interface ProductValidationActionsProps {
  productOffer: ProductOffer;
  onApprove: (productOffer: ProductOffer) => void;
  onReject: (productOffer: ProductOffer) => void;
  onRequestInfo: (productOffer: ProductOffer) => void;
}

const ProductValidationActions: React.FC<ProductValidationActionsProps> = ({ productOffer, onApprove, onReject, onRequestInfo }) => {
  const getStatusColor = (status: ProductOffer['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (grade: ProductOffer['qualityGrade']) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      case 'C': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: ProductOffer['category']) => {
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
      {/* Informations du produit */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">Informations Générales</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium w-20">Produit:</span>
                <span>{productOffer.product}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Quantité:</span>
                <span>{productOffer.quantity} kg</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Prix:</span>
                <span className="font-semibold">{productOffer.unitPrice.toLocaleString()} FCFA/kg</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Statut:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(productOffer.status)}`}>
                  {productOffer.status.charAt(0).toUpperCase() + productOffer.status.slice(1)}
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
                <span className="ml-2">{productOffer.farmer}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Qualité:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(productOffer.qualityGrade)}`}>
                  Grade {productOffer.qualityGrade}
                </span>
              </div>
              <div className="flex items-center">
                <Package className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Catégorie:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(productOffer.category)}`}>
                  {productOffer.category.charAt(0).toUpperCase() + productOffer.category.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions disponibles */}
      <div className="flex flex-wrap gap-2">
        {productOffer.status === 'pending' && (
          <>
            <button
              onClick={() => onApprove(productOffer)}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approuver
            </button>
            <button
              onClick={() => onReject(productOffer)}
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
            </button>
            <button
              onClick={() => onRequestInfo(productOffer)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Demander infos
            </button>
          </>
        )}

        <button className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
          <Shield className="h-4 w-4 mr-2" />
          Vérifier certifications
        </button>
      </div>
    </div>
  );
};

// Configuration pour la page de validation des produits optimisée
const ProductsValidationOptimized: React.FC = () => {
  // États pour les modals spécialisés
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedProductOffer, setSelectedProductOffer] = useState<ProductOffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handlers pour les actions spécialisées
  const handleApprove = useCallback((productOffer: ProductOffer) => {
    setSelectedProductOffer(productOffer);
    setShowApproveModal(true);
  }, []);

  const handleReject = useCallback((productOffer: ProductOffer) => {
    setSelectedProductOffer(productOffer);
    setShowRejectModal(true);
  }, []);

  const handleRequestInfo = useCallback((productOffer: ProductOffer) => {
    setSelectedProductOffer(productOffer);
    setShowInfoModal(true);
  }, []);

  // Données d'exemple
  const productOffersData: ProductOffer[] = useMemo(() => [
    {
      id: 1,
      product: 'Tomates',
      description: 'Tomates fraîches de saison, cultivées sans pesticides',
      farmer: 'Jean Kouassi',
      quantity: 50,
      unitPrice: 800,
      qualityGrade: 'A',
      category: 'vegetables',
      location: 'Abidjan',
      availabilityDate: '2024-09-25',
      expiryDate: '2024-10-05',
      status: 'pending',
      createdAt: '2024-09-20',
      images: ['tomates1.jpg', 'tomates2.jpg'],
      certifications: ['Bio', 'ISO 22000']
    },
    {
      id: 2,
      product: 'Mangues Kent',
      description: 'Mangues Kent premium, récoltées à maturité',
      farmer: 'Fatou Keita',
      quantity: 100,
      unitPrice: 600,
      qualityGrade: 'A',
      category: 'fruits',
      location: 'Bouaké',
      availabilityDate: '2024-09-23',
      expiryDate: '2024-10-03',
      status: 'approved',
      createdAt: '2024-09-18',
      approvedAt: '2024-09-19',
      images: ['mangues1.jpg'],
      certifications: ['Bio']
    },
    {
      id: 3,
      product: 'Riz parfumé',
      description: 'Riz parfumé de qualité supérieure',
      farmer: 'Ibrahim Traoré',
      quantity: 200,
      unitPrice: 500,
      qualityGrade: 'B',
      category: 'grains',
      location: 'San-Pédro',
      availabilityDate: '2024-09-20',
      expiryDate: '2025-09-20',
      status: 'rejected',
      createdAt: '2024-09-15',
      rejectedAt: '2024-09-16',
      rejectionReason: 'Qualité insuffisante',
      images: ['riz1.jpg']
    },
    {
      id: 4,
      product: 'Avocats Hass',
      description: 'Avocats Hass, prêts à consommer',
      farmer: 'Aisha Diallo',
      quantity: 30,
      unitPrice: 1200,
      qualityGrade: 'A',
      category: 'fruits',
      location: 'Yamoussoukro',
      availabilityDate: '2024-09-22',
      expiryDate: '2024-10-02',
      status: 'pending',
      createdAt: '2024-09-19',
      images: ['avocats1.jpg', 'avocats2.jpg'],
      certifications: ['Bio', 'Fair Trade']
    }
  ], []);

  // Configuration des colonnes
  const columns = useMemo(() => {
    const columnHelper = createColumnHelper<ProductOffer>();
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
    columnHelper.accessor('quantity', {
      header: 'Quantité',
      cell: (info) => `${info.getValue()} kg`,
      enableSorting: true,
    }),
    columnHelper.accessor('unitPrice', {
      header: 'Prix Unitaire',
      cell: (info) => (
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
          <span className="font-semibold">{info.getValue().toLocaleString()} FCFA/kg</span>
        </div>
      ),
      enableSorting: true,
    }),
    columnHelper.accessor('qualityGrade', {
      header: 'Qualité',
      cell: (info) => {
        const grade = info.getValue();
        const colors = {
          A: 'bg-green-100 text-green-800',
          B: 'bg-yellow-100 text-yellow-800',
          C: 'bg-orange-100 text-orange-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[grade as keyof typeof colors]}`}>
            Grade {grade}
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
    columnHelper.accessor('status', {
      header: 'Statut',
      cell: (info) => {
        const status = info.getValue();
        const colors = {
          pending: 'bg-yellow-100 text-yellow-800',
          approved: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800'
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
    columnHelper.accessor('availabilityDate', {
      header: 'Disponibilité',
      cell: (info) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
          {info.getValue()}
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
            title="Approuver le produit"
          >
            <CheckCircle className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleReject(row.original)}
            className="text-red-600 hover:text-red-900 transition-colors"
            title="Rejeter le produit"
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
    { name: 'product', label: 'Nom du produit', type: 'text' as const, placeholder: 'Tomates', required: true },
    { name: 'description', label: 'Description', type: 'textarea' as const, placeholder: 'Description du produit...', required: true, rows: 3 },
    { name: 'farmer', label: 'Agriculteur', type: 'text' as const, placeholder: 'Nom de l\'agriculteur', required: true },
    { name: 'quantity', label: 'Quantité (kg)', type: 'number' as const, placeholder: '50', required: true, min: 1 },
    { name: 'unitPrice', label: 'Prix unitaire (FCFA/kg)', type: 'number' as const, placeholder: '800', required: true, min: 1 },
    {
      name: 'qualityGrade', label: 'Grade de qualité', type: 'select' as const, required: true,
      options: [
        { value: 'A', label: 'Grade A - Excellent' },
        { value: 'B', label: 'Grade B - Bon' },
        { value: 'C', label: 'Grade C - Acceptable' }
      ]
    },
    {
      name: 'category', label: 'Catégorie', type: 'select' as const, required: true,
      options: [
        { value: 'vegetables', label: 'Légumes' },
        { value: 'fruits', label: 'Fruits' },
        { value: 'grains', label: 'Céréales' },
        { value: 'livestock', label: 'Élevage' },
        { value: 'other', label: 'Autre' }
      ]
    },
    { name: 'location', label: 'Localisation', type: 'text' as const, placeholder: 'Abidjan, Côte d\'Ivoire', required: true },
    { name: 'availabilityDate', label: 'Date de disponibilité', type: 'date' as const, required: true },
    { name: 'expiryDate', label: 'Date d\'expiration', type: 'date' as const, required: true }
  ], []);

  // Configuration des champs de visualisation
  const viewFields = useMemo(() => [
    { key: 'product', label: 'Nom du produit' },
    { key: 'description', label: 'Description' },
    { key: 'farmer', label: 'Agriculteur' },
    { key: 'quantity', label: 'Quantité' },
    { key: 'unitPrice', label: 'Prix unitaire' },
    { key: 'qualityGrade', label: 'Grade de qualité' },
    { key: 'category', label: 'Catégorie' },
    { key: 'location', label: 'Localisation' },
    { key: 'availabilityDate', label: 'Date de disponibilité' },
    { key: 'expiryDate', label: 'Date d\'expiration' },
    { key: 'status', label: 'Statut' },
    { key: 'createdAt', label: 'Date de création' },
    { key: 'approvedAt', label: 'Date d\'approbation' },
    { key: 'rejectedAt', label: 'Date de rejet' },
    { key: 'rejectionReason', label: 'Raison du rejet' },
    { key: 'images', label: 'Images' },
    { key: 'certifications', label: 'Certifications' }
  ], []);

  // Configuration par défaut du formulaire
  const defaultFormData = useMemo(() => ({
    product: '',
    description: '',
    farmer: '',
    quantity: '',
    unitPrice: '',
    qualityGrade: 'A' as const,
    category: 'vegetables' as const,
    location: '',
    availabilityDate: '',
    expiryDate: '',
    status: 'pending' as const,
    createdAt: new Date().toISOString().split('T')[0],
    images: [],
    certifications: []
  }), []);

  // Règles de validation
  const validationRules = useMemo(() => ({
    product: (value: unknown) => {
      if (!value || (typeof value === 'string' && value.length < 2)) {
        return 'Le nom du produit doit contenir au moins 2 caractères';
      }
      return null;
    },
    description: (value: unknown) => {
      if (!value || (typeof value === 'string' && value.length < 10)) {
        return 'La description doit contenir au moins 10 caractères';
      }
      return null;
    },
    farmer: (value: unknown) => {
      if (!value || (typeof value === 'string' && value.length < 2)) {
        return 'Le nom de l\'agriculteur doit contenir au moins 2 caractères';
      }
      return null;
    },
    quantity: (value: unknown) => {
      if (!value || (typeof value === 'number' && value < 1)) {
        return 'La quantité doit être supérieure à 0';
      }
      return null;
    },
    unitPrice: (value: unknown) => {
      if (!value || (typeof value === 'number' && value < 1)) {
        return 'Le prix unitaire doit être supérieur à 0';
      }
      return null;
    },
    qualityGrade: (value: unknown) => {
      if (!value) {
        return 'Le grade de qualité est requis';
      }
      return null;
    },
    category: (value: unknown) => {
      if (!value) {
        return 'La catégorie est requise';
      }
      return null;
    },
    location: (value: unknown) => {
      if (!value || (typeof value === 'string' && value.length < 3)) {
        return 'La localisation doit contenir au moins 3 caractères';
      }
      return null;
    },
    availabilityDate: (value: unknown) => {
      if (!value) {
        return 'La date de disponibilité est requise';
      }
      return null;
    },
    expiryDate: (value: unknown) => {
      if (!value) {
        return 'La date d\'expiration est requise';
      }
      return null;
    }
  }), []);

  // Statistiques
  const stats = useMemo(() => [
    {
      label: 'Total Offres',
      value: productOffersData.length,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'En Attente',
      value: productOffersData.filter(p => p.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      label: 'Approuvées',
      value: productOffersData.filter(p => p.status === 'approved').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      label: 'Rejetées',
      value: productOffersData.filter(p => p.status === 'rejected').length,
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ], [productOffersData]);

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'API optimisée
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setIsLoading(false);
    setShowApproveModal(false);
    setSelectedProductOffer(null);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'API optimisée
    await new Promise(resolve => setTimeout(resolve, 200));
    
    setIsLoading(false);
    setShowRejectModal(false);
    setSelectedProductOffer(null);
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulation d'API optimisée
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log('Requesting info for product offer:', selectedProductOffer);
    setIsLoading(false);
    setShowInfoModal(false);
    setSelectedProductOffer(null);
  };

  const config = useMemo(() => ({
    title: 'Validation des Produits',
    description: 'Validez les offres de produits des agriculteurs, assurez la qualité et la conformité',
    icon: Package,
    stats,
    formFields,
    viewFields,
    columns: (_columnHelper: ReturnType<typeof createColumnHelper<ProductOffer>>) => columns as ColumnDef<ProductOffer, unknown>[],
    defaultFormData,
    validationRules
  }), [stats, formFields, viewFields, columns, defaultFormData, validationRules]);

  return (
    <>
      <ManagementPage<ProductOffer>
        config={config}
        data={productOffersData}
      />

      {/* Modal d'approbation */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approuver un Produit"
        size="md"
      >
        {selectedProductOffer && (
          <ProductValidationActions
            productOffer={selectedProductOffer}
            onApprove={handleApprove}
            onReject={handleReject}
            onRequestInfo={handleRequestInfo}
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
        title="Rejeter un Produit"
        size="md"
      >
        {selectedProductOffer && (
          <ProductValidationActions
            productOffer={selectedProductOffer}
            onApprove={handleApprove}
            onReject={handleReject}
            onRequestInfo={handleRequestInfo}
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
              { value: 'quality-insufficient', label: 'Qualité insuffisante' },
              { value: 'price-too-high', label: 'Prix trop élevé' },
              { value: 'missing-documents', label: 'Documents manquants' },
              { value: 'certification-issue', label: 'Problème de certification' },
              { value: 'other', label: 'Autre' }
            ]}
          />
          <FormField
            label="Commentaire détaillé"
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

      {/* Modal de demande d'informations */}
      <Modal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title="Demander des Informations"
        size="md"
      >
        {selectedProductOffer && (
          <ProductValidationActions
            productOffer={selectedProductOffer}
            onApprove={handleApprove}
            onReject={handleReject}
            onRequestInfo={handleRequestInfo}
          />
        )}
        
        <ModalForm
          onSubmit={handleInfoSubmit}
          onCancel={() => setShowInfoModal(false)}
          submitText="Envoyer demande"
          isLoading={isLoading}
        >
          <FormField
            label="Type d'information demandée"
            name="infoType"
            type="select"
            value=""
            onChange={() => {}}
            required
            options={[
              { value: 'certification', label: 'Certifications' },
              { value: 'quality-test', label: 'Tests de qualité' },
              { value: 'origin-proof', label: 'Preuve d\'origine' },
              { value: 'storage-conditions', label: 'Conditions de stockage' },
              { value: 'other', label: 'Autre' }
            ]}
          />
          <FormField
            label="Message à l'agriculteur"
            name="messageToFarmer"
            type="textarea"
            value=""
            onChange={() => {}}
            placeholder="Message détaillé pour l'agriculteur..."
            required
            rows={4}
          />
        </ModalForm>
      </Modal>
    </>
  );
};

export default ProductsValidationOptimized;
