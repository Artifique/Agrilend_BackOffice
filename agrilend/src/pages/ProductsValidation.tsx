import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Package,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  DollarSign,
  AlertTriangle,
  Star,
  Clock,
  Shield,

} from "lucide-react";

import { ColumnDef } from "@tanstack/react-table";
import { ManagementPage } from "../components/ManagementPage";
import Modal from "../components/Modal";
import ModalForm from "../components/ModalForm";
import FormField from "../components/FormField";
import { Button } from "../components/ui";

// Type pour les offres de produits (aligné avec le schéma SQL)
interface ProductOffer {
  id: number; // offers.id
  productId: number; // products.id
  farmerId: number; // offers.farmer_id
  farmerName: string; // Derived from farmerId -> users table
  productName: string; // products.name
  description: string; // products.description
  category: "vegetables" | "fruits" | "grains" | "livestock" | "other"; // products.category
  subcategory?: string; // products.subcategory
  quantity: number; // offers.quantity
  quantityUnit: "KG" | "TONNE" | "LITRE" | "PIECE" | "BOITE" | "PALETTE"; // offers.quantity_unit
  suggestedPrice: number; // offers.suggested_price
  finalPriceForBuyer?: number; // offers.final_price_for_buyer
  finalPriceForFarmer?: number; // offers.final_price_for_farmer
  platformMarginPercentage?: number; // offers.platform_margin_percentage
  qualityGrade: "A" | "B" | "C"; // offers.quality_grade
  originLocation: string; // offers.origin_location
  productionMethod?: "CONVENTIONAL" | "ORGANIC" | "HYDROPONIC" | "PERMACULTURE"; // offers.production_method
  harvestDate?: string; // offers.harvest_date
  availabilityDate: string; // offers.availability_date
  expiryDate?: string; // offers.expiry_date
  status:
    | "DRAFT"
    | "PENDING_VALIDATION"
    | "ACTIVE"
    | "SOLD_OUT"
    | "EXPIRED"
    | "REJECTED"; // offers.status
  adminValidated: boolean; // offers.admin_validated
  validatedBy?: number; // offers.validated_by
  validatedAt?: string; // offers.validated_at
  rejectionReason?: string; // offers.rejection_reason
  createdAt: string; // offers.created_at
  updatedAt?: string; // offers.updated_at
  imageUrl?: string; // products.image_url
  nutritionalInfo?: string; // products.nutritional_info (JSON string)
  storageConditions?: string; // products.storage_conditions
  shelfLifeDays?: number; // products.shelf_life_days
  certifications?: string; // farmers.certifications (JSON string)
}

// Composant spécialisé pour les actions de validation de produit
interface ProductValidationActionsProps {
  productOffer: ProductOffer;
  onApprove: (productOffer: ProductOffer) => void;
  onReject: (productOffer: ProductOffer) => void;
  onRequestInfo: (productOffer: ProductOffer) => void;
}

const ProductValidationActions: React.FC<ProductValidationActionsProps> = ({
  productOffer,
  onApprove,
  onReject,
  onRequestInfo,
}) => {
  const getStatusColor = (status: ProductOffer["status"]) => {
    switch (status) {
      case "PENDING_VALIDATION":
        return "bg-yellow-100 text-yellow-800";
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getQualityColor = (grade: ProductOffer["qualityGrade"]) => {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-800";
      case "B":
        return "bg-yellow-100 text-yellow-800";
      case "C":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: ProductOffer["category"]) => {
    switch (category) {
      case "vegetables":
        return "bg-green-100 text-green-800";
      case "fruits":
        return "bg-orange-100 text-orange-800";
      case "grains":
        return "bg-yellow-100 text-yellow-800";
      case "livestock":
        return "bg-red-100 text-red-800";
      case "other":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Informations du produit */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Informations Générales
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="font-medium w-20">Produit:</span>
                <span>{productOffer.productName}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Quantité:</span>
                <span>
                  {productOffer.quantity} {productOffer.quantityUnit}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Prix Suggéré:</span>
                <span className="font-semibold">
                  {productOffer.suggestedPrice.toLocaleString()} FCFA/
                  {productOffer.quantityUnit}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Statut:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    productOffer.status
                  )}`}
                >
                  {productOffer.status
                    .replace("_", " ")
                    .charAt(0)
                    .toUpperCase() +
                    productOffer.status.replace("_", " ").slice(1)}
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
                <span className="ml-2">{productOffer.farmerName}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Qualité:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getQualityColor(
                    productOffer.qualityGrade
                  )}`}
                >
                  Grade {productOffer.qualityGrade}
                </span>
              </div>
              <div className="flex items-center">
                <Package className="h-4 w-4 text-gray-500 mr-2" />
                <span className="font-medium">Catégorie:</span>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                    productOffer.category
                  )}`}
                >
                  {productOffer.category.charAt(0).toUpperCase() +
                    productOffer.category.slice(1)}
                </span>
              </div>
              {productOffer.certifications && (
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="font-medium">Certifications:</span>
                  <span className="ml-2">{productOffer.certifications}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions disponibles */}
      <div className="flex flex-wrap gap-2">
        {productOffer.status === "PENDING_VALIDATION" && (
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
  const [productOffers, setProductOffers] = useState<ProductOffer[]>([]); // State to hold fetched product offers
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedProductOffer, setSelectedProductOffer] =
    useState<ProductOffer | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProductOffers = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockProductOffers: ProductOffer[] = [
      {
        id: 1,
        productId: 101,
        farmerId: 1,
        farmerName: "Jean Kouassi",
        productName: "Tomates",
        description: "Tomates fraîches de saison, cultivées sans pesticides",
        category: "vegetables",
        subcategory: "Cerise",
        quantity: 50,
        quantityUnit: "KG",
        suggestedPrice: 800,
        qualityGrade: "A",
        originLocation: "Abidjan",
        productionMethod: "CONVENTIONAL",
        harvestDate: "2024-09-20",
        availabilityDate: "2024-09-25",
        expiryDate: "2024-10-05",
        status: "PENDING_VALIDATION",
        adminValidated: false,
        createdAt: "2024-09-20",
        imageUrl: "https://example.com/tomates1.jpg",
        certifications: '["Bio", "ISO 22000"]',
      },
      {
        id: 2,
        productId: 102,
        farmerId: 2,
        farmerName: "Fatou Keita",
        productName: "Mangues Kent",
        description: "Mangues Kent premium, récoltées à maturité",
        category: "fruits",
        quantity: 100,
        quantityUnit: "PIECE",
        suggestedPrice: 600,
        qualityGrade: "A",
        originLocation: "Bouaké",
        productionMethod: "ORGANIC",
        harvestDate: "2024-09-18",
        availabilityDate: "2024-09-23",
        expiryDate: "2024-10-03",
        status: "ACTIVE",
        adminValidated: true,
        validatedAt: "2024-09-19",
        createdAt: "2024-09-18",
        imageUrl: "https://example.com/mangues1.jpg",
        certifications: '["Bio"]',
      },
      {
        id: 3,
        productId: 103,
        farmerId: 3,
        farmerName: "Ibrahim Traoré",
        productName: "Riz parfumé",
        description: "Riz parfumé de qualité supérieure",
        category: "grains",
        quantity: 200,
        quantityUnit: "KG",
        suggestedPrice: 500,
        qualityGrade: "C",
        originLocation: "San-Pédro",
        productionMethod: "CONVENTIONAL",
        harvestDate: "2024-09-10",
        availabilityDate: "2024-09-20",
        expiryDate: "2025-09-20",
        status: "REJECTED",
        adminValidated: false,
        rejectionReason: "Qualité insuffisante",
        createdAt: "2024-09-15",
        imageUrl: "https://example.com/riz1.jpg",
      },
      {
        id: 4,
        productId: 104,
        farmerId: 4,
        farmerName: "Aisha Diallo",
        productName: "Avocats Hass",
        description: "Avocats Hass, prêts à consommer",
        category: "fruits",
        quantity: 30,
        quantityUnit: "PIECE",
        suggestedPrice: 1200,
        qualityGrade: "A",
        originLocation: "Yamoussoukro",
        productionMethod: "ORGANIC",
        harvestDate: "2024-09-19",
        availabilityDate: "2024-09-22",
        expiryDate: "2024-10-02",
        status: "PENDING_VALIDATION",
        adminValidated: false,
        createdAt: "2024-09-19",
        imageUrl: "https://example.com/avocats1.jpg",
        certifications: '["Bio", "Fair Trade"]',
      },
    ];
    setProductOffers(mockProductOffers);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProductOffers();
  }, []);

  const handleApprove = useCallback((offer: ProductOffer) => {
    setSelectedProductOffer(offer);
    setShowApproveModal(true);
  }, []);

  const handleReject = useCallback((offer: ProductOffer) => {
    setSelectedProductOffer(offer);
    setShowRejectModal(true);
  }, []);

  const handleRequestInfo = useCallback((offer: ProductOffer) => {
    setSelectedProductOffer(offer);
    setShowInfoModal(true);
  }, []);

  const columns = useMemo<ColumnDef<ProductOffer>[]>(
    () => [
      {
        accessorKey: "productName",
        header: "Produit",
        cell: ({ row }: { row: { original: ProductOffer } }) => (
          <div className="flex items-center">
            <Package className="h-5 w-5 text-gray-500 mr-2" />
            <div>
              <div className="font-medium">{row.original.productName}</div>
              <div className="text-sm text-gray-500">
                {row.original.description}
              </div>
            </div>
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "farmerName",
        header: "Agriculteur",
        cell: ({ row }: { row: { original: ProductOffer } }) => (
          <div className="flex items-center">
            <User className="h-4 w-4 text-gray-500 mr-2" />
            {row.original.farmerName}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "quantity",
        header: "Quantité",
        cell: ({ row }: { row: { original: ProductOffer } }) =>
          `${row.original.quantity} ${row.original.quantityUnit}`,
        enableSorting: true,
      },
      {
        accessorKey: "suggestedPrice",
        header: "Prix Suggéré",
        cell: ({ row }: { row: { original: ProductOffer } }) => (
          <div className="flex items-center">
            <DollarSign className="h-4 w-4 text-gray-500 mr-2" />
            <span className="font-semibold">
              {row.original.suggestedPrice.toLocaleString()} FCFA/
              {row.original.quantityUnit}
            </span>
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: "qualityGrade",
        header: "Qualité",
        cell: ({ row }: { row: { original: ProductOffer } }) => {
          const grade = row.original.qualityGrade;
          const colors = {
            A: "bg-green-100 text-green-800",
            B: "bg-yellow-100 text-yellow-800",
            C: "bg-orange-100 text-orange-800",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                colors[grade as keyof typeof colors]
              }`}
            >
              Grade {grade}
            </span>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "category",
        header: "Catégorie",
        cell: ({ row }: { row: { original: ProductOffer } }) => {
          const category = row.original.category;
          const colors = {
            vegetables: "bg-green-100 text-green-800",
            fruits: "bg-orange-100 text-orange-800",
            grains: "bg-yellow-100 text-yellow-800",
            livestock: "bg-red-100 text-red-800",
            other: "bg-gray-100 text-gray-800",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                colors[category as keyof typeof colors]
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }: { row: { original: ProductOffer } }) => {
          const status = row.original.status;
          const colors = {
            PENDING_VALIDATION: "bg-yellow-100 text-yellow-800",
            ACTIVE: "bg-green-100 text-green-800",
            REJECTED: "bg-red-100 text-red-800",
            DRAFT: "bg-gray-100 text-gray-800",
            SOLD_OUT: "bg-purple-100 text-purple-800",
            EXPIRED: "bg-gray-400 text-gray-900",
          };
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                colors[status as keyof typeof colors]
              }`}
            >
              {status.replace("_", " ").charAt(0).toUpperCase() +
                status.replace("_", " ").slice(1)}
            </span>
          );
        },
        enableSorting: true,
        enableColumnFilter: true,
      },
      {
        accessorKey: "availabilityDate",
        header: "Disponibilité",
        cell: ({ row }: { row: { original: ProductOffer } }) => (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 text-gray-500 mr-2" />
            {row.original.availabilityDate}
          </div>
        ),
        enableSorting: true,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: { original: ProductOffer } }) => (
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => handleApprove(row.original)}
              className="text-green-600 hover:text-green-900 transition-colors"
            >
              <CheckCircle className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => handleReject(row.original)}
              className="text-red-600 hover:text-red-900 transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </Button>
          </div>
        ),
      },
    ],
    [handleApprove, handleReject]
  );

  const formFields = useMemo(
    () => [
      {
        name: "productName",
        label: "Nom du produit",
        type: "text" as const,
        placeholder: "Tomates",
        required: true,
      },
      {
        name: "description",
        label: "Description",
        type: "textarea" as const,
        placeholder: "Description du produit...",
        required: true,
        rows: 3,
      },
      {
        name: "farmerName",
        label: "Agriculteur",
        type: "text" as const,
        placeholder: "Nom de l'agriculteur",
        required: true,
      },
      {
        name: "quantity",
        label: "Quantité",
        type: "number" as const,
        placeholder: "50",
        required: true,
        min: 1,
      },
      {
        name: "quantityUnit",
        label: "Unité de Quantité",
        type: "select" as const,
        required: true,
        options: [
          { value: "KG", label: "Kilogramme (KG)" },
          { value: "TONNE", label: "Tonne" },
          { value: "LITRE", label: "Litre" },
          { value: "PIECE", label: "Pièce" },
          { value: "BOITE", label: "Boîte" },
          { value: "PALETTE", label: "Palette" },
        ],
      },
      {
        name: "suggestedPrice",
        label: "Prix Suggéré (FCFA)",
        type: "number" as const,
        placeholder: "800",
        required: true,
        min: 1,
      },
      {
        name: "qualityGrade",
        label: "Grade de qualité",
        type: "select" as const,
        required: true,
        options: [
          { value: "A", label: "Grade A - Excellent" },
          { value: "B", label: "Grade B - Bon" },
          { value: "C", label: "Grade C - Acceptable" },
        ],
      },
      {
        name: "category",
        label: "Catégorie",
        type: "select" as const,
        required: true,
        options: [
          { value: "vegetables", label: "Légumes" },
          { value: "fruits", label: "Fruits" },
          { value: "grains", label: "Céréales" },
          { value: "livestock", label: "Élevage" },
          { value: "other", label: "Autre" },
        ],
      },
      {
        name: "originLocation",
        label: "Localisation d'Origine",
        type: "text" as const,
        placeholder: "Abidjan, Côte d'Ivoire",
        required: true,
      },
      {
        name: "productionMethod",
        label: "Méthode de Production",
        type: "select" as const,
        options: [
          { value: "CONVENTIONAL", label: "Conventionnel" },
          { value: "ORGANIC", label: "Biologique" },
          { value: "HYDROPONIC", label: "Hydroponique" },
          { value: "PERMACULTURE", label: "Permaculture" },
        ],
      },
      { name: "harvestDate", label: "Date de Récolte", type: "date" as const },
      {
        name: "availabilityDate",
        label: "Date de Disponibilité",
        type: "date" as const,
        required: true,
      },
      { name: "expiryDate", label: "Date d'Expiration", type: "date" as const },
      {
        name: "imageUrl",
        label: "URL de l'Image",
        type: "text" as const,
        placeholder: "https://example.com/image.jpg",
      },
      {
        name: "nutritionalInfo",
        label: "Informations Nutritionnelles (JSON)",
        type: "textarea" as const,
        rows: 3,
      },
      {
        name: "storageConditions",
        label: "Conditions de Stockage",
        type: "textarea" as const,
        rows: 3,
      },
      {
        name: "shelfLifeDays",
        label: "Durée de Vie (jours)",
        type: "number" as const,
      },
      {
        name: "certifications",
        label: "Certifications (JSON)",
        type: "textarea" as const,
        rows: 3,
      },
    ],
    []
  );

  const viewFields = useMemo(
    () => [
      {
        key: "productName",
        label: "Nom du produit",
      },
      {
        key: "description",
        label: "Description",
      },
      {
        key: "farmerName",
        label: "Agriculteur",
      },
      {
        key: "quantity",
        label: "Quantité",
      },
      {
        key: "quantityUnit",
        label: "Unité de Quantité",
      },
      {
        key: "suggestedPrice",
        label: "Prix Suggéré",
      },
      {
        key: "qualityGrade",
        label: "Grade de qualité",
      },
      {
        key: "category",
        label: "Catégorie",
      },
      {
        key: "subcategory",
        label: "Sous-catégorie",
      },
      {
        key: "originLocation",
        label: "Localisation d'Origine",
      },
      {
        key: "productionMethod",
        label: "Méthode de Production",
      },
      {
        key: "harvestDate",
        label: "Date de Récolte",
      },
      {
        key: "availabilityDate",
        label: "Date de Disponibilité",
      },
      {
        key: "expiryDate",
        label: "Date d'Expiration",
      },
      {
        key: "status",
        label: "Statut",
      },
      {
        key: "adminValidated",
        label: "Validé par Admin",
      },
      {
        key: "validatedBy",
        label: "Validé par (ID)",
      },
      {
        key: "validatedAt",
        label: "Date de Validation",
      },
      {
        key: "rejectionReason",
        label: "Raison du Rejet",
      },
      {
        key: "createdAt",
        label: "Date de Création",
      },
      {
        key: "updatedAt",
        label: "Date de Dernière Mise à Jour",
      },
      {
        key: "imageUrl",
        label: "URL de l'Image",
      },
      {
        key: "nutritionalInfo",
        label: "Informations Nutritionnelles",
      },
      {
        key: "storageConditions",
        label: "Conditions de Stockage",
      },
      {
        key: "shelfLifeDays",
        label: "Durée de Vie (jours)",
      },
      {
        key: "certifications",
        label: "Certifications",
      },
    ],
    []
  );

  const defaultFormData = useMemo(
    () => ({
      id: 0,
      productId: 0,
      farmerId: 0,
      farmerName: "",
      productName: "",
      description: "",
      category: "vegetables" as const,
      quantity: 0,
      quantityUnit: "KG" as const,
      suggestedPrice: 0,
      qualityGrade: "A" as const,
      originLocation: "",
      availabilityDate: "",
      status: "PENDING_VALIDATION" as const,
      adminValidated: false,
      createdAt: new Date().toISOString().split("T")[0],
    }),
    []
  );

  const validationRules = useMemo(
    () => ({
      productName: (value: unknown) => {
        if (!value || (typeof value === "string" && value.length < 2)) {
          return "Le nom du produit doit contenir au moins 2 caractères";
        }
        return null;
      },
      description: (value: unknown) => {
        if (!value || (typeof value === "string" && value.length < 10)) {
          return "La description doit contenir au moins 10 caractères";
        }
        return null;
      },
      farmerName: (value: unknown) => {
        if (!value || (typeof value === "string" && value.length < 2)) {
          return "Le nom de l'agriculteur doit contenir au moins 2 caractères";
        }
        return null;
      },
      quantity: (value: unknown) => {
        if (typeof value !== "number" || value < 1) {
          return "La quantité doit être un nombre supérieur à 0";
        }
        return null;
      },
      quantityUnit: (value: unknown) => {
        if (!value) {
          return "L'unité de quantité est requise";
        }
        return null;
      },
      suggestedPrice: (value: unknown) => {
        if (typeof value !== "number" || value < 1) {
          return "Le prix suggéré doit être un nombre supérieur à 0";
        }
        return null;
      },
      qualityGrade: (value: unknown) => {
        if (!value) {
          return "Le grade de qualité est requis";
        }
        return null;
      },
      category: (value: unknown) => {
        if (!value) {
          return "La catégorie est requise";
        }
        return null;
      },
      originLocation: (value: unknown) => {
        if (!value || (typeof value === "string" && value.length < 3)) {
          return "La localisation d'origine doit contenir au moins 3 caractères";
        }
        return null;
      },
      availabilityDate: (value: unknown) => {
        if (!value) {
          return "La date de disponibilité est requise";
        }
        return null;
      },
    }),
    []
  );

  const stats = useMemo(
    () => [
      {
        label: "Total Offres",
        value: productOffers.length,
        icon: Package,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
      },
      {
        label: "En Attente",
        value: productOffers.filter((p) => p.status === "PENDING_VALIDATION")
          .length,
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
      },
      {
        label: "Approuvées",
        value: productOffers.filter((p) => p.status === "ACTIVE").length,
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-100",
      },
      {
        label: "Rejetées",
        value: productOffers.filter((p) => p.status === "REJECTED").length,
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-100",
      },
    ],
    [productOffers]
  );

  const handleApproveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      console.log("Approving product offer:", selectedProductOffer);
      alert("Offre de produit approuvée avec succès !");
      setShowApproveModal(false);
      setSelectedProductOffer(null);
      fetchProductOffers(); // Refresh product offers list
    } catch (error) {
      console.error("Error approving product offer:", error);
      alert("Erreur lors de l'approbation de l'offre de produit.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      console.log("Rejecting product offer:", selectedProductOffer);
      alert("Offre de produit rejetée avec succès !");
      setShowRejectModal(false);
      setSelectedProductOffer(null);
      fetchProductOffers(); // Refresh product offers list
    } catch (error) {
      console.error("Error rejecting product offer:", error);
      alert("Erreur lors du rejet de l'offre de produit.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      console.log("Requesting info for product offer:", selectedProductOffer);
      alert("Demande d'informations envoyée avec succès !");
      setShowInfoModal(false);
      setSelectedProductOffer(null);
      fetchProductOffers(); // Refresh product offers list
    } catch (error) {
      console.error("Error requesting info for product offer:", error);
      alert("Erreur lors de la demande d'informations.");
    } finally {
      setIsLoading(false);
    }
  };

  const config = useMemo(
    () => ({
      title: "Validation des Produits",
      description:
        "Validez les offres de produits des agriculteurs, assurez la qualité et la conformité",
      icon: Package,
      stats,
      formFields,
      viewFields,
      columns,
      defaultFormData,
      validationRules,
    }),
    [stats, formFields, viewFields, columns, defaultFormData, validationRules]
  );

  return (
    <>
      <ManagementPage<ProductOffer> config={config} data={productOffers} />

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
            placeholder=""
            required
            options={[
              { value: "quality-insufficient", label: "Qualité insuffisante" },
              { value: "price-too-high", label: "Prix trop élevé" },
              { value: "missing-documents", label: "Documents manquants" },
              {
                value: "certification-issue",
                label: "Problème de certification",
              },
              { value: "other", label: "Autre" },
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
            placeholder=""
            required
            options={[
              { value: "certification", label: "Certifications" },
              { value: "quality-test", label: "Tests de qualité" },
              { value: "origin-proof", label: "Preuve d'origine" },
              { value: "storage-conditions", label: "Conditions de stockage" },
              { value: "other", label: "Autre" },
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
